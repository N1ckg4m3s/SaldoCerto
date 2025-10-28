import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

/* Chegar ao Serviço */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicePath = path.join(__dirname, '..', 'services', 'clientService.js');

const serviceUrl = pathToFileURL(servicePath).href;

const { clientService } = await import(serviceUrl);

/*

Controlador tem foco em receber os 'handlers' e mandar para as regras do negocio

ipcMain.handle('<NOME>', async (_, args) => {
    // Aqui chama o service para obter os dados necessarios
});

*/

export const IniciarControladores = () => {

    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('cliente:list', async (_, args) => {

    })

    /* Obtem uma usuario pelo Id */
    ipcMain.handle('cliente:getById', async (_, args) => {

    })

    /* Obtem uma usuario pelo search */
    ipcMain.handle('cliente:getBySearch', async (_, args) => {

    })

    /* Cria um novo usuario */IniciarControladores
    ipcMain.handle('cliente:create', async (_, args) => clientService.AdicionarNovoCliente(args));

    /* Atualiza as informações do usuario */
    ipcMain.handle('cliente:update', async (_, args) => {

    })

    /* Remove um usuario especifico */
    ipcMain.handle('cliente:delete', async (_, args) => {

    })

    /* Obtem uma lista com todos os usuarios "vencidos" por pagina */
    ipcMain.handle('cliente:listInadimplentes', async (_, args) => {

    })
}