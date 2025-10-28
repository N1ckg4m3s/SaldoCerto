import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import * as s from './style'
import type { InformacoesDoClienteView, PaginacaoView } from '@renderer/shered/viewTypes';
import { useEffect, useState } from 'react';
import { Paginacao } from '@renderer/components/pagination/component';
import type { Cliente, FloatGuiProps } from '@renderer/shered/types';
import InterfaceFlutuante from '@renderer/components/floatGui/component';
import { CreateEditClient_FloatGuiModule } from '@renderer/components/floatGui/models/createEditClient';
import { useParams } from 'react-router-dom';

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });
    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })
    const [client, setClient] = useState<Cliente>();

    const [historico, setHistorico] = useState<InformacoesDoClienteView[]>([]);

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        client: { data: client, set: setClient },
        historico: { data: historico, set: setHistorico },
    }
}

const InformacoesDoCliente = () => {
    const { id } = useParams<{ id: string }>();

    const { page, floatGui, client, historico } = useAllStates()

    const floatGuiActions = {
        open: () => floatGui.set({ active: true, type: 'editCliente', GuiInformations: {} }),
        close: () => floatGui.set({ active: false, type: '', GuiInformations: {} })
    };

    const formatValue = (valor?: number): string => {
        // se não tiver valor retorna '-'
        if (!valor || valor == 0) return '-';

        // retorna formatado
        return valor.toFixed(2)
    }

    const handleChangePage = (page: number) => {

    }

    useEffect(() => {
        // Atualiza apenas o historico por conta da paginação
    }, [page.data.currentPage])

    useEffect(() => {
        // Atualiza geral
    }, [id, page.data.currentPage])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Informações do cliente - [NOME]'
                buttons={[
                    { label: 'Registrar movimentação', onClick: () => { } },
                    { label: 'Exportar lista', onClick: () => { } },
                    { label: '⚙', onClick: floatGuiActions.open },
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
                        {historico.data.map((value, index) => {
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

            <Paginacao
                currentPage={page.data.currentPage}
                onPageChange={handleChangePage}
                totalPages={page.data.totalPages}
            />

            {floatGui.data.active && floatGui.data.type == 'editCliente' &&
                <InterfaceFlutuante
                    title='<EDIT | CREATE> Cliente'
                    onClose={floatGuiActions.close}>

                    <CreateEditClient_FloatGuiModule
                        onComplete={() => { }}
                        onError={() => { }}
                    />
                </InterfaceFlutuante>
            }

        </sh.MainPageContainer>
    )
}

export default InformacoesDoCliente;
