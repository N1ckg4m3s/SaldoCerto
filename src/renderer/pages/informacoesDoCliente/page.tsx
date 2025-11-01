import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import * as s from './style'
import type { HistoricoDeLancamentoDoClienteView, InformacoesDoClienteView, PaginacaoView } from '@renderer/shered/viewTypes';
import { useEffect, useState } from 'react';
import { Paginacao } from '@renderer/components/pagination/component';
import type { FloatGuiProps, Movimentacao } from '@renderer/shered/types';
import InterfaceFlutuante from '@renderer/components/floatGui/component';
import { CreateEditClient_FloatGuiModule } from '@renderer/components/floatGui/models/createEditClient';
import { useParams } from 'react-router-dom';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { formatarDateParaTexto, formatarValorParaTexto } from '@renderer/controler/auxiliar';
import { AdicionarMovimentacao_FloatGuiModule } from '@renderer/components/floatGui/models/adicionarMovimentacao';

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });
    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })
    const [client, setClient] = useState<InformacoesDoClienteView>();

    const [historico, setHistorico] = useState<HistoricoDeLancamentoDoClienteView[]>([]);

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        client: { data: client, set: setClient },
        historico: { data: historico, set: setHistorico },
    }
}

const InformacoesDoCliente = () => {
    const { addNotification } = useNotification();
    const { id } = useParams<{ id: string }>();

    const { page, floatGui, client, historico } = useAllStates()

    const floatGuiActions = {
        openAddNewMov: () => floatGui.set({ active: true, type: 'addMovimentacao', GuiInformations: {} }),
        openEditClient: () => floatGui.set({ active: true, type: 'editCliente', GuiInformations: {} }),
        close: () => floatGui.set({ active: false, type: '', GuiInformations: {} })
    };

    const handleChangePage = (page: number) => {

    }

    useEffect(() => {
        if (!client.data) {
            ApiCaller({
                url: '/cliente/getInformationsById',
                args: { id },
                onSuccess(response) {
                    if (response.success) {
                        const clientDTO: InformacoesDoClienteView = {
                            id: response.data.id || 'erro',
                            contrato: {
                                dia: response.data.diaContrato,
                                type: response.data.tipoContrato,
                            },
                            nome: response.data.nome,
                            telefone: response.data.telefone,
                            ProximoPagamento: response.data.ProximoPagamento,
                            SomaTotal: response.data.SomaTotal,
                            ValorProximaNota: response.data.ValorProximaNota
                        }
                        client.set(clientDTO)
                    }
                },
                onError(erro) {
                    addNotification({
                        id: String(new Date()),
                        title: "Erro ao obter dados do cliente",
                        type: 'error',
                        errorCode: erro.errorCode || '',
                        message: erro.message || '',
                    })
                }
            })
        }
        ApiCaller({
            url: '/movimentacoes/listByClient',
            args: { id },
            onSuccess(response) {
                if (response.success) {
                    historico.set(response.data.movimentacoes)
                    page.set({
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages
                    })
                }
            },
            onError(erro) {
                addNotification({
                    id: String(new Date()),
                    title: "Erro ao obter dados do historico do cliente",
                    type: 'error',
                    errorCode: erro.errorCode || '',
                    message: erro.message || '',
                })
            }
        })
        // Atualiza o historico de lançamentos do cliente
    }, [page.data.currentPage])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo={`Informações do cliente - ${client.data?.nome || '-'}`}
                buttons={[
                    { label: 'Registrar movimentação', onClick: floatGuiActions.openAddNewMov },
                    { label: 'Exportar lista', onClick: () => { } },
                    { label: '⚙', onClick: floatGuiActions.openEditClient },
                ]}
            />

            <s.informationsContainer>
                <s.InformationsGroup>
                    <h3>Informacoes do cliente</h3>
                    <s.Information>
                        <strong>Contato adicionado: </strong>
                        {client.data?.telefone || '-'}
                    </s.Information>
                    <s.Information>
                        <strong>CONTRATO: </strong>
                        {client.data?.contrato.type || '-'} - {client.data?.contrato.dia || '-'}
                    </s.Information>
                </s.InformationsGroup>
                <s.InformationsGroup>
                    <h3>Informacoes financeiras</h3>
                    <s.Information>
                        <strong>Divida Total: </strong>
                        {formatarValorParaTexto(client.data?.SomaTotal) || '-'}
                    </s.Information>
                    <s.Information>
                        <strong>Proximo pagamento: </strong>
                        {formatarDateParaTexto(client.data?.ProximoPagamento || '')}
                    </s.Information>
                    <s.Information>
                        <strong>Valor de pagamento: </strong>
                        {formatarValorParaTexto(client.data?.ValorProximaNota || '')}
                    </s.Information>
                </s.InformationsGroup>
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
                    <tbody> {historico.data.map(renderHistoricoRow)}</tbody>
                </sh.tableContainer>
            </s.HistoryContainer>

            <Paginacao
                currentPage={page.data.currentPage}
                onPageChange={handleChangePage}
                totalPages={page.data.totalPages}
            />

            {floatGui.data.active && floatGui.data.type == 'editCliente' && client.data &&
                <InterfaceFlutuante
                    title=' Editar informações do Cliente'
                    onClose={floatGuiActions.close}>

                    <CreateEditClient_FloatGuiModule
                        Cliente={client.data}
                        onComplete={() => { }}
                        onError={() => { }}
                    />
                </InterfaceFlutuante>
            }
            {floatGui.data.active && floatGui.data.type == 'addMovimentacao' &&
                <InterfaceFlutuante
                    title='Adicionar movimentações ao cliente'
                    onClose={floatGuiActions.close}>

                    <AdicionarMovimentacao_FloatGuiModule
                        ClienteDeterminado={{
                            id: client.data?.id || '',
                            nome: client.data?.nome || ''
                        }}
                        onComplete={() => {
                            page.set({
                                ...page.data,
                                currentPage: 0,
                            })
                        }}
                        onError={() => { }}
                    />
                </InterfaceFlutuante>
            }

        </sh.MainPageContainer>
    )
}

export default InformacoesDoCliente;


const renderHistoricoRow = (value: HistoricoDeLancamentoDoClienteView, index: number) => {
    const isPedido = value.tipo === 'Pedido';

    const tipo = isPedido ? '📦' : '💵';

    const valorAbatido = isPedido && value.valorAbatido && value.valorAbatido > 0
        ? formatarValorParaTexto(value.valorAbatido)
        : '-';

    const vencimento = isPedido && value.vencimento
        ? formatarDateParaTexto(value.vencimento)
        : '-';

    const valor = value.valor ? formatarValorParaTexto(value.valor) : '-';
    const data = value.data ? formatarDateParaTexto(value.data) : '-';

    return (
        <sh.tableRow key={index}>
            <sh.tableData>{tipo}</sh.tableData>
            <sh.tableData>{data}</sh.tableData>
            <sh.tableData>{vencimento}</sh.tableData>
            <sh.tableData>{valor}</sh.tableData>
            <sh.tableData>{valorAbatido}</sh.tableData>
            <sh.tableData>{value.codigo}</sh.tableData>
            <sh.tableData>
                <sh.smallTableButton onClick={() => { }}>
                    🔍
                </sh.smallTableButton>
            </sh.tableData>
        </sh.tableRow>
    );
};
