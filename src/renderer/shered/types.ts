
/**
 * Contrato - forma de como o sistema vai tratar a cobrança da nota/pedido
 * - Prazo -> Refere-se a um tempo apos a nota para efetuar o pagamento:
 *      Cada nota vai ter sua data de vencimento
 * 
 * - Fechamento -> Data final para efetuar o pagamento:
 *      As notas vão ser somadas e cobradas no dia informado
 * 
 * - Periodo -> Semelhante ao Fechamento, mas soma todas as notas dentro do periodo:
 *      As notas vão ser somadas e cobradas no final do tempo do periodo.
*/
export interface ContratoInformations {
    type: 'praso' | 'fechamento' | 'periodo',
    dia: string
}

export type TipoMovimentacao = 'Pedido' | 'Pagamento' 

export type SituacaoCliente = 'ativo' | 'vencido' | 'quitado'

// Classe simples sobre o cliente
export interface Cliente {
    id: string,
    nome: string,
    telefone: string,
    contrato: ContratoInformations;
}

/**
 * Data: Data que foi feito o pedido / pagamento
 * Vencimento (apenas para pedidos):  se baseia no contrato para gerar a data de vencimento.
 * 
 * valor: Valor do pedido/pagamento
 * valorAbatido (apenas para pedidos): Caso pago parcial ele continua mostrando o valor necessario cobrança.
 * 
 * codigo (apenas para pedidos): Caso haja algun controle sobre id.
*/
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