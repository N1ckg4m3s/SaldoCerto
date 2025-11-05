import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioConfiguracoes } = await import(
    pathToFileURL(path.join(__dirname, "..", "repositories", "configRepo.js")).href
);

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

/* ---------- Serviço Principal ---------- */
export const configurationService = {
    ObterConfiguracao: async (): Promise<IPCResponseFormat> => {

        return successResponse({});
    }
};
