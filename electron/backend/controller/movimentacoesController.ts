import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { movimentacoesService } = await import(pathToFileURL(path.join(__dirname, '..', 'services', 'movimentacoesService.js')).href);
const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);

export const IniciarControladores = () => {
    /* Obtem uma lista com as movimentações por pagina*/
    ipcMain.handle('movimentacao:list', safeHandler(movimentacoesService.ObterMovimentacoes));

    /* Obtem uma lista com as movimentações por usuario */
    ipcMain.handle('movimentacao:listByClient', safeHandler(movimentacoesService.ObterMovimentacoesPorID));

    /* Adiciona uma nova movimentação */
    ipcMain.handle('movimentacao:create', safeHandler(movimentacoesService.AdicionarNovaMovimentação));

    /* Remove a movimentação */
    ipcMain.handle('movimentacao:delete', safeHandler(() => { }));

    /* Obtem uma lista com clientes com notas vencidas. */
    ipcMain.handle('movimentacao:listInadimplentes', safeHandler(movimentacoesService.ObterListaDeInadimplencia));
}