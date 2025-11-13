import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioConfiguracoes } = await import(
    pathToFileURL(path.join(__dirname, "..", "repositories", "configRepo.js")).href
);

const { SelecionarPasta } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "fileSystem", "selecionarPasta.js")).href
);

const { SelecionarArquivo } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "fileSystem", "selecionarArquivo.js")).href
);

const { criarArquivoDeBackup } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "fileSystem", "criarArquivoDeBackup.js")).href
);

const { validateBancoRestore } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "validateBancoRestore.js")).href
);

const { existsFile, copyFile } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "fileSystem", "fileHandler.js")).href
);
const { listarArquivosDaPasta } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "fileSystem", "listarArquivosDaPasta.js")).href
);

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

/* ---------- Utils ---------- */
const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });
const errorResponse = (context: string, message: any): IPCResponseFormat => ({
    success: false,
    message: `[${context}]: ${message}`,
});

/* ---------- Serviço Principal ---------- */
export const configurationService = {
    ObterConfiguracao: async (): Promise<IPCResponseFormat> => {
        const repoResponse = await RepositorioConfiguracoes.obterConfiguracao();
        if (!repoResponse.success) {
            return errorResponse("configurationService.ObterConfiguracao", repoResponse.message);
        }
        return successResponse(repoResponse.data);
    },

    SalvarConfiguracao: async (args: any): Promise<IPCResponseFormat> => {
        // Validação dos dados
        const ConfigDTO = {
            backupFilesPath: String(args.backupFolderPath || ''),
            maxBackups: Number(args.maxBackupFiles || 5),
            backupInterval: Number(args.backupIntervalDays || 7),
            movimentacaoExpiraEmDias: Number(args.backupHistoryDays || 30),
            lastBackup: args.lastBackup ? new Date(args.lastBackup).toISOString() : new Date().toISOString(),
        };

        const existingConfigResponse = await RepositorioConfiguracoes.obterConfiguracao();
        if (!existingConfigResponse.success) {
            return errorResponse("configurationService.SalvarConfiguracao", existingConfigResponse.message);
        }

        const hasExistingConfig = existingConfigResponse.data !== null && existingConfigResponse.data !== undefined;
        if (hasExistingConfig) {
            const repoResponse = await RepositorioConfiguracoes.atualizarConfiguracao({ id: existingConfigResponse.data.id, ...ConfigDTO });
            if (!repoResponse.success) {
                return errorResponse("configurationService.SalvarConfiguracao", repoResponse.message);
            }
            return successResponse({});
        } else {
            const repoResponse = await RepositorioConfiguracoes.adicionarConfiguracao(ConfigDTO);

            if (!repoResponse.success) {
                return errorResponse("configurationService.SalvarConfiguracao", repoResponse.message);
            }
        }

        return successResponse({});
    },

    setAparence: async (args: any): Promise<IPCResponseFormat> => {
        const AparenceDTO = {
            fontSize: args.fontSize || 'normal',
            darkMode: args.darkMode || false,
        }

        const existingConfigResponse = await RepositorioConfiguracoes.obterConfiguracao();
        if (!existingConfigResponse.success) {
            return errorResponse("configurationService.setAparence", existingConfigResponse.message);
        }

        const hasExistingConfig = existingConfigResponse.data !== null && existingConfigResponse.data !== undefined;
        if (hasExistingConfig) {
            const repoResponse = await RepositorioConfiguracoes.atualizarConfiguracao({ id: existingConfigResponse.data.id, ...AparenceDTO });
            if (!repoResponse.success) {
                return errorResponse("configurationService.setAparence", repoResponse.message);
            }
            return successResponse({});
        } else {
            return errorResponse("configurationService.setAparence", "Não tem configuração pre salva");
        }
    },

    GerarNovoBackup: async (): Promise<IPCResponseFormat> => {
        const serviceResponse = await configurationService.ObterConfiguracao();
        if (!serviceResponse.success) return errorResponse("configurationService.GerarNovoBackup", serviceResponse.message);

        const config = serviceResponse.data;

        const ultimoBackup = config.lastBackup ? new Date(config.lastBackup) : null;
        if (!ultimoBackup) return errorResponse("configurationService.GerarNovoBackup", 'Sem data de último backup registrada.');
        ultimoBackup.setHours(0, 0, 0, 0);

        const caminhoPastaBackup = config.backupFilesPath;
        if (!caminhoPastaBackup) return errorResponse("configurationService.GerarNovoBackup", 'Caminho da pasta de backup não configurado.');

        const savePath = await criarArquivoDeBackup(caminhoPastaBackup)
            .catch((erro: any) => {
                return errorResponse("configurationService.GerarNovoBackup", erro.message);
            });

        if (savePath && typeof savePath === 'string') {
            const atualizarConfiguracaoResponse = await RepositorioConfiguracoes.atualizarConfiguracao({ id: config.id, lastBackup: new Date().toISOString() });

            if (!atualizarConfiguracaoResponse.success) {
                return errorResponse("configurationService.GerarNovoBackup", atualizarConfiguracaoResponse.message);
            }
        } else {
            return errorResponse("configurationService.GerarNovoBackup", 'Falha ao criar arquivo de backup.');
        }

        return successResponse({ path: savePath });
    },

    RestaurarDeArquivoDeBackup: async (args: any): Promise<IPCResponseFormat> => {
        const caminhoBackup = args.path;
        if (!caminhoBackup) return errorResponse('configurationService.RestaurarDeArquivoDeBackup', 'Sem caminho de arquivo informado');

        if (!caminhoBackup.endsWith(".db"))
            return errorResponse('configurationService.RestaurarDeArquivoDeBackup', 'Tipagem do arquivo incorreta');

        if (!await existsFile(caminhoBackup))
            return errorResponse('configurationService.RestaurarDeArquivoDeBackup', 'Arquivo não encontrado');

        const [valido, erro] = await validateBancoRestore(caminhoBackup);
        if (!valido)
            return errorResponse('configurationService.RestaurarDeArquivoDeBackup', erro);

        // 1️⃣ Localiza o banco ativo via .env
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl || !dbUrl.startsWith("file:")) {
            return errorResponse('configurationService.RestaurarDeArquivoDeBackup', 'DATABASE_URL inválida ou ausente no .env');
        }

        const caminhoBancoAtual = path.resolve('prisma', dbUrl.replace("file:", ""));

        if (!await existsFile(caminhoBancoAtual)) {
            return errorResponse('configurationService.RestaurarDeArquivoDeBackup', `Banco atual não encontrado: ${caminhoBancoAtual}`);
        }

        // Cria um backup
        const configServiceResponse = await configurationService.GerarNovoBackup();
        if (!configServiceResponse.success) return configServiceResponse; // já tem success e message

        // 4️⃣ Restaurar (substituir o banco atual)
        try {
            await copyFile(caminhoBackup, caminhoBancoAtual);
        } catch (error) {
            return errorResponse('configurationService.RestaurarDeArquivoDeBackup', `Erro ao restaurar banco: ${error}`);
        }

        return successResponse({
            restoredFrom: caminhoBackup,
            backupBeforeRestore: configServiceResponse.data
        });
    },

    ListarArquivosDeBackup: async (args: any): Promise<IPCResponseFormat> => {
        const existingConfigResponse = await RepositorioConfiguracoes.obterConfiguracao();
        if (!existingConfigResponse.success) {
            return errorResponse("configurationService.SalvarConfiguracao", existingConfigResponse.message);
        }

        const backupFilesPath = existingConfigResponse.data?.backupFolderPath
        const arquivosDaPasta = await listarArquivosDaPasta({ backupFilesPath });

        if (!arquivosDaPasta.success) return arquivosDaPasta;
        return successResponse(arquivosDaPasta.data.arquivos);
    },

    DeletarArquivoDeBackup: async (args: any): Promise<IPCResponseFormat> => {
        try {
            const { fileName, backupFolderPath } = args;
            if (!fileName) return errorResponse("DeletarArquivoDeBackup", "Nome do arquivo não fornecido.");
            if (!backupFolderPath) return errorResponse("DeletarArquivoDeBackup", "Caminho da pasta não informado.");

            const filePath = path.join(backupFolderPath, fileName);
            if (!fs.existsSync(filePath)) return errorResponse("DeletarArquivoDeBackup", "Arquivo não encontrado.");

            await fs.promises.unlink(filePath);
            return successResponse({ message: "Arquivo excluído com sucesso." });
        } catch (err) {
            return errorResponse("DeletarArquivoDeBackup", err);
        }
    },

    RodarLimpeza: async (args: any): Promise<IPCResponseFormat> => {
        if (!args || !args.dataLimite) {
            return errorResponse("configurationService.RodarLimpeza", "Data limite não fornecida.");
        }

        const repoResponse = await RepositorioConfiguracoes.limparMovimentacoesAntigas(args.dataLimite);

        if (!repoResponse.success) {
            return errorResponse("configurationService.RodarLimpeza", repoResponse.message);
        }

        return successResponse({});
    },

    SelecionarPasta: async (): Promise<IPCResponseFormat> => SelecionarPasta(),

    SelecionarArquivo: async (): Promise<IPCResponseFormat> => SelecionarArquivo(),
};
