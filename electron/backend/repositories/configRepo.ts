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
export const RepositorioConfiguracoes = {
    obterConfiguracao: async (): Promise<IPCResponseFormat> => {
        return safe("RepositorioConfiguracoes.obterConfiguracao", async () => {
            const config = await prisma.configuracao.findFirst();
            return config ?? undefined
        });
    },

    adicionarConfiguracao: async (dados: any): Promise<IPCResponseFormat> => {
        return safe("RepositorioConfiguracoes.atualizarConfiguracao", async () => {
            const updatedConfig = await prisma.configuracao.create({
                data: dados,
            });
            return updatedConfig
        });
    },

    atualizarConfiguracao: async (dados: any): Promise<IPCResponseFormat> => {
        return safe("RepositorioConfiguracoes.atualizarConfiguracao", async () => {
            const updatedConfig = await prisma.configuracao.update({
                where: { id: dados.id },
                data: dados,
            });
            return updatedConfig
        });
    },

    limparMovimentacoesAntigas: async (dataLimite: Date): Promise<IPCResponseFormat> => {
        return safe("RepositorioConfiguracoes.limparMovimentacoesAntigas", async () => {
            const deletedCount = await prisma.movimentacao.deleteMany({
                where: {
                    OR: [
                        {
                            AND: [
                                { tipo: 'Pedido' },
                                { pago: true },
                                { data: { lt: new Date(dataLimite) } },
                            ],
                        },
                        {
                            AND: [
                                { tipo: 'Pagamento' },
                                { data: { lt: new Date(dataLimite) } },
                            ],
                        },
                    ],
                },
            });

            return deletedCount;
        });
    },
};
