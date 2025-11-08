import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

/* ---------- Utilitários ---------- */
const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });
const errorResponse = (context: string, e: any): IPCResponseFormat => ({
    success: false,
    message: `[${context}]: ${e}`,
});

/* ---------- Configs de caminho ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioMovimentacoes } = await import(
    pathToFileURL(path.join(__dirname, '..', 'repositories', 'movimentacoesRepo.js')).href
);
const { clientService } = await import(
    pathToFileURL(path.join(__dirname, 'clientService.js')).href
);

/* ---------- Funções auxiliares ---------- */
function calcularVencimentoDoPedido(
    dataMovimentacao: Date,
    tipoContrato: 'praso' | 'fechamento' | 'periodo',
    tempoContrato: string
): Date {
    const valor = Number(tempoContrato);
    if (isNaN(valor)) throw new Error('Contrato inválido: dia/prazo não numérico');

    const vencimento = new Date(dataMovimentacao);

    switch (tipoContrato) {
        case 'praso':
            vencimento.setDate(vencimento.getDate() + valor);
            break;
        case 'fechamento': {
            const diaFechamento = Math.min(valor, 28);
            const dataAtual = new Date(dataMovimentacao);
            const mes = dataAtual.getDate() > diaFechamento
                ? dataAtual.getMonth() + 1
                : dataAtual.getMonth();
            vencimento.setMonth(mes);
            vencimento.setDate(diaFechamento);
            break;
        }
        case 'periodo':
            console.error('Não deveria ter chegado aqui');
            break;
        default:
            throw new Error(`Tipo de contrato desconhecido: ${tipoContrato}`);
    }

    return vencimento;
}

const ValidateMovimentationData = (dado: any): [boolean, string] => {
    try {
        if (!dado) throw new Error('Não chegou data');
        if (!dado.ClientId) throw new Error('Id do usuario não informado para adicionar a movimentação');
        if (!dado.tipo) throw new Error('Tipo de movimentação não unformada');
        if (!dado.data) throw new Error('Data da movimentação não informada');
        if (!dado.valor) throw new Error('Valor da movimentação não informada');
        if (isNaN(Number(dado.valor))) throw new Error('Valor da movimentação não é um numero valido');
        return [true, ''];
    } catch (e: any) {
        return [false, e.message];
    }
};

