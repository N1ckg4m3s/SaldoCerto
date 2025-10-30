import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { dashboardService } = await import(pathToFileURL(path.join(__dirname, '..', 'services', 'dashboardService.js')).href);
const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);

export const IniciarControladores = () => {
    /*  */
    ipcMain.handle('dashboard:getResumo', safeHandler(dashboardService.obterResumoDasMovimentacoes));

    /*  */
    ipcMain.handle('dashboard:getProximasCobrancas', safeHandler(() => { }));

    /*  */
    ipcMain.handle('dashboard:getUltimasMovimentacoes', safeHandler(() => { }));

}