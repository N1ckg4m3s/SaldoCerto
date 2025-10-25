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

export type InformacoesDoCliente = Omit<Movimentacao, 'ClientId' >

/*
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
{
    Tipo: 'Pedido',
    Data: '10/10/2025',
    Vencimento: '10/11/2025',
    Valor: '150',
    ValorAbatido: '100',
    Codigo: '01-023C',
},
{
    Tipo: 'Pagamento',
    Data: '12/10/2025',
    Vencimento: '-',
    Valor: '100',
    ValorAbatido: '-',
    Codigo: '-',
},
*/