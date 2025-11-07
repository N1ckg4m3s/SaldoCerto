import { BrowserWindow, dialog } from "electron";

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });
const errorResponse = (context: string, message: any): IPCResponseFormat => ({
    success: false,
    message: `[${context}]: ${message}`,
});

export const SelecionarPasta = async (): Promise<IPCResponseFormat> => {
    try {
        const win = BrowserWindow.getFocusedWindow();

        if (!win) {
            return errorResponse('configurationService.SelecionarPasta', 'Nenhuma janela ativa encontrada');
        }

        const result = await dialog.showOpenDialog(win, {
            title: 'Selecione a pasta de backup',
            properties: ['openDirectory', 'createDirectory'],
        });

        if (result.canceled || !result.filePaths.length) {
            return errorResponse('configurationService.SelecionarPasta', 'Seleção cancelada pelo usuário');
        }

        const caminho = result.filePaths[0];
        return successResponse({ path: caminho });
    } catch (error: any) {
        return errorResponse("configurationService.SelecionarPasta", error.message || error);
    }
}