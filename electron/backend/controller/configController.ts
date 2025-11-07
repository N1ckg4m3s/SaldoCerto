import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);
const { onInitApp } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'onInitApp.js')).href);

const { configurationService } = await import(
    pathToFileURL(path.join(__dirname, '..', 'services', 'configService.js')).href
);

/* Service das configurações */

// Backup Config Controller [SISTEM CONFIGURATION CONTROLLER]
export const IniciarControladores = () => {
    /* Obtem as informações do backup */
    ipcMain.handle('config:get', safeHandler(configurationService.ObterConfiguracao));

    /* Salva informações de configuração do backup */
    ipcMain.handle('config:set', safeHandler(configurationService.SalvarConfiguracao));

    /* Gera um arquivo de backup do banco atual */
    ipcMain.handle('config:generateBackupFile', safeHandler(configurationService.GerarNovoBackup));

    /* Restaura o banco de dados a partir de um arquivo de backup */
    ipcMain.handle('config:restoreFromBackupFile', safeHandler(configurationService.RestaurarDeArquivoDeBackup));

    /* Seleciona uma pasta */
    ipcMain.handle('config:selectFolder', safeHandler(configurationService.SelecionarPasta));

    /* Função executada ao iniciar o app [SISTEMA] * /
        - Verifica a existencia de uma configuração salva;
        - Verifica se é necessário salvar um backup;
        - Verifica se é necessário remover algum arquivo de backup exedente.
        - Verifica se é necessário rodar a limpeza automática.
    */
    ipcMain.handle('config:init', safeHandler(onInitApp));
}