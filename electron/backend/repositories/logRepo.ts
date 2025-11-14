// clienteRepo.ts
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

/* 🔧 Utilidades comuns */
const ok = (data?: any): IPCResponseFormat => ({ success: true, data });
const fail = (ctx: string, e: unknown): IPCResponseFormat => ({
    success: false,
    message: `[${ctx}]: ${e}`,
});

async function safe<T>(
    ctx: string,
    fn: () => Promise<T>
): Promise<IPCResponseFormat> {
    try {
        const data = await fn();
        return ok(data);
    } catch (e) {
        return fail(ctx, e);
    }
}

/* ⚙️ Setup do Prisma */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { prisma } = await import(
    pathToFileURL(path.join(__dirname, "..", "prismaConnection.js")).href
);

/* 💼 Repositório de Clientes */
export const RepositorioLogs = {
    obterLogs: async (dados: any): Promise<IPCResponseFormat> => {
        return safe("RepositorioLogs.obterLogs", async () => {
            const { page = 0, limit = 20, filtros = {} } = dados;
            const logsEncontrados = await prisma.logs.findMany({
                where: filtros,
                orderBy: { data: "desc" },
                skip: page * limit,
                take: limit,
            });
            const total = await prisma.logs.count({
                where: filtros,
            });
            return {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                logs: logsEncontrados,
            };
        });
    },

    adicionarLog: async (dados: any): Promise<IPCResponseFormat> => {
        return safe("RepositorioLogs.adicionarLog", async () => {
            const createLog = await prisma.logs.create({
                data: dados,
            });
            return createLog
        });
    },

    limparLogsAntigos: async (dataLimite: Date): Promise<IPCResponseFormat> => {
        return safe("RepositorioLogs.limparLogsAntigos", async () => {
            const deletedCount = await prisma.logs.deleteMany({
                where: {
                    data: {
                        lt: new Date(dataLimite)
                    },
                }
            });
            return deletedCount;
        });
    },
};