/* ---------- Service ---------- */
export const movimentacoesService = {
    AdicionarNovaMovimentação: async (dados: any): Promise<IPCResponseFormat> => {
        const [valido, erro] = ValidateMovimentationData(dados);
        if (!valido) return errorResponse('AdicionarNovaMovimentação', erro);

        try {
            if (dados.tipo === 'Pedido') return await movimentacoesService.RegistrarAdicaoDePedido(dados);
            if (dados.tipo === 'Pagamento') return await movimentacoesService.RegistrarPagamentoEmNota(dados);
            return errorResponse('AdicionarNovaMovimentação', 'Tipo indefinido');
        } catch (e) {
            return errorResponse('AdicionarNovaMovimentação', e);
        }
    },

    RegistrarPagamentoEmNota: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const clientRes = await clientService.ObterClientePorId({ id: dados.ClientId });
            const idCliente = clientRes.data.id;

            let valorDePagamento = Number(dados.valor);
            const pedidosRes = await RepositorioMovimentacoes.obterPedidosNaoAbatidosDoCliente({ id: idCliente, abatidos: false, orderBy: 'asc' });
            if (!pedidosRes.success) return errorResponse('RegistrarPagamentoEmNota', pedidosRes.message);

            for (const pedido of pedidosRes.data) {
                if (valorDePagamento <= 0) break;
                const saldoAberto = pedido.valor - (pedido.valorAbatido ?? 0);

                if (valorDePagamento >= saldoAberto) {
                    await RepositorioMovimentacoes.atualizaMovimentacao({
                        id: pedido.id,
                        data: { valorAbatido: pedido.valor, pago: true },
                    });
                    valorDePagamento -= saldoAberto;
                } else {
                    await RepositorioMovimentacoes.atualizaMovimentacao({
                        id: pedido.id,
                        data: { valorAbatido: (pedido.valorAbatido ?? 0) + valorDePagamento },
                    });
                    valorDePagamento = 0;
                    break;
                }
            }

            const valorUtilizado: number = Number(dados.valor) - valorDePagamento;

            const movRes = await RepositorioMovimentacoes.adicionarMovimentacao({
                ...dados,
                valor: valorUtilizado,
                vencimento: null,
                valorAbatido: null,
                codigo: null,
            });
            if (!movRes.success) return errorResponse('RegistrarPagamentoEmNota', 'Erro ao adicionar movimentação');

            if (valorUtilizado > 0) {
                return successResponse({
                    mensagem: ('Pagamento registrado com sucesso \n' +
                        ' Valor utilizado: R$ ' + valorUtilizado.toFixed(2) + '\n' +
                        ' Valor restante: R$ ' + valorDePagamento.toFixed(2)
                    ),
                });
            } else {
                return successResponse();
            }
        } catch (e) {
            return errorResponse('RegistrarPagamentoEmNota', e);
        }
    },

    RegistrarAdicaoDePedido: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const clientRes = await clientService.ObterClientePorId({ id: dados.ClientId });
            const Cliente = clientRes.data;

            const DataDaMovimentacao = new Date(dados.data);
            const vencimento = calcularVencimentoDoPedido(DataDaMovimentacao, Cliente.tipoContrato, Cliente.diaContrato);

            return await RepositorioMovimentacoes.adicionarMovimentacao({
                ...dados,
                vencimento,
            });
        } catch (e) {
            return errorResponse('RegistrarAdicaoDePedido', e);
        }
    },

    ObterMovimentacoes: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            let { page = 0, limit = 20, filters = {} } = dados;
            const filtros: any = {};

            if (filters) {
                const deData = filters.de ? new Date(filters.de) : null;
                const ateData = filters.ate ? new Date(filters.ate) : null;
                if (deData && ateData) filtros.data = { gte: deData, lte: ateData };
            }

            if (filters.option) filtros.tipo = filters.option;

            const paginaRes = await RepositorioMovimentacoes.obterMovimentacoes({ page, limit, filtros });
            if (!paginaRes.success) return errorResponse('ObterMovimentacoes', paginaRes.message);

            const retornoData = await Promise.all(
                paginaRes.data.movimentacoes.map(async (mov: any) => {
                    const cliRes = await clientService.ObterClientePorId({ id: mov.clienteId });
                    return {
                        id: mov.id,
                        ClientId: mov.clienteId,
                        nome: cliRes.success ? cliRes.data.nome : '',
                        tipo: mov.tipo,
                        data: mov.data,
                        valor: mov.valor,
                        codigo: mov.codigo,
                    };
                })
            );

            return successResponse({
                currentPage: paginaRes.data.currentPage,
                totalPages: paginaRes.data.totalPages,
                movimentacoes: retornoData,
            });
        } catch (e) {
            return errorResponse('ObterMovimentacoes', e);
        }
    },

    ObterResumoDeMovimentacoesDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const idCliente = dados.id;
            if (!idCliente) return errorResponse('ObterResumoDeMovimentacoesDoCliente', 'Id do cliente não informado');

            const pedRes = await RepositorioMovimentacoes.obterPedidosNaoAbatidosDoCliente({ id: idCliente, abatidos: false, orderBy: 'asc' });
            if (!pedRes.success) return errorResponse('ObterResumoDeMovimentacoesDoCliente', pedRes.message);

            const PedidosNaoAbatidos = pedRes.data;

            let TotalEmDivida = 0;
            let DataDeProximoPagamento: Date | '' = '';
            let ValorACobrarNaProximaNota = 0;
            let Situacao: 'ativo' | 'vencido' | 'quitado' = 'quitado';

            if (PedidosNaoAbatidos.length > 0) {
                DataDeProximoPagamento = PedidosNaoAbatidos[0].vencimento;
                ValorACobrarNaProximaNota = PedidosNaoAbatidos[0].valor - (PedidosNaoAbatidos[0].valorAbatido ?? 0);
                Situacao = DataDeProximoPagamento <= new Date() ? 'vencido' : 'ativo';
            }

            for (const pedido of PedidosNaoAbatidos) {
                TotalEmDivida += pedido.valor - (pedido.valorAbatido ?? 0);
            }

            return successResponse({ TotalEmDivida, DataDeProximoPagamento, ValorACobrarNaProximaNota, Situacao });
        } catch (e) {
            return errorResponse('ObterResumoDeMovimentacoesDoCliente', e);
        }
    },

    ObterMovimentacoesPorID: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const page = dados.page ?? 0;
            const limit = dados.limit ?? 20;
            const search = dados.search ?? "";
            const filters = dados.filters ?? "";

            const idCliente = dados.id;
            if (!idCliente) return errorResponse('ObterMovimentacoesPorID', 'Id do cliente não informado');

            const filtros: any = {};
            if (filters) {
                if (filters.de) filtros.data = { ...filtros.data, gte: new Date(filters.de) };
                if (filters.ate) filtros.data = { ...filtros.data, lte: new Date(filters.ate) };
                if (filters.option) filtros.tipo = filters.option;
            }

            filtros.clienteId = idCliente

            const paginaRes = await RepositorioMovimentacoes.obterMovimentacoes({ page, limit, search, filtros });
            if (!paginaRes.success) return errorResponse('ObterMovimentacoesPorID', paginaRes.message);

            const retornoData = paginaRes.data.movimentacoes
                .map((mov: any) => ({
                    id: mov.id,
                    tipo: mov.tipo,
                    data: mov.data,
                    vencimento: mov.vencimento,
                    valor: mov.valor,
                    valorAbatido: mov.valorAbatido,
                    codigo: mov.codigo,
                }));

            return successResponse({
                currentPage: paginaRes.data.currentPage,
                totalPages: paginaRes.data.totalPages,
                movimentacoes: retornoData,
            });
        } catch (e) {
            return errorResponse('ObterMovimentacoesPorID', e);
        }
    },

    ObterListaDeInadimplencia: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            let { page = 0, limit = 20 } = dados;
            const repoRes = await RepositorioMovimentacoes.ObterListaDeInadimplencia({ page, limit });
            if (!repoRes.success) return errorResponse('ObterListaDeInadimplencia', repoRes.message);

            const retornoData = await Promise.all(
                repoRes.data.inadimplentes.map(async (mv: any) => {
                    const cliRes = await clientService.ObterClientePorId({ id: mv.clienteId });
                    return { ...mv, id: cliRes.data.id, nome: cliRes.success ? cliRes.data.nome : '' };
                })
            );

            return successResponse({
                currentPage: repoRes.data.currentPage,
                totalPages: repoRes.data.totalPages,
                inadimplentes: retornoData,
            });
        } catch (e) {
            return errorResponse('ObterListaDeInadimplencia', e);
        }
    },

    RemoverMovimentacao: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const idMovimentacao = dados.id;
            if (!idMovimentacao) return errorResponse('RemoverMovimentacao', 'Id da movimentação não informada');

            // obter movimentação do id
            const mov = await RepositorioMovimentacoes.obterMovimentacoes({
                page: 0,
                limit: 1,
                filtros: { id: idMovimentacao },
            });
            if (!mov.success || mov.data.movimentacoes.length === 0) return errorResponse('RemoverMovimentacao', 'Movimentação não encontrada');
            const movimentacao = mov.data.movimentacoes[0];

            // se for pagamento, desfazer abatimentos
            if (movimentacao.tipo === 'Pagamento') {
                let valorDePagamento = movimentacao.valor;

                const pedidosRes = await RepositorioMovimentacoes.obterPedidosNaoAbatidosDoCliente({ id: movimentacao.clienteId, abatidos: true, orderBy: 'desc' });
                if (!pedidosRes.success) return errorResponse('RemoverMovimentacao', pedidosRes.message);

                const pedidosDoCliente = pedidosRes.data;

                for (let i = pedidosDoCliente.length - 1; i >= 0; i--) {
                    const pedido = pedidosDoCliente[i];
                    const saldoAberto = pedido.valor - (pedido.valorAbatido ?? 0);

                    if (saldoAberto < pedido.valor) {
                        const valorAbatidoAtual = pedido.valorAbatido ?? 0;
                        const valorASerDesfeito = Math.min(valorDePagamento, valorAbatidoAtual);
                        await RepositorioMovimentacoes.atualizaMovimentacao({
                            id: pedido.id,
                            data: { valorAbatido: valorAbatidoAtual - valorASerDesfeito, pago: false },
                        });
                        valorDePagamento -= valorASerDesfeito;
                        if (valorDePagamento <= 0) break;
                    }
                }
            }

            // remover movimentação
            const repoRes = await RepositorioMovimentacoes.removerMovimentacao({ id: idMovimentacao });
            if (!repoRes.success) return errorResponse('RemoverMovimentacao', repoRes.message);
            return successResponse();
        } catch (e) {
            return errorResponse('RemoverMovimentacao', e);
        }
    }
};