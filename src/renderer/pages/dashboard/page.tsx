import * as s from './style'
import * as sh from '../sheredPageStyles'
import { CardComponent } from './components/cardComponent/component';
import { ListComponent } from './components/listComponent/component';
import { RowItemList } from './components/listComponent/rowList';
import PageTitle from '@renderer/components/pageTitle/component';

const Dashboard = () => {
    const mockProxCobram = []
    const mockValRecent = []

    return (
        <sh.MainPageContainer>
            <PageTitle titulo='Dashboard - Controle de Fiado' />

            <s.gridCard4x2>
                <CardComponent
                    title='Total em dívida'
                    data='R$ 12.450,00'
                    description='Soma de todos os lançamentos em aberto'
                />

                <CardComponent
                    title='Valor vencido (R$)'
                    data='R$ 1.520,00'
                    description='Clique para ver uma tabela detalhada'
                />

                <sh.CleanReacrLink to={"/listaDeClientesCadastrados"}>
                    <CardComponent
                        title='Clientes com fiado ativo'
                        data='7'
                        description='Contagem com saldo > 0'
                    />
                </sh.CleanReacrLink>

                <CardComponent
                    title='Top devedor'
                    data='R$ 3.838,00'
                    description='Wesley'
                />

                <sh.CleanReacrLink to={'/TabelaDeClientesEmAtrazo'}>
                    <CardComponent
                        title='Clientes vencidos'
                        data='3'
                        description='Contagem de clientes com titulos vencidos'
                    />
                </sh.CleanReacrLink>

                <CardComponent
                    title='Próxima cobrança'
                    data='Em 2d - 24/10'
                    description='[NOME] (R$: valor)'
                />

                <CardComponent
                    title='Clientes com vencimento em 7d'
                    data='4'
                    description='Alerta de curto praso'
                />

                <CardComponent
                    title='Entrada nos ultimos 7 dias'
                    data='9'
                    description='Ultimos lançamentos cadastrados'
                />
            </s.gridCard4x2>

            <s.gridCard2x1>
                <ListComponent title='Próximas cobranças (Top 10)' >
                    {Array.from({ length: 10 }).map(() => <RowItemList
                        type='Prox.Cobran'
                        data={[]}
                    />)}
                </ListComponent>

                <ListComponent title='Movimentações dos ultimos 7 dias' >
                    {Array.from({ length: 10 }).map(() => <RowItemList
                        type='Val.Recent'
                        data={[]}
                    />)}
                </ListComponent>
            </s.gridCard2x1>
        </sh.MainPageContainer>
    )
}

export default Dashboard;