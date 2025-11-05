import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);

const { configurationService } = await import(
    pathToFileURL(path.join(__dirname, '..', 'services', 'configService.js')).href
);

// Backup Config Controller [SISTEM CONFIGURATION CONTROLLER]
export const IniciarControladores = () => {
    /* Obtem as informações do backup */
    ipcMain.handle('config:get', safeHandler(() => { }));

    /* Salva informações de configuração do backup */
    ipcMain.handle('config:set', safeHandler(() => { }));

    /* Gera um arquivo de backup do banco atual */
    ipcMain.handle('config:generateBackupFile', safeHandler(() => { }));

    /* Restaura o banco de dados a partir de um arquivo de backup */
    ipcMain.handle('config:restoreFromBackupFile', safeHandler(() => { }));

    /* Lista os backups que tem */
    ipcMain.handle('config:listBackupFiles', safeHandler(() => { }));

    /* Mantem uma quantidade de arquivos de restauração */
    ipcMain.handle('config:deleteBackupFile', safeHandler(() => { }));

    /* Roda uma limpesa no banco com base no valor previsto */
    ipcMain.handle('config:runCleanup', safeHandler(() => { }));
}