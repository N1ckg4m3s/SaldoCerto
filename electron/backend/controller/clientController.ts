import { ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

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

/**
 * Garante que o retorno do handler possa ser enviado pelo IPC.
 * Evita o erro "An object could not be cloned" e padroniza o formato de erro.
 *
 * @param handler Função assíncrona chamada pelo ipcMain.handle
 * @returns Wrapper seguro para usar no ipcMain.handle
 */
function safeHandler<T>(handler: (args: any[]) => Promise<T>) {
    return async (_: any, args: any[]): Promise<T | IPCResponseFormat> => {
        try {
            const result = await handler(args);
            return JSON.parse(JSON.stringify(result)); // garante clonabilidade
        } catch (e: any) {
            return { success: false, message: `[IPC Error]: ${e.message || e}` };
        }
    };
}

export const IniciarControladores = () => {
    /* Obtem uma lista com todos os usuarios por pagina*/
    ipcMain.handle('cliente:list', safeHandler(clientService.ObterClientes));

    /* Obtem uma usuario pelo Id */
    ipcMain.handle('cliente:getById', safeHandler(clientService.ObterClientePorId));

    /* Obtem uma usuario pelo search */
    ipcMain.handle('cliente:getBySearch', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })

    /* Cria um novo usuario */
    ipcMain.handle('cliente:create', safeHandler(clientService.AdicionarNovoCliente));

    /* Atualiza as informações do usuario */
    ipcMain.handle('cliente:update', safeHandler(clientService.AtualizarInformacoesDoCliente))

    /* Remove um usuario especifico */
    ipcMain.handle('cliente:delete', safeHandler(clientService.RemoverCliente))

    /* Obtem uma lista com todos os usuarios "vencidos" por pagina */
    ipcMain.handle('cliente:listInadimplentes', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })
}