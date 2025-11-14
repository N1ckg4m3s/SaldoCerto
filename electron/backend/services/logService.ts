import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioLogs } = await import(pathToFileURL(path.join(__dirname, '..', 'repositories', "logRepo.js")).href);

/* ---------- Typing ---------- */
interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}
interface log {
    data: string,
    message?: string,
    title?: string,
    type?: 'error' | 'warning' | 'success',
}

/* ---------- Utils ---------- */
const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });

/* ---------- Serviço Principal ---------- */
export const logService = {
    obterLogs: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            let { page = 0, limit = 20, filters = {} } = dados;
            const filtros: any = {};

            if (filters) {
                const deData = filters.de ? new Date(filters.de) : null;
                const ateData = filters.ate ? new Date(filters.ate) : null;
                if (deData && ateData) filtros.data = { gte: deData, lte: ateData };
            }

            if (filters.tipoLog) filtros.type = filters.tipoLog;

            const serviceResponse = await RepositorioLogs.obterLogs({ page, limit, filtros })
            if (!serviceResponse.sucesso) return serviceResponse;

            return successResponse(serviceResponse.data)
        } catch (e) {
            console.error(`[logService.obterLogs]: ${e}`)
        }

        // 'Sucesso falso'
        return successResponse({ logs: [] });
    },

    adicionarLog: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            if (!dados) throw new Error('Informações do log não informado');
            if (!dados.title) throw new Error('Titulo do log não informado');
            if (!dados.type) throw new Error('Tipo do log não informado');

            const logsDTO = {
                data: new Date(Date.now()),
                title: dados.title || '',
                mensagem: dados.mensagem || '',
                type: dados.type || '',
            }

            const serviceResponse = await RepositorioLogs.adicionarLog(logsDTO)
            if (!serviceResponse.success) return serviceResponse;
        } catch (e) {
            console.error(`[logService.adicionarLog]: ${e}`)
        }

        return successResponse();
    },

    limparLogsAntigos: async (): Promise<IPCResponseFormat> => {
        const dataLimite = new Date();
        dataLimite.setUTCDate(dataLimite.getUTCDate() - 50);

        const ServiceReturn = await RepositorioLogs.limparLogsAntigos(dataLimite);
        if (!ServiceReturn.sucess) return ServiceReturn;

        return successResponse()
    }
};
