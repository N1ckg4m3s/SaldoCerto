import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioMovimentacoes } = await import(pathToFileURL(path.join(__dirname, '..', 'repositories', 'movimentacoesRepo.js')).href);
const { clientService } = await import(pathToFileURL(path.join(__dirname, 'clientService.js')).href);

export const dashboardService = {
    obterResumoDasMovimentacoes: async (): Promise<IPCResponseFormat> => {
        try {
            const hoje = new Date();

            // === 1️⃣ Buscar todas as movimentações em aberto ===
            const movimentacoes = await RepositorioMovimentacoes.obterPedidosNaoAbatidos();
            if (!movimentacoes.success) return movimentacoes;

            const lista = movimentacoes.data || [];

            if (!lista.length) {
                return {
                    success: true,
                    data: {
                        totalEmDivida: 0,
                        totalVencido: 0,
                        clientesComFiadoAtivo: 0,
                        topDevedor: { nome: '-', valor: 0 },
                        clientesVencidos: 0,
                        proximaCobranca: { data: null, nome: '-', valor: 0 },
                        clientesComVencimentoProximo: 0,
                        entradasRecentes: 0,
                        proximasCobrancas: [],
                        movimentacoesRecentes: []
                    }
                };
            }

            // === 2️⃣ Calcular agregados principais ===
            const totalEmDivida = lista.reduce((acc: number, m: any) => acc + (m.valor - (m.valorAbatido ?? 0)), 0);

            const vencidas = lista.filter((m: any) => m.vencimento && new Date(m.vencimento) < hoje);
            const totalVencido = vencidas.reduce((acc: number, m: any) => acc + (m.valor - (m.valorAbatido ?? 0)), 0);

            // Agrupar por cliente pra achar top devedor
            const mapaClientes = new Map<string, number>();
            lista.forEach((m: any) => {
                const saldo = m.valor - (m.valorAbatido ?? 0);
                mapaClientes.set(m.clienteId, (mapaClientes.get(m.clienteId) ?? 0) + saldo);
            });

            let topClienteId = null;
            let maiorValor = 0;
            for (const [id, valor] of mapaClientes) {
                if (valor > maiorValor) {
                    maiorValor = valor;
                    topClienteId = id;
                }
            }

            // === 3️⃣ Próxima cobrança ===
            const proximosVencimentos = lista
                .filter((m: any) => m.vencimento && new Date(m.vencimento) > hoje)
                .sort((a: any, b: any) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());

            const proximo = proximosVencimentos[0];

            // === 4️⃣ Buscar nomes reais de clientes ===
            let topDevedor = { nome: '-', valor: maiorValor };
            let proximaCobranca = { data: null, nome: '-', valor: 0 };

            if (topClienteId) {
                const clienteTop = await clientService.ObterClientePorId({ id: topClienteId });
                if (clienteTop.success)
                    topDevedor.nome = clienteTop.data.nome;
            }

            if (proximo?.clienteId) {
                const clienteProx = await clientService.ObterClientePorId({ id: proximo.clienteId });
                if (clienteProx.success) {
                    proximaCobranca = {
                        data: proximo.vencimento,
                        nome: clienteProx.data.nome,
                        valor: proximo.valor - (proximo.valorAbatido ?? 0)
                    };
                }
            }

            // === 5️⃣ Montar retorno final ===
            return {
                success: true,
                data: {
                    totalEmDivida,
                    totalVencido,
                    clientesComFiadoAtivo: mapaClientes.size,
                    topDevedor,
                    clientesVencidos: vencidas.length,
                    proximaCobranca,
                    clientesComVencimentoProximo: proximosVencimentos.length,
                    entradasRecentes: lista.filter((m: any) => {
                        const diff = (hoje.getTime() - new Date(m.data).getTime()) / (1000 * 60 * 60 * 24);
                        return diff <= 7;
                    }).length,
                    movimentacoesRecentes: lista
                        .filter((m: any) => {
                            const diff = (hoje.getTime() - new Date(m.data).getTime()) / (1000 * 60 * 60 * 24);
                            return diff <= 7;
                        })
                        .slice(0, 10)
                }
            };

        } catch (e) {
            return { success: false, message: `[dashboardService.obterResumoDasMovimentacoes]: ${e}` };
        }
    },

    obterResumoDasTabelas: async () => {
        try {
            const hoje = new Date();

            /* 1️⃣ Obter as litas de informações */
            const [listaProximosVencimentos, listaMovimentacoesRecentes] = await Promise.all([
                RepositorioMovimentacoes.obterPedidosNaoAbatidos(),
                RepositorioMovimentacoes.obterMovimentacoesRecentes(),
            ])

            // Verificando responses
            if (!listaProximosVencimentos.success || !listaMovimentacoesRecentes.success) return {
                success: false, message: 'Falha ao obter os dados da tabela'
            };

            const listaProximasCobrancas = listaProximosVencimentos.data;
            const listaUltimasMovimentacoes = listaMovimentacoesRecentes.data;


            /* 2️⃣ Filtrando informações */
            const proximosVencimentos = listaProximasCobrancas
                .filter((m: any) => m.vencimento && new Date(m.vencimento) > hoje)
                .sort((a: any, b: any) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
            const proximos10 = proximosVencimentos.slice(0, 10);

            const ultimos10 = listaUltimasMovimentacoes.slice(0, 10)


            /* 3️⃣ Unindo informações */
            const returnData_Proximas10 = await Promise.all(
                proximos10.map(async (m: any) => {

                    const clientServiceResponse = await clientService.ObterClientePorId({ id: m.clienteId });
                    if (!clientServiceResponse.success) return {
                        nome: '- // -',
                        data: '- // -',
                        valor: 0
                    }

                    const clienteEncontrado = clientServiceResponse.data

                    return {
                        nome: clienteEncontrado.nome,
                        data: m.vencimento,
                        valor: (m.valor - (m.valorAbatido ?? 0))
                    }
                })
            )

            const returnData_Ultimas10 = await Promise.all(
                ultimos10.map(async (m: any) => {

                    const clientServiceResponse = await clientService.ObterClientePorId({ id: m.clienteId });
                    if (!clientServiceResponse.success) return {
                        nome: '- // -',
                        tipo: '- // -',
                        data: m.data,
                        valor: 0
                    }

                    const clienteEncontrado = clientServiceResponse.data

                    return {
                        nome: clienteEncontrado.nome,
                        tipo: m.tipo,
                        data: m.data,
                        valor: m.valor
                    }
                })
            )

            return {
                success: true,
                data: {
                    proximosVencimentos: returnData_Proximas10,
                    ultimasMovimentacoes: returnData_Ultimas10
                }
            }
        } catch (e) {
            return { success: false, message: `[dashboardService.obterResumoDasTabelas]: ${e}` };
        }
    },
};