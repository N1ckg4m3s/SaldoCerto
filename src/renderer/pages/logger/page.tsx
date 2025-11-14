import { useEffect, useState } from 'react';
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

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });

    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })

    const [Logs, setLogs] = useState<logs[]>([])

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        Logs: { data: Logs, set: setLogs },
    }
}

const TabelaDeLogsDoSistema = () => {
    const { page, floatGui, Logs } = useAllStates();

    const handleChangePage = (pageToSet: number) => {
        page.set({ ...page.data, currentPage: pageToSet });
    }

    const getApiInformations = () => {
        const payload = {
            page: page.data.currentPage,
            limit: 20,
            filters: {
                deData: '',
                ateData: '',
                tipoLog: ''
            }
        };


        // Break para não chamar a api
        return;
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
                    NO DATA
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
                                }}
                                necessaryPageData={{}}
                                urlDataOrigin='/logs/get'
                                onComplete={() => {
                                    floatGuiActions.close();
                                }}
                            />
                        </InterfaceFlutuante>
                    )}
                </>
            )}

        </sh.MainPageContainer>
    )
}

export default TabelaDeLogsDoSistema;