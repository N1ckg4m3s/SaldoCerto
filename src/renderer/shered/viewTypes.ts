import type { Cliente, Movimentacao, SituacaoCliente, TipoMovimentacao } from "./types"

export type NumberFilterType = 'Biggest' | 'Lowest' | null

export type ClienteAtrazoView = Pick<Cliente, 'nome' | 'id'> & {
    ValorVencido: number,
    DiasDeAtrazo: number,
    NumeroDeNotas: number,
}

export type ListaClienteView = Pick<Cliente, 'nome' | 'id'> & {
    SomaTotal: number,
    ProximoPagamento: string,
    ValorProximaNota: number,
    Situacao: SituacaoCliente
}

/* INFORMAÇÕES DO CLIENTE*/
export type HistoricoDeLancamentoDoClienteView = Omit<Movimentacao, 'ClientId'>

export type InformacoesDoClienteView = Omit<ListaClienteView, 'Situacao'> & Pick<Cliente, 'telefone' | 'contrato'>;

export type HistoricoDeLancamentoView = Omit<Movimentacao, 'vencimento' | 'valorAbatido'> & Pick<Cliente, 'nome'>

export type DashboardTableRowView = {
    Title: string
    FloatInfo: string
    AdicionalInformation: string
}

export type PaginacaoView = {
    currentPage: number
    totalPages: number
}

/* NOTIFICAÇÕES */
export type NotificationType = "success" | "warning" | "error";

export interface Notification {
    id: string;
    title: string,
    errorCode?: string,
    message?: string;
    type: NotificationType;
    duration?: number;
}

/* DASHBOARD */
export interface cardInformationsView {
    totalEmDivida: number,
    totalVencido: number
    clientesComFiadoAtivo: number
    topDevedor: { valor: number, nome: string }
    proximaCobranca: {
        data: Date
        nome: string
        valor: number
    }
    clientesVencidos: number
    clientesComVencimentoProximo: number
    entradasRecentes: number
}

export type TableRowView = {
    nome: string,
    valor: number,
    data: string,
}

export type TableRowultimasMovimentacoesView = TableRowView & {
    tipo: TipoMovimentacao,
}

export interface tableDatasView {
    proximosVencimentos?: TableRowView[]
    ultimasMovimentacoes?: TableRowultimasMovimentacoesView[]
}