import type { Cliente, Movimentacao, SituacaoCliente } from "./types"

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

export type InformacoesDoCliente = Omit<Movimentacao, 'ClientId'>

export type HistoricoDeLancamento = Omit<Movimentacao, 'vencimento' | 'valorAbatido'> & Pick<Cliente, 'nome'>

/*
export interface Cliente {
    id: string,
    nome: string,
    telefone: string,
    contrato: ContratoInformations;
}
export interface Movimentacao {
    id: string,
    ClientId: string,
    tipo: TipoMovimentacao,
    data: string,
    vencimento?: string,
    valor: number,
    valorAbatido?: number,
    codigo: string,
}

// o que preciso
interface mockInterface {
    id: string
    ClientId: string,
    data: string,
    nome: string,
    tipo: mockTipoNota,
    valor: number,
    codigo: string | undefined,
}
*/