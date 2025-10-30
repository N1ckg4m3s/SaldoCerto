import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { dashboardService } = await import(pathToFileURL(path.join(__dirname, '..', 'services', 'dashboardService.js')).href);
const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);

export const IniciarControladores = () => {
    /* Gera o resumo dos cards */
    ipcMain.handle('dashboard:getResumo', safeHandler(dashboardService.obterResumoDasMovimentacoes));
    
    /* Obtem uma lista com as proximas 10 cobranças */
    ipcMain.handle('dashboard:getProximasCobrancas', safeHandler(dashboardService.obterListaDeProximasCobrancas));

    /* Obtem uma lista (limite 10) com as ultimas movimentações */
    ipcMain.handle('dashboard:getUltimasMovimentacoes', safeHandler(() => { }));

}