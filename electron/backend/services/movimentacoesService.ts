import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

/* Chegar ao Repositorio */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioMovimentacoes } = await import(pathToFileURL(path.join(__dirname, '..', 'repositories', 'movimentacoesRepo.js')).href);
const { clientService } = await import(pathToFileURL(path.join(__dirname, 'clientService.js')).href);

/*
    Service, tem como função tratar o 'pedido' de dados para o banco com base na regra de negocios
        Ele verifica, datas, acrescimos, juros..., tudo.
*/
function calcularVencimentoDoPedido(dataMovimentacao: Date, tipoContrato: 'praso' | 'fechamento' | 'periodo', tempoContrato: string): Date {
    const valor = Number(tempoContrato);
    if (isNaN(valor)) throw new Error('Contrato inválido: dia/prazo não numérico');

    const vencimento = new Date(dataMovimentacao);

    switch (tipoContrato) {
        case 'praso':
            vencimento.setDate(vencimento.getDate() + valor);
            break;

        case 'fechamento': {
            const diaFechamento = Math.min(valor, 28); // evita erro em meses curtos
            const dataAtual = new Date(dataMovimentacao);
            const mes = dataAtual.getDate() > diaFechamento
                ? dataAtual.getMonth() + 1
                : dataAtual.getMonth();

            vencimento.setMonth(mes);
            vencimento.setDate(diaFechamento);
            break;
        }

        case 'periodo':
            console.error('Não deveria ter chegado aqui')
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

        return [true, '']
    } catch (e: any) {
        return [false, e.message];
    }
}

