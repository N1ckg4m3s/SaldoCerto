import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { clientService } = await import(pathToFileURL(path.join(__dirname, '..', 'services', 'clientService.js')).href);
const { movimentacoesService } = await import(pathToFileURL(path.join(__dirname, '..', 'services', 'movimentacoesService.js')).href);
const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);

export const IniciarControladores = () => {
    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('movimentacao:list', safeHandler(movimentacoesService.ObterMovimentacoes));

    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('movimentacao:listByClient', safeHandler(() => { }));

    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('movimentacao:create', safeHandler(movimentacoesService.AdicionarNovaMovimentação));

    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('movimentacao:delete', safeHandler(() => { }));
}