import { BrowserWindow, dialog } from "electron";
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

const { criarArquivoDeBackup } = await import(
    pathToFileURL(path.join(__dirname, "..", "infrastructure", "fileSystem", "criarArquivoDeBackup.js")).href
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
        return successResponse(repoResponse);
    },

    SalvarConfiguracao: async (args: any): Promise<IPCResponseFormat> => {
        // Validação dos dados
        const ConfigDTO = {
            backupFilesPath: String(args.backupFolderPath || ''),
            maxBackups: Number(args.maxBackupFiles || 5),
            backupInterval: Number(args.backupIntervalDays || 7),
            movimentacaoExpiraEmDias: Number(args.backupHistoryDays || 30),
            lastBackup: args.lastBackup ? new Date(args.lastBackup).toISOString() : null,
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
            console.log('Criando nova configuração');
            const repoResponse = await RepositorioConfiguracoes.adicionarConfiguracao(ConfigDTO);

            if (!repoResponse.success) {
                return errorResponse("configurationService.SalvarConfiguracao", repoResponse.message);
            }
        }

        return successResponse({});
    },

    GerarNovoBackup: async (args: any): Promise<IPCResponseFormat> => {
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

        if (!savePath || (savePath as IPCResponseFormat).success === false) {
            const atualizarConfiguracaoResponse = await RepositorioConfiguracoes.atualizarConfiguracao({ id: config.id, lastBackup: new Date().toISOString() });

            if (!atualizarConfiguracaoResponse.success) {
                return errorResponse("configurationService.GerarNovoBackup", atualizarConfiguracaoResponse.message);
            }
        }

        return successResponse();
    },

    RestaurarDeArquivoDeBackup: async (args: any): Promise<IPCResponseFormat> => {
        return successResponse({});
    },

    ListarArquivosDeBackup: async (args: any): Promise<IPCResponseFormat> => {
        return successResponse({});
    },

    DeletarArquivoDeBackup: async (args: any): Promise<IPCResponseFormat> => {
        if (!args || !args.fileName) {
            return errorResponse("configurationService.DeletarArquivoDeBackup", "Nome do arquivo não fornecido.");
        }

        return successResponse({});
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
};
