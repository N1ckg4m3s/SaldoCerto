import * as s from './style'
import * as sh from '../sheredPageStyles'
import { CardComponent } from './components/cardComponent/component';
import { ListComponent } from './components/listComponent/component';
import { RowItemList } from './components/listComponent/rowList';
import PageTitle from '@renderer/components/pageTitle/component';
import { useEffect, useState } from 'react';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { formatarValorParaTexto } from '@renderer/controler/auxiliar';

const Dashboard = () => {
    const { addNotification } = useNotification()
    const [dados, setDados] = useState<any>(null);

    useEffect(() => {
        ApiCaller({
            url: `/dashboard/getResumo`,
            onSuccess(result) {
                if (result.success) {
                    setDados(result.data)
                }
            },
            onError(erro) {
                addNotification({
                    id: String(Date.now()),
                    title: "Erro ao obter os dados do dashboard",
                    type: 'error',
                    message: erro.message || 'No message',
                    errorCode: erro.errorCode || 'ERR'
                })
            }
        })
    }, [])

    const calcularQuantosDiasParaCobranca = (data: string) => {
        const hoje = new Date();
        const d = new Date(data);

        const diffEmMs = d.getTime() - hoje.getTime(); // diferença em milissegundos
        const diffEmDias = Math.ceil(diffEmMs / (1000 * 60 * 60 * 24)); // converte para dias e arredonda para cima

        return `${diffEmDias}d`;
    }

    return (
        <sh.MainPageContainer>
            <PageTitle titulo='Dashboard - Controle de Fiado' />

            <s.gridCard4x2>
                <CardComponent
                    title='Total em dívida'
                    data={formatarValorParaTexto(dados?.totalEmDivida || '-')}
                    description='Soma de todos os lançamentos em aberto'
                />

                <CardComponent
                    title='Valor vencido (R$)'
                    data={formatarValorParaTexto(dados?.valorVencido || '-')}
                    description='Clique para ver uma tabela detalhada'
                />

                <sh.CleanReacrLink to={"/listaDeClientesCadastrados"}>
                    <CardComponent
                        title='Clientes com fiado ativo'
                        data={dados?.clientesComFiadoAtivo || '-'}
                        description='Contagem com saldo > 0'
                    />
                </sh.CleanReacrLink>

                <CardComponent
                    title='Top devedor'
                    data={formatarValorParaTexto(dados?.topDevedor.valor || '-')}
                    description={dados?.topDevedor.nome || '-'}
                />

                <sh.CleanReacrLink to={'/TabelaDeClientesEmAtrazo'}>
                    <CardComponent
                        title='Clientes vencidos'
                        data={dados?.clientesVencidos || '-'}
                        description='Contagem de clientes com titulos vencidos'
                    />
                </sh.CleanReacrLink>

                <CardComponent
                    title='Próxima cobrança'
                    data={calcularQuantosDiasParaCobranca(dados?.proximaCobranca.data || '')}
                    description={`${dados?.proximaCobranca.nome}: ${formatarValorParaTexto(dados?.proximaCobranca.valor || '-')}`}
                />

                <CardComponent
                    title='Clientes com vencimento em 7d'
                    data={dados?.clientesComVencimento7d || '-'}
                    description='Alerta de curto praso'
                />

                <CardComponent
                    title='Entrada nos ultimos 7 dias'
                    data={dados?.entradasRecentes || '-'}
                    description='Ultimos lançamentos cadastrados'
                />
            </s.gridCard4x2>

            <s.gridCard2x1>
                <ListComponent title='10 Próximas cobranças' >
                    {Array.from({ length: 10 }).map(() => <RowItemList
                        type='Prox.Cobran'
                        data={[]}
                    />)}
                </ListComponent>

                <ListComponent title='Movimentações dos ultimos 7 dias (limite: 10)' >
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