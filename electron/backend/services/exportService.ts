import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { movimentacoesService } = await import(pathToFileURL(path.join(__dirname, "movimentacoesService.js")).href);
const { clientService } = await import(pathToFileURL(path.join(__dirname, "clientService.js")).href);

// Save methods
const { saveAsCSV } = await import(pathToFileURL(path.join(__dirname, '..', 'infrastructure', 'exportSystem', 'saveAsCSV.js')).href);
const { saveAsJSON } = await import(pathToFileURL(path.join(__dirname, '..', 'infrastructure', 'exportSystem', 'saveAsJSON.js')).href);
const { saveAsPDF } = await import(pathToFileURL(path.join(__dirname, '..', 'infrastructure', 'exportSystem', 'saveAsPDF.js')).href);

/* ---------- Typing ---------- */
interface IPCResponseFormat {
    success: boolean;
    message?: string;
    data?: any;
    errorCode?: string;
}
interface payloadType {
    urlDataOrigin: string,
    necessaryPageData?: any,
    filters?: any,
    onlyCurrentPage?: boolean,
    tipo: 'csv' | 'pdf' | 'json',
}
interface handlersProps {
    requiredArgs: string[],
    baseName: string,
    getFormatedData: (args: any) => Promise<{ primary: any, secundary?: any }>
}
/* ---------- Viws formater ---------- */
// Formata datas para DD/MM/AAAA
const formatacaoData = (valor: any) => {
    if (!valor) return "-";
    const date = new Date(valor);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("pt-BR"); // ex: 08/11/2025
};

// Formata valores como moeda brasileira
const formatacaoValor = (valor: any) => {
    if (valor == null) return "-";
    const num = Number(valor);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); // ex: R$ 218,59
};

/* ---------- Handlers ---------- */
const handles: Record<string, handlersProps> = {
    '/movimentacoes/list': {
        requiredArgs: [],
        baseName: 'lista-de-movimentacoes',
        getFormatedData: async (args) => {
            const service = movimentacoesService.ObterMovimentacoes; // obtem com: data.movimentacoes
            const serviceReturn = await service(args);
            if (!serviceReturn.success) return serviceReturn;

            return successResponse({
                list: serviceReturn.data.movimentacoes.map((e: any) => ({
                    nome: e.nome,
                    tipo: e.tipo,
                    data: formatacaoData(e.data),
                    valor: formatacaoValor(e.valor),
                    codigo: e.codigo || "-"
                }))
            })
        }
    },

    '/movimentacoes/getInadimplentesList': {
        requiredArgs: [],
        baseName: 'lista-de-clientes-inadimplantes',
        getFormatedData: async (args: any) => {
            const service = movimentacoesService.ObterListaDeInadimplencia; // obtem com: data.inadimplentes
            const serviceReturn = await service(args);
            if (!serviceReturn.success) return serviceReturn;

            return successResponse({
                list: serviceReturn.data.inadimplentes.map((e: any) => ({
                    nome: e.nome,
                    DiasDeAtrazo: e.DiasDeAtrazo,
                    ValorVencido: formatacaoValor(e.ValorVencido),
                    NumeroDeNotas: e.NumeroDeNotas
                }))
            })
        }
    },

    '/cliente/getList': {
        requiredArgs: [],
        baseName: 'lista-de-clientes',
        getFormatedData: async (args: any) => {
            const service = clientService.ObterClientes; // obtem com: data.clients
            const serviceReturn = await service(args);
            if (!serviceReturn.success) return serviceReturn;

            return successResponse({
                list: serviceReturn.data.clients.map((e: any) => ({
                    nome: e.nome,
                    SomaTotal: formatacaoValor(e.SomaTotal),
                    ProximoPagamento: formatacaoData(e.ProximoPagamento),
                    ValorProximaNota: formatacaoValor(e.ValorProximaNota),
                    Situacao: e.Situacao
                }))
            })
        }
    },

    '/cliente/getInformationsById': {
        requiredArgs: ['id'],
        baseName: 'lista-de-informacoes-do-cliente',
        getFormatedData: async (args: any) => {
            const service1 = await clientService.ObterClienteInformationsPorId // obtem com: data
            const service2 = await movimentacoesService.ObterMovimentacoesPorID // obtem com: data.movimentacoes

            const service1Return = await service1(args);
            if (!service1Return.success) return service1Return;

            const service2Return = await service2(args);
            if (!service2Return.success) return service2Return;

            return successResponse({
                list: service2Return.data.movimentacoes.map((e: any) => ({
                    nome: e.nome,
                    tipo: e.tipo,
                    data: formatacaoData(e.data),
                    valor: formatacaoValor(e.valor),
                    codigo: e.codigo || "-"
                })),
                information: {
                    CLIENT_CONTATO: service1Return.data.telefone,
                    CLIENT_CONTRATO: `${service1Return.data.tipoContrato || '#'} - ${service1Return.data.diaContrato || '#'}`,
                    CLIENT_DIVIDA: formatacaoValor(service1Return.data.SomaTotal),
                    CLIENT_PROX_PAG: formatacaoData(service1Return.data.ProximoPagamento),
                    CLIENT_VALOR_PAG: formatacaoValor(service1Return.data.ValorProximaNota),
                },
            })
        }
    },
}

