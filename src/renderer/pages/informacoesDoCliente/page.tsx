import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import * as s from './style'
import type { InformacoesDoCliente } from '@renderer/shered/viewTypes';

const InformacoesDoCliente = () => {
    const mockData: InformacoesDoCliente[] = [
        {
            id: '',
            tipo: 'Pedido',
            data: '10/10/2025',
            vencimento: '10/11/2025',
            valor: 150,
            valorAbatido: 100,
            codigo: '01-023C',
        },
        {
            id: '',
            tipo: 'Pagamento',
            data: '12/10/2025',
            vencimento: '-',
            valor: 100,
            valorAbatido: 0,
            codigo: '-',
        },
    ]

    const formatValue = (valor?: number): string => {
        // se não tiver valor retorna '-'
        if (!valor || valor == 0) return '-';

        // retorna formatado
        return valor.toFixed(2)
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
                                <sh.tableRow key={index}>
                                    <sh.tableData>{value.tipo}</sh.tableData>
                                    <sh.tableData>{value.data}</sh.tableData>
                                    <sh.tableData>{value.vencimento}</sh.tableData>
                                    <sh.tableData>{formatValue(value.valor)}</sh.tableData>
                                    <sh.tableData>{formatValue(value.valorAbatido)}</sh.tableData>
                                    <sh.tableData>{value.codigo}</sh.tableData>
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