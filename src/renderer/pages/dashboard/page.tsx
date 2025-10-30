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
import type { cardInformationsView, tableDatasView } from '@renderer/shered/viewTypes';

const Dashboard = () => {
    const { addNotification } = useNotification()
    const [dados, setDados] = useState<cardInformationsView>();
    const [tableData, setTableData] = useState<tableDatasView>({
        proximosVencimentos: [],
        ultimasMovimentacoes: [
            {
                tipo: 'Pedido',
                nome: 'teste',
                valor: 10,
            }
        ]
    })

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
        ApiCaller({
            url: `/dashboard/getProximasCobrancas`,
            onSuccess(result) {
                if (result.success) {
                    setTableData({
                        ...tableData,
                        proximosVencimentos: result.data.proximosVencimentos
                    })
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

    const DiferencaEmDias = (data: string) => {
        const agora = new Date();
        const alvo = new Date(data);
        const diffMs = agora.getTime() - alvo.getTime();
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return -diffDias;
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
                        data={(dados?.clientesComFiadoAtivo || '').toString() || '-'}
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
                        data={(dados?.clientesVencidos || '').toString() || '-'}
                        description='Contagem de clientes com titulos vencidos'
                    />
                </sh.CleanReacrLink>

                <CardComponent
                    title='Próxima cobrança'
                    data={calcularQuantosDiasParaCobranca((dados?.proximaCobranca.data || '').toString() || '')}
                    description={`${dados?.proximaCobranca.nome}: ${formatarValorParaTexto(dados?.proximaCobranca.valor || '-')}`}
                />

                <CardComponent
                    title='Clientes com vencimento em 7d'
                    data={(dados?.clientesComVencimento7d || '').toString() || '-'}
                    description='Alerta de curto praso'
                />

                <CardComponent
                    title='Entrada nos ultimos 7 dias'
                    data={(dados?.entradasRecentes || '').toString() || '-'}
                    description='Ultimos lançamentos cadastrados'
                />
            </s.gridCard4x2>

            <s.gridCard2x1>
                <ListComponent title='10 Próximas cobranças' >
                    {tableData.proximosVencimentos?.map((value, index) => <RowItemList
                        type='Prox.Cobran'
                        data={{
                            Title: `${index + 1}. ${value.nome}`,
                            FloatInfo: `${DiferencaEmDias(value.data)}`,
                            AdicionalInformation: formatarValorParaTexto(value.valor)
                        }}
                    />)}
                </ListComponent>

                <ListComponent title='Movimentações dos ultimos 7 dias (limite: 10)' >
                    {tableData.ultimasMovimentacoes?.map((value, index) => <RowItemList
                        type='Val.Recent'
                        data={{
                            Title: `${index + 1}. ${value.nome}`,
                            FloatInfo: value.tipo,
                            AdicionalInformation: formatarValorParaTexto(value.valor)
                        }}
                    />)}
                </ListComponent>
            </s.gridCard2x1>
        </sh.MainPageContainer>
    )
}

export default Dashboard;