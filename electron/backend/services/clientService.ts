import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { movimentacoesService } from "./movimentacoesService";

interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

/* Chegar ao Repositorio */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioCliente } = await import(pathToFileURL(path.join(__dirname, '..', 'repositories', 'clientRepo.js')).href);

/*
    Service, tem como função tratar o 'pedido' de dados para o banco com base na regra de negocios
        Ele verifica, datas, acrescimos, juros..., tudo.
*/

const ValidateClientData = (dado: any): [boolean, string] => {
    try {
        if (!dado) throw new Error('Não chegou data');

        if (!dado.nome) throw new Error('Usuario sem nome informado');

        if (!dado.telefone) throw new Error('Usuario sem telefone informado');

        if (!dado.contrato) throw new Error('Usuario sem contrato informado');

        if (!dado.contrato.type) throw new Error('Usuario sem tipo de contrato informado');

        if (!dado.contrato.dia) throw new Error('Usuario sem tempo informado no contrato');

        return [true, '']
    } catch (e: any) {
        return [false, e.message];
    }

}

export const clientService = {
    AdicionarNovoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        const [valido, erro] = ValidateClientData(dados);
        if (!valido) return { success: false, message: `[ClientService.AdicionarNovoCliente]: ${erro}` }

        return await RepositorioCliente.adicionarCliente(dados);
    },

    AtualizarInformacoesDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados.id) return { success: false, message: `[ClientService.AtualizarInformacoesDoCliente]: Id Não informado para atualização` }

        const [valido, erro] = ValidateClientData(dados);
        if (!valido) return { success: false, message: `[ClientService.AdicionarNovoCliente]: ${erro}` }

        return await RepositorioCliente.atualizarInformacoesDoCliente(dados);
    },

    RemoverCliente: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados.id) return { success: false, message: `[ClientService.RemoverCliente]: Id Não informado para remoção` }

        return await RepositorioCliente.removerInformacoesDoCliente(dados);
    },

    ObterClientePorId: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados.id) return { success: false, message: `[ClientService.ObterClientePorId]: Id Não informado` }

        return await RepositorioCliente.obterClientePorId(dados);
    },

    ObterClientes: async (dados: any): Promise<IPCResponseFormat> => {
        /* importação local da função que preciso */
        const { movimentacoesService } = await import(pathToFileURL(path.join(__dirname, 'movimentacoesService.js')).href);

        let page = dados.page ?? 0 // Define a pagina como 0 caso não tenha a informação
        let limit = dados.limit ?? 20 // padroniza o liminte a 20
        let search = dados.search ?? '' // Verifica a existencia da pesquisa
        let filters = dados.filters ?? '' // Verifica a existencia dos filtros

        // Obter os clientes
        const informacoesDaPagina = await RepositorioCliente.obterClientes({ page, limit, search })

        const clientesDaPagina = informacoesDaPagina.data.clients || []

        let retornoData = await Promise.all(
            clientesDaPagina.map(async (cliente: any) => {
                const movimentacoesServiceRetorno = await movimentacoesService.ObterResumoDeMovimentacoesDoCliente({ id: cliente.id });
                if (!movimentacoesServiceRetorno.success) return movimentacoesServiceRetorno;

                const movimentacoesDoCliente = movimentacoesServiceRetorno.data

                return {
                    id: cliente.id,
                    nome: cliente.nome,
                    SomaTotal: movimentacoesDoCliente.TotalEmDivida,
                    ProximoPagamento: movimentacoesDoCliente.DataDeProximoPagamento,
                    ValorProximaNota: movimentacoesDoCliente.ValorACobrarNaProximaNota,
                    Situacao: movimentacoesDoCliente.Situacao
                }
            })
        )

        return {
            success: true,
            data: {
                currentPage: informacoesDaPagina.data.currentPage,
                totalPages: informacoesDaPagina.data.totalPages,
                clients: retornoData
            }
        };
    },

    ObterIdENomeClientes: async (dados: any): Promise<IPCResponseFormat> => {
        let search = dados.search ?? '' // Verifica a existencia da pesquisa

        // Obter os clientes
        const informacoesDaPagina = await RepositorioCliente.obterClientes({ search, limit: 10 })

        let retornoData = informacoesDaPagina.data.clients.map((info: any) => {
            return { id: info.id, nome: info.nome }
        })

        if (retornoData.length <= 0) {
            retornoData = [{ id: null, nome: '- sem cliente -' }]
        }

        return {
            success: true,
            data: retornoData
        }
    },

    ObterClienteInformationsPorId: async (dados: any): Promise<IPCResponseFormat> => {
        /* importação local da função que preciso */
        const { movimentacoesService } = await import(pathToFileURL(path.join(__dirname, 'movimentacoesService.js')).href);
        
        if (!dados || !dados.id) return { success: false, message: 'Id do cliente não informado' }

        /* OBTENDO AS INFORMAÇÕES NECESSARIAS */
        const clientServiceResponse = await clientService.ObterClientePorId({ id: dados.id });
        if (!clientServiceResponse.success) return { success: false, message: 'Não foi possivel obter o cliente' }

        const cliente = clientServiceResponse.data;

        const movimentacoesServiceResponse = await movimentacoesService.ObterResumoDeMovimentacoesDoCliente({ id: dados.id });
        if (!movimentacoesServiceResponse.success) return { success: false, message: 'Não foi possivel obter o resumo das movimentações' }

        const resumoMovimentacoes = movimentacoesServiceResponse.data;

        return {
            success: true,
            data: {
                ...cliente,
                ProximoPagamento: resumoMovimentacoes.DataDeProximoPagamento,
                SomaTotal: resumoMovimentacoes.TotalEmDivida,
                ValorProximaNota:  resumoMovimentacoes.ValorACobrarNaProximaNota
            }
        }
    },
}