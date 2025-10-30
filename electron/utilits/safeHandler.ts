interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

/**
 * Garante que o retorno do handler possa ser enviado pelo IPC.
 * Evita o erro "An object could not be cloned" e padroniza o formato de erro.
 *
 * @param handler Função assíncrona chamada pelo ipcMain.handle
 * @returns Wrapper seguro para usar no ipcMain.handle
 */
export function safeHandler<T>(handler: (args: any[]) => Promise<T>) {
    return async (_: any, args: any[]): Promise<T | IPCResponseFormat> => {
        try {
            const result = await handler(args);
            return JSON.parse(JSON.stringify(result)); // garante clonabilidade
        } catch (e: any) {
            return { success: false, message: `[IPC Error]: ${e.message || e}` };
        }
    };
}