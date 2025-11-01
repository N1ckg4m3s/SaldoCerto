// movimentacoesRepo.ts
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

/* 🔧 Utilidades básicas (isolam responsabilidades pequenas) */
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

/* 📦 Setup do Prisma */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { prisma } = await import(
    pathToFileURL(path.join(__dirname, "..", "prismaConnection.js")).href
);

/* 🧩 Filtros reutilizáveis */
const filtroPedidosNaoAbatidos = (extra: any = {}) => ({
    tipo: "Pedido",
    OR: [
        { valorAbatido: null },
        { valor: { gt: prisma.movimentacao.fields.valorAbatido } },
    ],
    ...extra,
});

const pedidoNaoAbatido = (p: any) => (p.valorAbatido ?? 0) < p.valor;

/* 🔁 Query base comum */
const obterPedidosNaoAbatidosBase = async (
    whereExtra: any = {},
    single = false
): Promise<any[]> => {
    const result = await prisma.movimentacao[single ? "findFirst" : "findMany"]({
        where: filtroPedidosNaoAbatidos(whereExtra),
        orderBy: { vencimento: "asc" },
    });

    if (single) return result ? [result] : [];
    return result.filter(pedidoNaoAbatido);
};

/* 💼 Repositório */
export const RepositorioMovimentacoes = {
    adicionarMovimentacao: (dados: any) =>
        safe("RepositorioMovimentacoes.adicionarMovimentacao", async () => {
            return await prisma.movimentacao.create({
                data: {
                    tipo: dados.tipo,
                    data: new Date(dados.data),
                    vencimento: dados.vencimento,
                    valor: dados.valor,
                    valorAbatido: 0,
                    codigo: dados.codigo,
                    clienteId: dados.ClientId,
                },
            });
        }),

    atualizaMovimentacao: (dados: any) =>
        safe("RepositorioMovimentacoes.atualizaMovimentacao", async () => {
            return await prisma.movimentacao.update({
                where: { id: dados.id },
                data: dados.data,
            });
        }),

    obterMovimentacoes: (dados: any) =>
        safe("RepositorioMovimentacoes.obterMovimentacoes", async () => {
            const { page = 0, limit = 20, filtros = {} } = dados;
            const movimentacoesEncontradas = await prisma.movimentacao.findMany({
                where: filtros,
                orderBy: { data: "desc" },
                skip: page * limit,
                take: limit,
            });
            const total = await prisma.movimentacao.count();
            return {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                movimentacoes: movimentacoesEncontradas,
            };
        }),

    obterPedidosNaoAbatidosDoCliente: (dados: any) =>
        safe("RepositorioMovimentacoes.obterPedidosNaoAbatidosDoCliente", async () => {
            const todos = await prisma.movimentacao.findMany({
                where: { clienteId: dados.id, tipo: "Pedido" },
                orderBy: { data: "asc" },
            });
            return todos.filter(pedidoNaoAbatido);
        }),

    obterPedidosNaoAbatidos: () =>
        safe("movimentacoesRepo.obterPedidosNaoAbatidos", async () =>
            obterPedidosNaoAbatidosBase()
        ),

    obterPedidosVencidos: () =>
        safe("movimentacoesRepo.obterPedidosVencidos", async () => {
            const hoje = new Date();
            return obterPedidosNaoAbatidosBase({ vencimento: { lte: hoje } });
        }),

    obterProximosVencimentos: () =>
        safe("movimentacoesRepo.obterProximosVencimentos", async () => {
            const hoje = new Date();
            const seteDias = new Date();
            seteDias.setDate(hoje.getDate() + 7);
            return obterPedidosNaoAbatidosBase({
                vencimento: { gt: hoje, lte: seteDias },
            });
        }),

    obterTopDevedores: () =>
        safe("movimentacoesRepo.obterTopDevedores", async () => {
            const todas = await prisma.movimentacao.findMany({
                where: { tipo: "Pedido" },
                select: { clienteId: true, valor: true, valorAbatido: true },
            });

            const mapa = new Map<string, number>();
            for (const p of todas) {
                const saldo = p.valor - (p.valorAbatido ?? 0);
                if (saldo > 0)
                    mapa.set(p.clienteId, (mapa.get(p.clienteId) ?? 0) + saldo);
            }

            return [...mapa.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([clienteId, valor]) => ({ clienteId, valor }));
        }),

    obterProximaCobranca: () =>
        safe("movimentacoesRepo.obterProximaCobranca", async () => {
            const hoje = new Date();
            const [proxima] = await obterPedidosNaoAbatidosBase(
                { vencimento: { gt: hoje } },
                true
            );
            return proxima ?? null;
        }),

    obterMovimentacoesRecentes: () =>
        safe("movimentacoesRepo.obterMovimentacoesRecentes", async () => {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            return prisma.movimentacao.findMany({
                where: { data: { gte: seteDiasAtras } },
                orderBy: { data: "desc" },
            });
        }),

    ObterListaDeInadimplencia: (dados: any) =>
        safe("movimentacoesRepo.ObterListaDeInadimplencia", async () => {
            const page = dados.page ?? 0;
            const limit = dados.limit ?? 20;
            const hoje = new Date();

            const baseWhere = filtroPedidosNaoAbatidos({ vencimento: { lt: hoje } });

            const agrupados = await prisma.movimentacao.groupBy({
                by: ["clienteId"],
                where: baseWhere,
                _sum: { valor: true, valorAbatido: true },
                _count: { _all: true },
            });

            const vencimentos = await prisma.movimentacao.findMany({
                where: baseWhere,
                select: { clienteId: true, vencimento: true },
            });

            const mapaDiasAtraso = new Map<string, number>();
            for (const mov of vencimentos) {
                const dias = Math.floor(
                    (hoje.getTime() - mov.vencimento.getTime()) / (1000 * 60 * 60 * 24)
                );
                const atual = mapaDiasAtraso.get(mov.clienteId) ?? 0;
                mapaDiasAtraso.set(mov.clienteId, Math.max(atual, dias));
            }

            const lista = agrupados
                .map((r: any) => {
                    const abatido = r._sum.valorAbatido ?? 0;
                    const valor = r._sum.valor ?? 0;
                    const valorVencido = valor - abatido;
                    return {
                        clienteId: r.clienteId,
                        ValorVencido: valorVencido,
                        NumeroDeNotas: r._count._all,
                        DiasDeAtrazo: mapaDiasAtraso.get(r.clienteId) ?? 0,
                    };
                })
                .filter((r: any) => r.ValorVencido > 0)
                .sort((a: any, b: any) => b.ValorVencido - a.ValorVencido);

            const start = page * limit;
            return {
                currentPage: page,
                totalPages: Math.ceil(lista.length / limit),
                inadimplentes: lista.slice(start, start + limit),
            };
        }),
};
