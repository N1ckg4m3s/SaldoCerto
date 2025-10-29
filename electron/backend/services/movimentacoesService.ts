import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export interface IPCResponseFormat {
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
}