import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RepositorioCliente } = await import(
    pathToFileURL(path.join(__dirname, "..", "repositories", "clientRepo.js")).href
);

const { logService } = await import(pathToFileURL(path.join(__dirname, "logService.js")).href);

interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}

/* ---------- Utils ---------- */

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

const validateClientData = (dado: any): IPCResponseFormat => {
    const required = [
        ["nome", "Usuário sem nome informado"],
        ["telefone", "Usuário sem telefone informado"],
        ["contrato", "Usuário sem contrato informado"],
    ];

    for (const [field, msg] of required) {
        if (field && !dado?.[field]) return errorResponse("ValidateClientData", msg);
    }

    if (!dado.contrato.type) return errorResponse("ValidateClientData", "Tipo de contrato ausente");
    if (!dado.contrato.dia) return errorResponse("ValidateClientData", "Dia do contrato ausente");

    return successResponse();
};

/* ---------- Serviço Principal ---------- */

export const clientService = {
    AdicionarNovoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        const validation = validateClientData(dados);
        if (!validation.success) return validation;

        return RepositorioCliente.adicionarCliente(dados);
    },

    AtualizarInformacoesDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados.id) return errorResponse("AtualizarInformacoesDoCliente", "Id não informado");

        const validation = validateClientData(dados);
        if (!validation.success) return validation;

        return RepositorioCliente.atualizarInformacoesDoCliente(dados);
    },

    RemoverCliente: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados.id) return errorResponse("RemoverCliente", "Id não informado");

        return RepositorioCliente.removerInformacoesDoCliente(dados);
    },

    ObterClientePorId: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados.id) return errorResponse("ObterClientePorId", "Id não informado");

        return RepositorioCliente.obterClientePorId(dados);
    },

    ObterClientes: async (dados: any): Promise<IPCResponseFormat> => {
        const { movimentacoesService } = await import(
            pathToFileURL(path.join(__dirname, "movimentacoesService.js")).href
        );

        const page = dados.page ?? 0;
        const limit = dados.limit ?? 20;
        const search = dados.search ?? "";

        const informacoesDaPagina = await RepositorioCliente.obterClientes({ page, limit, search });
        if (!informacoesDaPagina.success) return informacoesDaPagina;

        const clientes = informacoesDaPagina.data.clients || [];

        const clientsWithResumo = await Promise.all(
            clientes.map(async (cliente: any) => {
                const resumo = await movimentacoesService.ObterResumoDeMovimentacoesDoCliente({
                    id: cliente.id,
                });
                if (!resumo.success) return resumo;

                const mov = resumo.data;
                return {
                    id: cliente.id,
                    nome: cliente.nome,
                    SomaTotal: mov.TotalEmDivida,
                    ProximoPagamento: mov.DataDeProximoPagamento,
                    ValorProximaNota: mov.ValorACobrarNaProximaNota,
                    Situacao: mov.Situacao,
                };
            })
        );

        return successResponse({
            currentPage: informacoesDaPagina.data.currentPage,
            totalPages: informacoesDaPagina.data.totalPages,
            clients: clientsWithResumo,
        });
    },

    ObterIdENomeClientes: async (dados: any): Promise<IPCResponseFormat> => {
        const search = dados.search ?? "";

        const informacoesDaPagina = await RepositorioCliente.obterClientes({ search, limit: 10 });
        if (!informacoesDaPagina.success) return informacoesDaPagina;

        let clients = informacoesDaPagina.data.clients.map((c: any) => ({
            id: c.id,
            nome: c.nome,
        }));

        if (!clients.length) clients = [{ id: null, nome: "- sem cliente -" }];

        return successResponse(clients);
    },

    ObterClienteInformationsPorId: async (dados: any): Promise<IPCResponseFormat> => {
        if (!dados?.id) return errorResponse("ObterClienteInformationsPorId", "Id não informado");

        const { movimentacoesService } = await import(
            pathToFileURL(path.join(__dirname, "movimentacoesService.js")).href
        );

        const client = await clientService.ObterClientePorId({ id: dados.id });
        if (!client.success) return errorResponse("ObterClienteInformationsPorId", "Cliente não encontrado");

        const resumo = await movimentacoesService.ObterResumoDeMovimentacoesDoCliente({ id: dados.id });
        if (!resumo.success)
            return errorResponse("ObterClienteInformationsPorId", "Resumo de movimentações não obtido");

        const mov = resumo.data;
        return successResponse({
            ...client.data,
            ProximoPagamento: mov.DataDeProximoPagamento,
            SomaTotal: mov.TotalEmDivida,
            ValorProximaNota: mov.ValorACobrarNaProximaNota,
        });
    },
};
