import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioMovimentacoes } = await import(
    pathToFileURL(path.join(__dirname, "..", "repositories", "movimentacoesRepo.js")).href
);
const { clientService } = await import(
    pathToFileURL(path.join(__dirname, "clientService.js")).href
);

const { logService } = await import(pathToFileURL(path.join(__dirname, "logService.js")).href);

/* ---------- Utilidades ---------- */

const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });
const errorResponse = (context: string, message: any): IPCResponseFormat => {
    logService.adicionarLog({
        title: context,
        mensagem: message,
        type: 'error'
    })
    return {
        success: false,
        message: `[${context}]: ${message}`,
    }
}

/** Calcula valores financeiros agregados das movimentações */
const calcularTotais = (movs: any[], hoje: Date) => {
    const totalEmDivida = movs.reduce((acc, m) => acc + (m.valor - (m.valorAbatido ?? 0)), 0);
    const vencidas = movs.filter((m) => m.vencimento && new Date(m.vencimento) < hoje);
    const totalVencido = vencidas.reduce((acc, m) => acc + (m.valor - (m.valorAbatido ?? 0)), 0);
    return { totalEmDivida, totalVencido, vencidas };
};

/** Agrupa movimentações por cliente e retorna o ID do maior devedor */
const encontrarTopDevedor = (movs: any[]) => {
    const mapa = new Map<string, number>();
    movs.forEach((m) => {
        const saldo = m.valor - (m.valorAbatido ?? 0);
        mapa.set(m.clienteId, (mapa.get(m.clienteId) ?? 0) + saldo);
    });

    let topId = null;
    let maiorValor = 0;
    for (const [id, valor] of mapa) {
        if (valor > maiorValor) {
            maiorValor = valor;
            topId = id;
        }
    }

    return { mapa, topId, maiorValor };
};

/** Retorna nome de cliente com base no ID (ou '-' se falhar) */
const obterNomeCliente = async (id: string): Promise<string> => {
    const res = await clientService.ObterClientePorId({ id });
    return res.success ? res.data.nome : "-";
};

/* ---------- Serviço Principal ---------- */

export const dashboardService = {
    obterResumoDasMovimentacoes: async (): Promise<IPCResponseFormat> => {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const movimentacoes = await RepositorioMovimentacoes.obterPedidosNaoAbatidos();
            if (!movimentacoes.success) return movimentacoes;

            const lista = movimentacoes.data || [];
            if (!lista.length) {
                return successResponse({
                    totalEmDivida: 0,
                    totalVencido: 0,
                    clientesComFiadoAtivo: 0,
                    topDevedor: { nome: "-", valor: 0 },
                    clientesVencidos: 0,
                    proximaCobranca: { data: null, nome: "-", valor: 0 },
                    clientesComVencimentoProximo: 0,
                    entradasRecentes: 0,
                });
            }

            // === Cálculos ===
            const { totalEmDivida, totalVencido, vencidas } = calcularTotais(lista, hoje);
            const { mapa, topId, maiorValor } = encontrarTopDevedor(lista);

            // === Próximas cobranças ===
            const em7Dias = new Date(hoje);
            em7Dias.setDate(em7Dias.getDate() + 7);
            const proximosVencimentos = lista
                .filter((m: any) => m.vencimento && new Date(m.vencimento) <= em7Dias)
                .sort((a: any, b: any) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
            const proximo = proximosVencimentos[0];

            // === Buscar nomes reais ===
            const [nomeTop, nomeProx] = await Promise.all([
                topId ? obterNomeCliente(topId) : Promise.resolve("-"),
                proximo?.clienteId ? obterNomeCliente(proximo.clienteId) : Promise.resolve("-"),
            ]);

            const topDevedor = { nome: nomeTop, valor: maiorValor };
            const proximaCobranca = proximo
                ? {
                    data: proximo.vencimento,
                    nome: nomeProx,
                    valor: proximo.valor - (proximo.valorAbatido ?? 0),
                }
                : { data: null, nome: "-", valor: 0 };

            // === Retorno final ===
            return successResponse({
                totalEmDivida,
                totalVencido,
                clientesComFiadoAtivo: mapa.size,
                topDevedor,
                clientesVencidos: vencidas.length,
                proximaCobranca,
                clientesComVencimentoProximo: proximosVencimentos.length,
                entradasRecentes: lista.filter((m: any) => {
                    const diff = (hoje.getTime() - new Date(m.data).getTime()) / (1000 * 60 * 60 * 24);
                    return diff <= 7;
                }).length,
            });
        } catch (e) {
            return errorResponse("dashboardService.obterResumoDasMovimentacoes", e);
        }
    },

    obterResumoDasTabelas: async (): Promise<IPCResponseFormat> => {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const [proxVencs, ultMovs] = await Promise.all([
                RepositorioMovimentacoes.obterPedidosNaoAbatidos(),
                RepositorioMovimentacoes.obterMovimentacoesRecentes(),
            ]);

            if (!proxVencs.success || !ultMovs.success)
                return errorResponse("obterResumoDasTabelas", "Falha ao obter dados");

            const proximos10 = proxVencs.data
                .sort((a: any, b: any) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
                .slice(0, 10);

            const ultimos10 = ultMovs.data.slice(0, 10);

            // Helper para mapear clientes e montar lista
            const montarResumoComCliente = async (lista: any[], camposExtras: (m: any) => any) =>
                Promise.all(
                    lista.map(async (m: any) => {
                        const nome = await obterNomeCliente(m.clienteId);
                        return { nome, ...camposExtras(m) };
                    })
                );

            const returnData_Proximas10 = await montarResumoComCliente(proximos10, (m) => ({
                data: m.vencimento,
                valor: m.valor - (m.valorAbatido ?? 0),
            }));

            const returnData_Ultimas10 = await montarResumoComCliente(ultimos10, (m) => ({
                tipo: m.tipo,
                data: m.data,
                valor: m.valor,
            }));

            return successResponse({
                proximosVencimentos: returnData_Proximas10,
                ultimasMovimentacoes: returnData_Ultimas10,
            });
        } catch (e) {
            return errorResponse("dashboardService.obterResumoDasTabelas", e);
        }
    },
};