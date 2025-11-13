import fs from 'fs'
import path from 'path';

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

/* ---------- Utils ---------- */
const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });
const errorResponse = (context: string, message: any): IPCResponseFormat => ({
    success: false,
    message: `[${context}]: ${message}`,
});

export const listarArquivosDaPasta = async (args: any) => {
    try {
        const folderPath = args?.backupFolderPath;
        if (!folderPath || !fs.existsSync(folderPath))
            return errorResponse("ListarArquivosDeBackup", "Pasta não encontrada.");

        const arquivos = await fs.promises.readdir(folderPath);
        const dbFiles = arquivos
            .filter(f => f.endsWith(".db"))
            .map(f => ({
                name: f,
                fullPath: path.join(folderPath, f),
                sizeKB: (fs.statSync(path.join(folderPath, f)).size / 1024).toFixed(1),
                lastModified: fs.statSync(path.join(folderPath, f)).mtime
            }));

        return successResponse({ arquivos: dbFiles });
    } catch (err) {
        return errorResponse("ListarArquivosDeBackup", err);
    }
}