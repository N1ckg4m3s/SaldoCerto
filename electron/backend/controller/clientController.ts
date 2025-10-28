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
    ipcMain.handle('cliente:list', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })

    /* Obtem uma usuario pelo Id */
    ipcMain.handle('cliente:getById', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })

    /* Obtem uma usuario pelo search */
    ipcMain.handle('cliente:getBySearch', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })

    /* Cria um novo usuario */
    ipcMain.handle('cliente:create', safeHandler(clientService.AdicionarNovoCliente));
    // ipcMain.handle('cliente:create', async (_, args): Promise<IPCResponseFormat> => {
    //     try {
    //         return await JSON.stringify(clientService.AdicionarNovoCliente(args));
    //     } catch (e) {
    //         return { success: false, message: `[clientController cliente:create]: ${e}` };
    //     }
    // });

    /* Atualiza as informações do usuario */
    ipcMain.handle('cliente:update', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })

    /* Remove um usuario especifico */
    ipcMain.handle('cliente:delete', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })

    /* Obtem uma lista com todos os usuarios "vencidos" por pagina */
    ipcMain.handle('cliente:listInadimplentes', async (_, args): Promise<IPCResponseFormat> => {
        return { success: true }
    })
}