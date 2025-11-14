import { useEffect, useRef, useState } from 'react';
import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import type { PaginacaoView } from 'src/renderer/shered/viewTypes';
import { Paginacao } from '@renderer/components/pagination/component';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNavigate } from 'react-router-dom';
import type { FloatGuiProps, logs } from '@renderer/shered/types';
import { ExportarInformacoes_FloatGuiModule } from '@renderer/components/floatGui/models/export';
import InterfaceFlutuante from '@renderer/components/floatGui/component';
import { formatarDateParaTexto } from '@renderer/controler/auxiliar';
import { ShowLogs_FloatGuiModule } from '@renderer/components/floatGui/models/logsData';

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });

    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })

    const [Logs, setLogs] = useState<logs[]>([])


    const deDataRef = useRef<HTMLInputElement>(null);
    const ateDataRef = useRef<HTMLInputElement>(null);
    const optionRef = useRef<HTMLSelectElement>(null);

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        Logs: { data: Logs, set: setLogs },
        deDataRef,
        ateDataRef,
        optionRef
    }
}

const TabelaDeLogsDoSistema = () => {
    const { page, floatGui, Logs, deDataRef, ateDataRef, optionRef } = useAllStates();

    const handleChangePage = (pageToSet: number) => {
        page.set({ ...page.data, currentPage: pageToSet });
    }

    const handleCleanFilters = () => {
        // Zera os campos de data
        if (deDataRef.current) deDataRef.current.value = "";
        if (ateDataRef.current) ateDataRef.current.value = "";

        // Zera o select
        if (optionRef.current) optionRef.current.value = "";

        // Opcional: dispara a API sem filtros
        getApiInformations();
    };

    const getApiInformations = () => {
        const payload = {
            page: page.data.currentPage,
            limit: 20,
            filters: {
                de: deDataRef.current?.value || '',
                ate: ateDataRef.current?.value || '',
                tipoLog: optionRef.current?.value || ''
            }
        };

        // Break para não chamar a api
        ApiCaller({
            url: '/logs/get',
            args: payload,
            onSuccess(response) {
                if (response.success) {
                    Logs.set(response.data.logs)
                    page.set({
                        currentPage: 0,
                        totalPages: response.data.totalPages
                    })
                }
            },
            onError(error) {
                console.error(error)
            }
        })
    }

    const floatGuiActions = {
        openExportList: (GuiInformations: any) => floatGui.set({ active: true, type: 'export', GuiInformations }),
        openLogView: (GuiInformations: any) => floatGui.set({ active: true, type: 'logView', GuiInformations }),
        close: () => floatGui.set({ active: false, type: '', GuiInformations: {} }),
    }

    useEffect(() => { getApiInformations() }, [page.data.currentPage])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Logs do sistema'
                buttons={[
                    { label: 'Exportar', onClick: floatGuiActions.openExportList },
                ]}
            />

            <sh.filtrosContainer
                onSubmit={(e) => {
                    e.preventDefault();
                    getApiInformations();
                }}
            >
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
                    <option value={"error"}>Erros</option>
                    <option value={"warning"}>Avisos</option>
                    <option value={"success"}>Sucesso</option>
                </sh.filterSelect>

                <sh.FooterBotao onClick={handleCleanFilters}>Clean</sh.FooterBotao>
                <sh.FooterBotao onClick={getApiInformations}>Filtrar</sh.FooterBotao>
            </sh.filtrosContainer>

            <sh.tableContainer>
                <thead>
                    <sh.tableRow>
                        <sh.tableTh>Data</sh.tableTh>
                        <sh.tableTh>Tipo</sh.tableTh>
                        <sh.tableTh>Titulo</sh.tableTh>
                        <sh.tableTh>Message</sh.tableTh>
                        <sh.tableTh>-</sh.tableTh>
                    </sh.tableRow>
                </thead>
                <tbody>
                    {Logs.data && Logs.data.map((log: any) => (
                        <sh.tableRow>
                            <sh.tableData>{formatarDateParaTexto(log.data || '')}</sh.tableData>
                            <sh.tableData>{log.type || '-'}</sh.tableData>
                            <sh.tableData>{log.title || '-'}</sh.tableData>
                            <sh.tableData>{log.mensagem || '-'}</sh.tableData>
                            <sh.tableData>
                                <sh.smallTableButton onClick={() => floatGuiActions.openLogView(log)}>🔍</sh.smallTableButton>
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
                    {floatGui.data.type === 'export' && (
                        <InterfaceFlutuante
                            title='Exportar informações'
                            onClose={floatGuiActions.close}
                        >
                            <ExportarInformacoes_FloatGuiModule
                                filters={{
                                    page: page.data.currentPage,
                                    limit: 20,
                                    filters: {
                                        de: deDataRef.current?.value || '',
                                        ate: ateDataRef.current?.value || '',
                                        tipoLog: optionRef.current?.value || ''
                                    }
                                }}
                                necessaryPageData={{}}
                                urlDataOrigin='/logs/get'
                                onComplete={() => {
                                    floatGuiActions.close();
                                }}
                            />
                        </InterfaceFlutuante>
                    )}

                    {floatGui.data.type === 'logView' && (
                        <InterfaceFlutuante
                            title='Informações de log'
                            onClose={floatGuiActions.close}
                        >
                            <ShowLogs_FloatGuiModule
                                dados={floatGui.data.GuiInformations}
                            />
                        </InterfaceFlutuante>
                    )}
                </>
            )}

        </sh.MainPageContainer>
    )
}

export default TabelaDeLogsDoSistema;