export const movimentacoesService = {
    AdicionarNovaMovimentação: async (dados: any): Promise<IPCResponseFormat> => {
        const [valido, erro] = ValidateMovimentationData(dados);
        if (!valido) return { success: false, message: erro };

        // Considerar pedido
        if (dados.tipo == 'Pedido') {
            return movimentacoesService.RegistrarAdicaoDePedido(dados)

        } else if (dados.tipo == 'Pagamento') {
            return movimentacoesService.RegistrarPagamentoEmNota(dados)

        }
        return { success: false, message: '[movimentacoesService.AdicionarNovaMovimentação] Tipo indefinido' }
        // Considerar pagamento
    },

    RegistrarPagamentoEmNota: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const obtendoData = await clientService.ObterClientePorId({ id: dados.ClientId });
            const idCliente = obtendoData.data.id;

            // Adiciona a movimentação
            const movimentacaoAdicionada = await RepositorioMovimentacoes.adicionarMovimentacao({
                ...dados,

                // removendo desnecessarios para 'pagamento'
                vencimento: null,
                valorAbatido: null,
                codigo: null,
            })

            if (movimentacaoAdicionada.success) {
                // Obter uma lista de notas não abatidas
                const PedidosNaoAbatidos = await RepositorioMovimentacoes.obterPedidosNaoAbatidosDoCliente({ id: idCliente })
                if (!PedidosNaoAbatidos.success) return { success: false, message: PedidosNaoAbatidos.message };

                // Salvando em uma vareavel alteravel qual o valor de pagamento
                let valorDePagamento = Number(dados.valor);

                for (const pedido of PedidosNaoAbatidos.data) {
                    if (valorDePagamento <= 0) break;

                    const saldoAberto = pedido.valor - (pedido.valorAbatido ?? 0);

                    if (valorDePagamento >= saldoAberto) {
                        // paga totalmente o pedido
                        await RepositorioMovimentacoes.atualizaMovimentacao({
                            id: pedido.id,
                            data: { valorAbatido: pedido.valor },
                        })
                        valorDePagamento -= saldoAberto;
                    } else {
                        // paga parcialmente
                        await RepositorioMovimentacoes.atualizaMovimentacao({
                            id: pedido.id,
                            data: { valorAbatido: ((pedido.valorAbatido ?? 0) + valorDePagamento) },
                        })

                        valorDePagamento = 0;
                        break;
                    }
                }

                return { success: true }
            } else {
                throw new Error("[movimentacoesServices.RegistrarPagamentoEmNota {ELSE}]: Erro ao adicionar nova movimentação")
            }
        } catch (e) {
            return { success: false, message: `[movimentacoesServices.RegistrarPagamentoEmNota]: ${e}` };
        }
    },

    RegistrarAdicaoDePedido: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const obtendoData = await clientService.ObterClientePorId({ id: dados.ClientId });
            const Cliente = obtendoData.data;

            let DataDaMovimentacao = new Date(dados.data);

            const Contrato = Cliente.tipoContrato;
            const TempoEmContrato = Cliente.diaContrato;

            const vencimento = calcularVencimentoDoPedido(DataDaMovimentacao, Contrato, TempoEmContrato);

            return await RepositorioMovimentacoes.adicionarMovimentacao({
                ...dados,
                vencimento
            })
        } catch (e) {
            return { success: false, message: `[movimentacoesServices.RegistrarAdicaoDePedido]: ${e}` };
        }
    },

    ObterMovimentacoes: async (dados: any): Promise<IPCResponseFormat> => {
        let page = dados.page ?? 0 // Define a pagina como 0 caso não tenha a informação
        let limit = dados.limit ?? 20 // padroniza o liminte a 20
        let search = dados.search ?? '' // Verifica a existencia da pesquisa
        let filters = dados.filters ?? '' // Verifica a existencia dos filtros
        const filtros: {
            data?: {
                gte: Date,
                lte: Date
            },
            tipo?: string
        } = {}

        if (filters) {
            const deData = filters.de !== '' && new Date(filters.de) || null;
            const ateData = filters.ate !== '' && new Date(filters.ate) || null;

            if (deData && ateData) {
                filtros.data = {
                    gte: new Date(deData),
                    lte: new Date(ateData)
                }
                if (deData) filtros.data.gte = new Date(deData);
                if (ateData) filtros.data.lte = new Date(ateData);
            }

            if (filters.option) filtros.tipo = filters.option;
        }

        const informacoesDaPagina = await RepositorioMovimentacoes.obterMovimentacoes({ page, limit, search, filtros })

        if (!informacoesDaPagina.success) throw new Error("[movimentacoesService.ObterMovimentacoes] Erro ao obter as movimentações da pagina \n Erro: " + (informacoesDaPagina.message ?? 'NO ERROR MESSAGE'));

        // Mergir informações para retorno
        const retornoData = await Promise.all(
            informacoesDaPagina.data.movimentacoes.map(async (movimentacao: any) => {
                const clientServiceResponse = await clientService.ObterClientePorId({ id: movimentacao.clienteId });

                const nomeCliente = clientServiceResponse.success
                    ? clientServiceResponse.data.nome
                    : '';

                return {
                    id: movimentacao.id,
                    nome: nomeCliente,
                    ClientId: movimentacao.clienteId,
                    tipo: movimentacao.tipo,
                    data: movimentacao.data,
                    valor: movimentacao.valor,
                    codigo: movimentacao.codigo,
                };
            })
        );

        return {
            success: true,
            data: {
                currentPage: informacoesDaPagina.data.currentPage,
                totalPages: informacoesDaPagina.data.totalPages,
                movimentacoes: retornoData,
            }
        }
    },

    ObterResumoDeMovimentacoesDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        const idCliente = dados.id;
        if (!idCliente) return { success: false, message: '[Movimentações service. Obter resumo] Id do cliente não informado' }

        const RepositorioMovimentacoesRetorno = await RepositorioMovimentacoes.obterPedidosNaoAbatidosDoCliente({ id: idCliente });
        if (!RepositorioMovimentacoesRetorno.success) return RepositorioMovimentacoesRetorno;

        const PedidosNaoAbatidos = RepositorioMovimentacoesRetorno.data;

        let TotalEmDivida: number = 0;
        let DataDeProximoPagamento: Date | '' = '';
        let ValorACobrarNaProximaNota: number = 0;
        let Situacao: 'ativo' | 'vencido' | 'quitado' = 'quitado';

        // Adicionar informações do proximo pagamento:
        if (PedidosNaoAbatidos.length > 0) {
            DataDeProximoPagamento = PedidosNaoAbatidos[0].vencimento
            ValorACobrarNaProximaNota = PedidosNaoAbatidos[0].valor - (PedidosNaoAbatidos[0].valorAbatido ?? 0);

            // Verificação se esta vencida
            const hoje: Date = new Date();
            const isVencido: boolean = DataDeProximoPagamento <= hoje;

            Situacao = isVencido ? 'vencido' : 'ativo';
        } else {
            return {
                success: true,
                data: {
                    TotalEmDivida,
                    DataDeProximoPagamento,
                    ValorACobrarNaProximaNota,
                    Situacao
                }
            };
        }

        // Adiciona o total em divida
        for (const pedido of PedidosNaoAbatidos) {
            const saldoAberto = pedido.valor - (pedido.valorAbatido ?? 0);
            TotalEmDivida += saldoAberto
        }

        return {
            success: true,
            data: {
                TotalEmDivida,
                DataDeProximoPagamento,
                ValorACobrarNaProximaNota,
                Situacao,
            }
        };
    },

    ObterMovimentacoesPorID: async (dados: any): Promise<IPCResponseFormat> => {
        let page = dados.page ?? 0 // Define a pagina como 0 caso não tenha a informação
        let limit = dados.limit ?? 20 // padroniza o liminte a 20 ObterMovimentacoesPorID
        let search = dados.search ?? '' // Verifica a existencia da pesquisa
        let filters = dados.filters ?? '' // Verifica a existencia dos filtros

        const idCliente = dados.id;

        if (!idCliente) return { success: false, message: 'Id do cliente não informado' }

        const filtros: any = {}

        if (filters) {
            const deData = filters.de !== '' && new Date(filters.de) || null;
            const ateData = filters.ate !== '' && new Date(filters.ate) || null;

            if (deData && ateData) {
                if (deData) filtros.data.gte = new Date(deData);
                if (ateData) filtros.data.lte = new Date(ateData);
            }

            if (filters.option) filtros.tipo = filters.option;
        }

        const informacoesDaPagina = await RepositorioMovimentacoes.obterMovimentacoes({ page, limit, search, filtros })

        if (!informacoesDaPagina.success) throw new Error("Erro ao obter as movimentações da pagina \n Erro: " + informacoesDaPagina.message);

        // Mergir informações para retorno
        const retornoData = await Promise.all(
            informacoesDaPagina.data.movimentacoes.map(async (movimentacao: any) => {
                const clientServiceResponse = await clientService.ObterClientePorId({ id: movimentacao.clienteId });

                const nomeCliente = clientServiceResponse.success
                    ? clientServiceResponse.data.nome
                    : '';

                return {
                    id: movimentacao.id,
                    nome: nomeCliente,
                    ClientId: movimentacao.clienteId,
                    tipo: movimentacao.tipo,
                    data: movimentacao.data,
                    valor: movimentacao.valor,
                    codigo: movimentacao.codigo,
                    vencimento: movimentacao.vencimento,
                    valorAbatido: movimentacao.valorAbatido
                };
            })
        );

        return {
            success: true,
            data: {
                currentPage: informacoesDaPagina.data.currentPage,
                totalPages: informacoesDaPagina.data.totalPages,
                movimentacoes: retornoData,
            }
        }
    },
}