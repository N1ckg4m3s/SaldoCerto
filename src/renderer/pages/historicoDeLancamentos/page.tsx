import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import type { HistoricoDeLancamentoView, PaginacaoView } from '@renderer/shered/viewTypes';
import { Paginacao } from '@renderer/components/pagination/component';
import { useEffect, useRef, useState } from 'react';
import type { FloatGuiProps } from '@renderer/shered/types';
import { AdicionarMovimentacao_FloatGuiModule } from '@renderer/components/floatGui/models/adicionarMovimentacao';
import InterfaceFlutuante from '@renderer/components/floatGui/component';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { formatarDateParaTexto, formatarValorParaTexto } from '@renderer/controler/auxiliar';
import { Remover_FloatGuiModule } from '@renderer/components/floatGui/models/remover';

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });
    const [movimentacoes, setMovimentacoes] = useState<HistoricoDeLancamentoView[]>([]);

    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })

    const deDataRef = useRef<HTMLInputElement>(null);
    const ateDataRef = useRef<HTMLInputElement>(null);
    const optionRef = useRef<HTMLSelectElement>(null);

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        movimentacoes: { data: movimentacoes, set: setMovimentacoes },
        deDataRef,
        ateDataRef,
        optionRef
    }
}

const HistoricoDeLancamentos = () => {
    const { addNotification } = useNotification();
    const { page, floatGui, movimentacoes, deDataRef, ateDataRef, optionRef } = useAllStates();

    const getAllApiMovimentations = () => {
        try {
            const payload = {
                page: page.data.currentPage,
                limit: 20,
                filters: {
                    de: deDataRef.current?.value || '',
                    ate: ateDataRef.current?.value || '',
                    option: optionRef.current?.value || '',
                },
            }

            ApiCaller({
                url: '/movimentacoes/list',
                args: payload,
                onError(erro) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Erro ao obter os dados',
                        message: `Contate o DEV: \n${erro.message}`,
                        errorCode: erro.errorCode || '',
                        type: 'error',
                    });
                },
                onSuccess(response) {
                    movimentacoes.set(response.data.movimentacoes || []);
                    page.set({
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages,
                    });
                },
            })

        } catch (e) {
            addNotification({
                id: String(Date.now()),
                title: 'Erro inesperado',
                message: String(e),
                type: 'error',
            });
        }
    }

    const handleChangePage = (pageToSet: number) => {
        page.set({ ...page.data, currentPage: pageToSet });
    }

    const floatGuiActions = {
        openAddNewMovimentacao: () => floatGui.set({ active: true, type: 'addMovimentacao', GuiInformations: {} }),
        openRemoveMovimentation: (GuiInformations: any) => floatGui.set({ active: true, type: 'removeThing', GuiInformations }),
        close: () => floatGui.set({ active: false, type: '', GuiInformations: {} }),
    }

    useEffect(() => { getAllApiMovimentations() }, [page.data.currentPage]);

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Historico de lançamentos'
                buttons={[
                    { label: 'Adicionar Movimentação', onClick: floatGuiActions.openAddNewMovimentacao },
                    { label: 'Exportar', onClick: () => { } },
                ]}
            />

            <sh.filtrosContainer>
                {/* De Data */}
                <sh.searchContainer>
                    De: <sh.searchInput type='date' ref={deDataRef} />
                </sh.searchContainer>

                {/* Até Data */}
                <sh.searchContainer>
                    Até: <sh.searchInput type='date' ref={ateDataRef} />
                </sh.searchContainer>

                {/* Filtrar pot tipo */}
                <sh.filterSelect ref={optionRef}>
                    <option value={""}>Todos</option>
                    <option value={"Pedido"}>Pedidos</option>
                    <option value={"Pagamento"}>Pagamentos</option>
                </sh.filterSelect>

                <sh.FooterBotao onClick={getAllApiMovimentations}>Filtrar</sh.FooterBotao>
            </sh.filtrosContainer>

            <sh.tableContainer>
                <thead>
                    <sh.tableTh>Data</sh.tableTh>
                    <sh.tableTh>Cliente</sh.tableTh>
                    <sh.tableTh>Tipo</sh.tableTh>
                    <sh.tableTh>Valor</sh.tableTh>
                    <sh.tableTh>Codigo</sh.tableTh>
                    <sh.tableTh>-</sh.tableTh>
                </thead>
                <tbody>
                    {movimentacoes.data.map((value, index) => (
                        <sh.tableRow>
                            <sh.tableData>{formatarDateParaTexto(value.data)}</sh.tableData>
                            <sh.tableData>{value.nome}</sh.tableData>
                            <sh.tableData>
                                <sh.tipoNota
                                    situacao={value.tipo}>
                                    {value.tipo}
                                </sh.tipoNota>
                            </sh.tableData>
                            <sh.tableData>{formatarValorParaTexto(value.valor)}</sh.tableData>
                            <sh.tableData>{value.codigo || '-'}</sh.tableData>
                            <sh.tableData>
                                <sh.smallTableButton onClick={() => floatGuiActions.openRemoveMovimentation(value)}>❌</sh.smallTableButton>
                            </sh.tableData>
                        </sh.tableRow>
                    ))}
                </tbody>
            </sh.tableContainer>

            <Paginacao
                currentPage={page.data.currentPage}
                onPageChange={handleChangePage}
                totalPages={page.data.totalPages}
            />

            {floatGui.data.active && (
                <>
                    {floatGui.data.type === 'addMovimentacao' && (
                        <InterfaceFlutuante
                            title='Adicionar movimentação'
                            onClose={floatGuiActions.close}
                        >
                            <AdicionarMovimentacao_FloatGuiModule
                                onComplete={() => {
                                    floatGuiActions.close();
                                    getAllApiMovimentations();
                                }}
                                onError={() => { }}
                            />
                        </InterfaceFlutuante>
                    )}

                    {floatGui.data.type === 'removeThing' && (
                        <InterfaceFlutuante
                            title='Deseja remover?'
                            onClose={floatGuiActions.close}
                        >
                            <Remover_FloatGuiModule
                                idToRemove={floatGui.data.GuiInformations.id}
                                url='/movimentacoes/delete'
                                onComplete={() => {
                                    floatGuiActions.close();
                                    getAllApiMovimentations();
                                }}
                                onError={() => { }}
                                dados={{
                                    id: floatGui.data.GuiInformations.id,
                                    nome: floatGui.data.GuiInformations.nome,
                                    tipo: floatGui.data.GuiInformations.tipo,
                                    data: formatarDateParaTexto(floatGui.data.GuiInformations.data),
                                    valor: formatarValorParaTexto(floatGui.data.GuiInformations.valor),
                                    codigo: floatGui.data.GuiInformations.codigo || '-'
                                }}
                            />
                        </InterfaceFlutuante>
                    )}
                </>
            )}
        </sh.MainPageContainer>
    )
}

export default HistoricoDeLancamentos;