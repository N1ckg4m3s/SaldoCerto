import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Service das configurações */
const { configurationService } = await import(
    pathToFileURL(path.join(__dirname, '..', 'backend', 'services', 'configService.js')).href
);

/*
==================== Função executada ao iniciar o app ====================

    - Verifica a existencia de uma configuração salva; - ok
    - Verifica se é necessário salvar um backup; - ok
    - Verifica se é necessário remover algum arquivo de backup exedente. - 
    - Verifica se é necessário rodar a limpeza automática. -
*/
export const onInitApp = async (): Promise<boolean> => {
    const configServiceResponse = await configurationService.ObterConfiguracao();
    if (!configServiceResponse.success || !configServiceResponse.data) return false;

    const config = configServiceResponse.data;

    // Verifica se é necessário gerar um novo backup
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ultimoBackup = config.lastBackup ? new Date(config.lastBackup) : null;
    if (!ultimoBackup) return false;
    ultimoBackup.setHours(0, 0, 0, 0);

    const diffTime = hoje.getTime() - ultimoBackup.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Se passou o intervalo definido, gera um novo backup
    if (diffDays >= config.backupInterval) {
        await configurationService.GerarNovoBackup();
    }

    // Verifica se é necessário remover arquivos de backup exedentes
    const ListarArquivosDeBackupResponse = await configurationService.ListarArquivosDeBackup();
    if (!ListarArquivosDeBackupResponse.success || !ListarArquivosDeBackupResponse.data) return false;
    const backupFiles = ListarArquivosDeBackupResponse.data as Array<any>;
    const maxBackups = config.maxBackups;

    if (backupFiles.length > maxBackups) {
        backupFiles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const filesToDelete = backupFiles.slice(0, backupFiles.length - maxBackups);
        for (const file of filesToDelete) {
            await configurationService.DeletarArquivoDeBackup({ fileName: file.name });
        }
    }

    // Roda a limpesa automática de movimentações antigas
    const dataLimite = hoje.setDate(hoje.getDate() + config.movimentacaoExpiraEmDias);
    await configurationService.RodarLimpeza({ dataLimite: new Date(dataLimite) });

    return true;
}