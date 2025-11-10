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

export const SelecionarArquivo = async (): Promise<IPCResponseFormat> => {
    try {
        const win = BrowserWindow.getFocusedWindow();
        
        if (!win) {
            return errorResponse('configurationService.SelecionarArquivo', 'Nenhuma janela ativa encontrada');
        }
        
        const result = await dialog.showOpenDialog(win, {
            title: 'Selecione o arquivo de banco de dados',
            properties: ['openFile'],
            filters: [
                { name: 'Banco de Dados', extensions: ['db'] },
                { name: 'Todos os Arquivos', extensions: ['*'] }
            ]
        });
        
        if (result.canceled || !result.filePaths.length) {
            return errorResponse('configurationService.SelecionarArquivo', 'Seleção cancelada pelo usuário');
        }
        const caminho = result.filePaths[0];
        
        if (!caminho || !caminho.endsWith('.db')) {
            return errorResponse('configurationService.SelecionarArquivo', 'O arquivo selecionado não é "arquivo.db"');
        }

        return successResponse({ path: caminho });
    } catch (error: any) {
        return errorResponse("configurationService.SelecionarArquivo", error.message || error);
    }
}