/* ---------- Utils ---------- */
const successResponse = (data?: any): IPCResponseFormat => ({ success: true, data });
const errorResponse = (context: string, message: any): IPCResponseFormat => ({ success: false, message: `[${context}]: ${message}`, });

const getDataFromService = async <T = any>(dados: any): Promise<IPCResponseFormat> => {
    const handlerRespectivo = handles[dados.urlDataOrigin];
    if (!handlerRespectivo) return errorResponse('__exportAsCSV', 'Serviço de dados não informado');

    const { requiredArgs, getFormatedData } = handlerRespectivo;

    const args = {
        ...dados.necessaryPageData,
        ...dados.filters,
        ...(dados.onlyCurrentPage ? {} : { limit: 100, page: 0 }),
    };

    for (const arg of requiredArgs) {
        if (!(arg in args)) {
            return errorResponse('__getDataFromService', `Campo obrigatório "${arg}" ausente`);
        }
    }

    const returnData = await getFormatedData(args);
    return successResponse(returnData);
};

/* ---------- Serviço Principal ---------- */
export const exportService = {
    exportarDados: async (dados: payloadType): Promise<IPCResponseFormat> => {
        if (!dados) return errorResponse('exportService.exportarDados', 'argumentos não informados');

        if (!dados.urlDataOrigin) return errorResponse('exportService.exportarDados', 'Origem dos dados não informado');
        if (!dados.tipo) return errorResponse('exportService.exportarDados', 'Tipo de exportação não informado');

        const handlerRespectivo = handles[dados.urlDataOrigin]
        if (!handlerRespectivo) return errorResponse('exportService.exportarDados', 'Url de origem não identificada');

        switch (dados.tipo) {
            case "csv":
                return exportService.__exportAsCSV({
                    urlDataOrigin: dados.urlDataOrigin,
                    necessaryPageData: dados.necessaryPageData,
                    filters: dados.filters,
                    onlyCurrentPage: dados.onlyCurrentPage,
                })
            case "pdf":
                return exportService.__exportAsPDF({
                    urlDataOrigin: dados.urlDataOrigin,
                    necessaryPageData: dados.necessaryPageData,
                    filters: dados.filters,
                    onlyCurrentPage: dados.onlyCurrentPage,
                })
            case "json":
                return exportService.__exportAsJSON({
                    urlDataOrigin: dados.urlDataOrigin,
                    necessaryPageData: dados.necessaryPageData,
                    filters: dados.filters,
                    onlyCurrentPage: dados.onlyCurrentPage,
                });
        }
    },

    __exportAsCSV: async (dados: any): Promise<IPCResponseFormat> => {
        const dataResponse = await getDataFromService(dados);
        if (!dataResponse.success) return dataResponse;
        const { data } = dataResponse; // contém { data: { primary, secundary } }

        const handler = handles[dados.urlDataOrigin];
        let rows: any[] = [];

        if (Array.isArray(data.data.primary)) {
            rows = [...data.data.primary];
        } else if (data.data.primary) {
            rows = [data.data.primary];
        }

        if (data.data.secundary) {
            if (Array.isArray(data.data.secundary)) {
                rows = [...rows, ...data.data.secundary];
            } else {
                rows.push(data.data.secundary);
            }
        }

        const { filePath, total } = await saveAsCSV(rows, handler?.baseName || "NoBaseName");

        return successResponse({ filePath, total });
    },

    __exportAsPDF: async (dados: any): Promise<IPCResponseFormat> => {
        const dataResponse = await getDataFromService(dados);
        if (!dataResponse.success) return dataResponse;
        const { data } = dataResponse;

        const handler = handles[dados.urlDataOrigin];

        // Primary → objeto único
        const listData = data.data.list ?? null;

        // Secundary → array de movimentações
        let informationData: any[] = [];
        if (data.data.information) {
            if (Array.isArray(data.data.information)) {
                informationData = data.data.information;
            } else {
                informationData = [data.data.information];
            }
        }

        // Gera PDF separando list e information
        const { filePath, total } = await saveAsPDF({
            baseName: handler?.baseName || 'NoBaseName',
            list: listData,
            information: informationData,
        });

        return successResponse({ filePath, total });
    },

    __exportAsJSON: async (dados: any): Promise<IPCResponseFormat> => {
        const dataResponse = await getDataFromService(dados);
        if (!dataResponse.success) return dataResponse;
        const { data } = dataResponse;

        const handler = handles[dados.urlDataOrigin];
        let rows: any[] = [];

        if (Array.isArray(data.data.primary)) {
            rows = [...data.data.primary];
        } else if (data.data.primary) {
            rows = [data.data.primary];
        }

        if (data.data.secundary) {
            if (Array.isArray(data.data.secundary)) {
                rows = [...rows, ...data.data.secundary];
            } else {
                rows.push(data.data.secundary);
            }
        }

        const { filePath, total } = await saveAsJSON(rows, handler?.baseName || 'NoBaseName');

        return successResponse({ filePath, total });
    },

};
