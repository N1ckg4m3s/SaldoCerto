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
export const RepositorioCliente = {
    adicionarCliente: (dados: any) =>
        safe("RepositorioCliente.adicionarCliente", async () => {
            return await prisma.cliente.create({
                data: {
                    nome: dados.nome,
                    telefone: dados.telefone,
                    tipoContrato: dados.contrato.type,
                    diaContrato: dados.contrato.dia,
                },
            });
        }),

    atualizarInformacoesDoCliente: (dados: any) =>
        safe("RepositorioCliente.atualizarInformacoesDoCliente", async () => {
            return await prisma.cliente.update({
                where: { id: dados.id },
                data: {
                    nome: dados.nome,
                    telefone: dados.telefone,
                    tipoContrato: dados.contrato.type,
                    diaContrato: dados.contrato.dia,
                },
            });
        }),

    removerInformacoesDoCliente: (dados: any) =>
        safe("RepositorioCliente.removerInformacoesDoCliente", async () => {
            // remove movimentações vinculadas antes do cliente
            await prisma.movimentacao.deleteMany({
                where: { clienteId: dados.id },
            });

            return await prisma.cliente.delete({
                where: { id: dados.id },
            });
        }),

    obterClientePorId: (dados: any) =>
        safe("RepositorioCliente.obterClientePorId", async () => {
            const cliente = await prisma.cliente.findUnique({
                where: { id: dados.id },
            });

            if (!cliente) throw new Error("Cliente não encontrado");
            return cliente;
        }),

    obterClientes: (dados: any) =>
        safe("RepositorioCliente.obterClientes", async () => {
            const { page = 0, limit = 20, search = "" } = dados;

            const [clientes, total] = await Promise.all([
                prisma.cliente.findMany({
                    where: { nome: { contains: search } },
                    orderBy: { nome: "asc" },
                    skip: page * limit,
                    take: limit,
                }),
                prisma.cliente.count({
                    where: { nome: { contains: search } },
                }),
            ]);

            return {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                clients: clientes,
            };
        }),
};
