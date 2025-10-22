import PageTitle from '../../components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import * as s from './style'

interface ClientInformationMock {
    nome: string,
    SomaTotal: number,
    ProximoPagamento: string,
    ValorProximaNota: number,
    Situacao: 'ativo' | 'vencido' | 'quitado',
}

const ListaDeClientesCadastrados = () => {
    const mockData: ClientInformationMock[] = [
        {
            nome: "João da Silva",
            SomaTotal: 320,
            ProximoPagamento: '22/10/2025',
            ValorProximaNota: 120,
            Situacao: 'ativo',
        },
        {
            nome: "Maria Souza",
            SomaTotal: 500,
            ProximoPagamento: '14/10/2025',
            ValorProximaNota: 500,
            Situacao: 'vencido',
        },
        {
            nome: "Carlos Lima",
            SomaTotal: 0,
            ProximoPagamento: '-',
            ValorProximaNota: 0,
            Situacao: 'quitado',
        }
    ]

    const TableHeadDataClick = (filter: string) => {

    }

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Clientes cadastrados'
                buttons={[
                    { label: 'Adicionar Cliente', onClick: () => { } }
                ]}
            />
            <s.filtrosContainer>
                <s.searchContainer>
                    <s.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </s.svg>
                    <s.searchInput />
                </s.searchContainer>
                <s.filterSelect>
                    <option value={""}>Todos</option>
                    <option value={"ativo"}>Ativo</option>
                    <option value={"vencido"}>Vencido</option>
                    <option value={"quitado"}>Quitado</option>
                </s.filterSelect>
            </s.filtrosContainer>

            <s.tableContainer>
                <thead>
                    <s.tableRow>
                        <s.tableTh>Nome</s.tableTh>

                        <s.tableTh
                            onClick={() => TableHeadDataClick('TotalDivida')}
                            clickable>
                            Total em dívida
                        </s.tableTh>

                        <s.tableTh
                            onClick={() => TableHeadDataClick('PagamentoProximo')}
                            clickable>
                            Próximo pagamento
                        </s.tableTh>

                        <s.tableTh
                            onClick={() => TableHeadDataClick('ValorCobrar')}
                            clickable>
                            Valor a cobrar
                        </s.tableTh>

                        <s.tableTh>
                            Situação
                        </s.tableTh>

                        <s.tableTh>Ações</s.tableTh>

                    </s.tableRow>
                </thead>
                <tbody>
                    {mockData.map((value, index) => {

                        return (
                            <s.tableRow>
                                <s.tableData>{value.nome}</s.tableData>
                                <s.tableData>{value.SomaTotal}</s.tableData>
                                <s.tableData>{value.ProximoPagamento}</s.tableData>
                                <s.tableData>{value.ValorProximaNota}</s.tableData>
                                <s.tableData>
                                    <s.situacaoCliente
                                        situacao={value.Situacao}>
                                        {value.Situacao}
                                    </s.situacaoCliente>
                                </s.tableData>
                                <s.tableData>
                                    <s.smallbutton onClick={() => { }}>
                                        🔍
                                    </s.smallbutton>
                                </s.tableData>
                            </s.tableRow>
                        )
                    })}
                </tbody>
            </s.tableContainer>

            <s.AcoesFooter>
                <s.Botao> Exportar </s.Botao>
            </s.AcoesFooter>
        </sh.MainPageContainer>
    )
}

export default ListaDeClientesCadastrados;