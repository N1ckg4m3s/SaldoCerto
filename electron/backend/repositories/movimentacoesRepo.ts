import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

/* Chegar ao Prisma */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { prisma } = await import(pathToFileURL(path.join(__dirname, '..', 'prismaConnection.js')).href);

/*
    Repositorio, tem como função ser o UNICO a acessar o banco de dados
        para todos os fins de acesso possive: GET, GET-FILTER, SET, UPDATE, DELETE...
*/
const obterPedidosNaoAbatidosBase = async (whereExtra: any = {}, single = false): Promise<any[]> => {
    const query = prisma.movimentacao[single ? 'findFirst' : 'findMany']({
        where: {
            tipo: 'Pedido',
            OR: [
                { valorAbatido: null },
                { valor: { gt: prisma.movimentacao.fields.valorAbatido } },
            ],
            ...whereExtra,
        },
        orderBy: { vencimento: 'asc' },
    });

    const result = await query;
    if (single) return result ? [result] : [];
    return result.filter((p: any) => (p.valorAbatido ?? 0) < p.valor);
};

export const RepositorioMovimentacoes = {
    adicionarMovimentacao: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const novaMovimentacao = await prisma.movimentacao.create({
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

            if (novaMovimentacao) {
                return { success: true }
            } else {
                return { success: false, message: '[Erro não identificado]: RepositorioMovimentacoes.adicionarMovimentacao' }
            }
        } catch (e) {
            return { success: false, message: `[RepositorioMovimentacoes.adicionarMovimentacao]: ${e}` }
        }
    },

    // Esse atualiza é apenas interno, o usuario não pode alterar, apenas apagar.
    atualizaMovimentacao: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const novaMovimentacao = await prisma.movimentacao.update({
                where: { id: dados.id },
                data: dados.data,
            });

            if (novaMovimentacao) {
                return { success: true }
            } else {
                return { success: false, message: '[Erro não identificado]: RepositorioMovimentacoes.adicionarMovimentacao' }
            }
        } catch (e) {
            return { success: false, message: `[RepositorioMovimentacoes.adicionarMovimentacao]: ${e}` }
        }
    },

    obterMovimentacoes: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            // preciso adicionar 'de, até' e tipo, sendo: Todos, Pedidos, Pagamentos.
            const { page = 0, limit = 20, filtros = {} } = dados;

            const movimentacoesEncontradas = await prisma.movimentacao.findMany({
                where: filtros,
                orderBy: { data: 'desc' },
                skip: page * limit,
                take: limit,
            });

            const total = await prisma.movimentacao.count();

            return {
                success: true,
                data: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    movimentacoes: movimentacoesEncontradas,
                },
            };
        } catch (e) {
            return { success: false, message: `[RepositorioCliente.obterClientes]: ${e}` }
        }
    },

    obterPedidosNaoAbatidosDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        // Obtem todas os pedidos de um cliente que não esta abatido
        try {
            const todosOsPedidos = await prisma.movimentacao.findMany({
                where: {
                    clienteId: dados.id, // id do usuario a ser 
                    tipo: 'Pedido',
                },
                orderBy: {
                    data: 'asc', // mais antigo primeiro
                },
            });

            const pedidosNaoAbatidos = todosOsPedidos.filter((p: any) => {
                const abatido = p.valorAbatido ?? 0;
                return abatido < p.valor;
            });


            if (pedidosNaoAbatidos) {
                return { success: true, data: pedidosNaoAbatidos }
            } else {
                return { success: false, message: '[Erro não identificado]: RepositorioMovimentacoes.adicionarMovimentacao' }
            }

            return { success: true }
        } catch (e) {
            return { success: false, message: `[RepositorioMovimentacoes.adicionarMovimentacao]: ${e}` }
        }
    },

    obterPedidosNaoAbatidos: async (): Promise<IPCResponseFormat> => {
        try {
            const filtrados = await obterPedidosNaoAbatidosBase();
            return { success: true, data: filtrados };
        } catch (e) {
            return { success: false, message: `[movimentacoesRepo.obterPedidosNaoAbatidos]: ${e}` };
        }
    },

    obterPedidosVencidos: async (): Promise<IPCResponseFormat> => {
        try {
            const hoje = new Date();
            const filtrados = await obterPedidosNaoAbatidosBase({ vencimento: { lte: hoje } });
            return { success: true, data: filtrados };
        } catch (e) {
            return { success: false, message: `[movimentacoesRepo.obterPedidosVencidos]: ${e}` };
        }
    },

    obterProximosVencimentos: async (): Promise<IPCResponseFormat> => {
        try {
            const hoje = new Date();
            const seteDias = new Date();
            seteDias.setDate(hoje.getDate() + 7);

            const filtrados = await obterPedidosNaoAbatidosBase({
                vencimento: { gt: hoje, lte: seteDias },
            });

            return { success: true, data: filtrados };
        } catch (e) {
            return { success: false, message: `[movimentacoesRepo.obterProximosVencimentos]: ${e}` };
        }
    },

    obterTopDevedores: async (): Promise<IPCResponseFormat> => {
        try {
            const todas = await prisma.movimentacao.findMany({
                where: { tipo: 'Pedido' },
                select: { clienteId: true, valor: true, valorAbatido: true },
            });

            const mapa = new Map<string, number>();

            for (const p of todas) {
                const saldo = p.valor - (p.valorAbatido ?? 0);
                if (saldo > 0)
                    mapa.set(p.clienteId, (mapa.get(p.clienteId) ?? 0) + saldo);
            }

            const ordenado = [...mapa.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([clienteId, valor]) => ({ clienteId, valor }));

            return { success: true, data: ordenado.slice(0, 10) }; // top 10
        } catch (e) {
            return { success: false, message: `[movimentacoesRepo.obterTopDevedores]: ${e}` };
        }
    },

    obterProximaCobranca: async (): Promise<IPCResponseFormat> => {
        try {
            const hoje = new Date();
            const [proxima] = await obterPedidosNaoAbatidosBase({ vencimento: { gt: hoje } }, true);
            return { success: true, data: proxima ?? null };
        } catch (e) {
            return { success: false, message: `[movimentacoesRepo.obterProximaCobranca]: ${e}` };
        }
    },

    obterMovimentacoesRecentes: async (): Promise<IPCResponseFormat> => {
        try {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

            const recentes = await prisma.movimentacao.findMany({
                where: {
                    data: { gte: seteDiasAtras },
                },
                orderBy: { data: 'desc' },
            });

            return { success: true, data: recentes };
        } catch (e) {
            return { success: false, message: `[movimentacoesRepo.obterMovimentacoesRecentes]: ${e}` };
        }
    },
}