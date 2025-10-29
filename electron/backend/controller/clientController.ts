import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { clientService } = await import(pathToFileURL(path.join(__dirname, '..', 'services', 'clientService.js')).href);
const { safeHandler } = await import(pathToFileURL(path.join(__dirname, '..', '..', 'utilits', 'safeHandler.js')).href);

export const IniciarControladores = () => {
    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('cliente:list', safeHandler(clientService.ObterClientes));

    /* Obtem uma usuario pelo Id */
    ipcMain.handle('cliente:getById', safeHandler(clientService.ObterClientePorId));

    /* Obtem uma usuario pelo search */
    ipcMain.handle('cliente:getBySearch', safeHandler(() => { }))

    /* Cria um novo usuario */
    ipcMain.handle('cliente:create', safeHandler(clientService.AdicionarNovoCliente));

    /* Atualiza as informações do usuario */
    ipcMain.handle('cliente:update', safeHandler(clientService.AtualizarInformacoesDoCliente))

    /* Remove um usuario especifico */
    ipcMain.handle('cliente:delete', safeHandler(clientService.RemoverCliente))

    /* Obtem uma lista com todos os usuarios "vencidos" por pagina */
    ipcMain.handle('cliente:listInadimplentes', safeHandler(() => { }))

    /* Obtem uma lista com todos nome e id do usuario */
    ipcMain.handle('cliente:searchByName', safeHandler(clientService.ObterIdENomeClientes))
}