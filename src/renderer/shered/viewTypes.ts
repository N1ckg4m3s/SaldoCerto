import type { Cliente, SituacaoCliente } from "./types"

export type NumberFilterType = 'Biggest' | 'Lowest' | null

export type ClienteAtrazoView = Pick<Cliente, 'nome'> & {
    ValorVencido: number,
    DiasDeAtrazo: number,
    NumeroDeNotas: number,
}

export type ListaClienteView = Pick<Cliente, 'nome'> & {
    SomaTotal: number,
    ProximoPagamento: string,
    ValorProximaNota: number,
    Situacao: SituacaoCliente
}