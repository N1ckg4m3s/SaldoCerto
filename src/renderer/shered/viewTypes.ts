import type { Cliente, Movimentacao, SituacaoCliente } from "./types"

export type NumberFilterType = 'Biggest' | 'Lowest' | null

export type ClienteAtrazoView = Pick<Cliente, 'nome'> & {
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

export type InformacoesDoClienteView = Omit<Movimentacao, 'ClientId'>

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
