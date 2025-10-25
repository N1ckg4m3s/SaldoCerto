import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import * as s from './style'

const InformacoesDoCliente = () => {
    const mockData = [
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
    ]

    const formatValue = (valor: string | undefined): string => {
        // se não tiver valor retorna '-'
        if (!valor) return '-';

        // tenta transformar em numero
        const stringToNumber = Number(valor);
        if (isNaN(stringToNumber)) {
            return '-' // nulo
        }

        // retorna formatado
        return `$${stringToNumber.toFixed(2)}`
    }

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Informações do cliente - [NOME]'
                buttons={[
                    { label: 'Registrar movimentação', onClick: () => { } },
                    { label: 'Exportar lista', onClick: () => { } },
                    { label: '⚙', onClick: () => { } },
                ]}
            />

            <s.informationsContainer>
                <h3>Informacoes do cliente</h3>
                <s.Information>
                    <strong>TELEFONE: </strong>
                    (##) # ####-####
                </s.Information>
                <s.Information>
                    <strong>CONTRATO: </strong>
                    Periodo - 15d
                </s.Information>
            </s.informationsContainer>

            <s.HistoryContainer>
                <h3>Historico do cliente</h3>
                <sh.tableContainer>
                    <thead>
                        <sh.tableRow>
                            <sh.tableTh>Tipo</sh.tableTh>
                            <sh.tableTh>Data</sh.tableTh>
                            <sh.tableTh>Vencimento</sh.tableTh>
                            <sh.tableTh>Valor</sh.tableTh>
                            <sh.tableTh>Valor abatido</sh.tableTh>
                            <sh.tableTh>Codigo</sh.tableTh>
                            <sh.tableTh>-</sh.tableTh>
                        </sh.tableRow>
                    </thead>
                    <tbody>
                        {mockData.map((value, index) => {
                            return (
                                <sh.tableRow>
                                    <sh.tableData>{value.Tipo}</sh.tableData>
                                    <sh.tableData>{value.Data}</sh.tableData>
                                    <sh.tableData>{value.Vencimento}</sh.tableData>
                                    <sh.tableData>{formatValue(value.Valor)}</sh.tableData>
                                    <sh.tableData>{formatValue(value.ValorAbatido)}</sh.tableData>
                                    <sh.tableData>{value.Codigo}</sh.tableData>
                                    <sh.tableData>
                                        <sh.smallTableButton onClick={() => { }}>
                                            🔍
                                        </sh.smallTableButton>
                                    </sh.tableData>
                                </sh.tableRow>
                            )
                        })}
                    </tbody>
                </sh.tableContainer>
            </s.HistoryContainer>
        </sh.MainPageContainer>
    )
}

export default InformacoesDoCliente;