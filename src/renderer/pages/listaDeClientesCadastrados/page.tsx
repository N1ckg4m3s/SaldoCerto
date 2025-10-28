import { useNavigate } from 'react-router-dom';
import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import { useEffect, useRef, useState } from 'react';
import type { ListaClienteView, NumberFilterType, PaginacaoView } from '@renderer/shered/viewTypes';
import { nextNumberFilterType } from '@renderer/controler/auxiliar';
import { Paginacao } from '@renderer/components/pagination/component';
import type { FloatGuiProps } from '@renderer/shered/types';
import InterfaceFlutuante from '@renderer/components/floatGui/component';
import { CreateEditClient_FloatGuiModule } from '@renderer/components/floatGui/models/createEditClient';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { ApiCaller } from '@renderer/controler/ApiCaller';

interface TableHeadFilterProps {
    SomaTotal: NumberFilterType;
    ProximoPagamento: NumberFilterType;
    ValorProximaNota: NumberFilterType;
}

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });
    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })
    const [TableHeadFilter, setTableHeadFilter] = useState<TableHeadFilterProps>({
        SomaTotal: null,
        ProximoPagamento: null,
        ValorProximaNota: null,
    });
    const [clientsCadastrados, setClientsCadastrados] = useState<ListaClienteView[]>([]);

    const searchRef = useRef<HTMLInputElement>(null)

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        TableHeadFilter: { data: TableHeadFilter, set: setTableHeadFilter },
        clientsCadastrados: { data: clientsCadastrados, set: setClientsCadastrados },
        searchRef
    }
}

const ListaDeClientesCadastrados = () => {
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { page, floatGui, TableHeadFilter, clientsCadastrados, searchRef } = useAllStates();

    const TableHeadDataClick = (column: keyof TableHeadFilterProps) => {
        TableHeadFilter.set(prev => {
            const next = nextNumberFilterType(prev[column]);
            return {
                // colunas atuais
                SomaTotal: null,
                ProximoPagamento: null,
                ValorProximaNota: null,

                // coluna que vai ser alterada
                [column]: next,
            };
        });
    };

    const getApiInformations = async () => {
        try {
            const payload = {
                page: page.data.currentPage,
                limit: 20,
                search: searchRef.current?.value || '',
                filters: TableHeadFilter.data,
            };

            console.log(payload)

            const response = await ApiCaller({
                url: '/cliente/getList',
                args: payload,
                onError(error) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Erro ao obter clientes',
                        message: error.message || 'Erro desconhecido',
                        type: 'error',
                    });
                },
                onSuccess(response) {
                    console.log('chegou a response:', response)
                    clientsCadastrados.set(response.data.clients || []);
                    page.set({
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages,
                    });
                },
            });

            return response;
        } catch (error) {
            addNotification({
                id: String(Date.now()),
                title: 'Erro inesperado',
                message: String(error),
                type: 'error',
            });
        }
    };

    const handleChangePage = (page: number) => {

    }

    const floatGuiActions = {
        open: () => floatGui.set({ active: true, type: 'editCliente', GuiInformations: {} }),
        close: () => floatGui.set({ active: false, type: '', GuiInformations: {} })
    };

    useEffect(() => { getApiInformations() }, [])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Clientes cadastrados'
                buttons={[
                    { label: 'Adicionar Cliente', onClick: floatGuiActions.open }
                ]}
            />
            <sh.filtrosContainer>
                <sh.searchContainer>
                    <sh.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </sh.svg>
                    <sh.searchInput ref={searchRef} />
                </sh.searchContainer>
                <sh.filterSelect>
                    <option value={""}>Todos</option>
                    <option value={"ativo"}>Ativo</option>
                    <option value={"vencido"}>Vencido</option>
                    <option value={"quitado"}>Quitado</option>
                </sh.filterSelect>

                <sh.FooterBotao onClick={getApiInformations} >Filtrar</sh.FooterBotao>
            </sh.filtrosContainer>

            <sh.tableContainer>
                <thead>
                    <sh.tableRow>
                        <sh.tableTh>Nome</sh.tableTh>

                        <sh.tableTh onClick={() => TableHeadDataClick('SomaTotal')} clickable>
                            Total em dívida
                        </sh.tableTh>

                        <sh.tableTh onClick={() => TableHeadDataClick('ProximoPagamento')} clickable>
                            Próximo pagamento
                        </sh.tableTh>

                        <sh.tableTh onClick={() => TableHeadDataClick('ValorProximaNota')} clickable>
                            Valor a cobrar
                        </sh.tableTh>

                        <sh.tableTh>
                            Situação
                        </sh.tableTh>

                        <sh.tableTh>Ações</sh.tableTh>
                    </sh.tableRow>
                </thead>
                <tbody>
                    {clientsCadastrados.data.map((value, index) => {
                        return (
                            <sh.tableRow>
                                <sh.tableData>{value.nome}</sh.tableData>
                                <sh.tableData>{value.SomaTotal}</sh.tableData>
                                <sh.tableData>{value.ProximoPagamento}</sh.tableData>
                                <sh.tableData>{value.ValorProximaNota}</sh.tableData>
                                <sh.tableData>
                                    <sh.situacaoCliente
                                        situacao={value.Situacao}>
                                        {value.Situacao}
                                    </sh.situacaoCliente>
                                </sh.tableData>
                                <sh.tableData>
                                    <sh.smallTableButton onClick={() => {
                                        navigate(`/informacoesDoCliente/${value.id}`);
                                    }}> 🔍 </sh.smallTableButton>
                                </sh.tableData>
                            </sh.tableRow>
                        )
                    })}
                </tbody>
            </sh.tableContainer>

            <Paginacao
                currentPage={page.data.currentPage}
                onPageChange={handleChangePage}
                totalPages={page.data.totalPages}
            />

            <sh.AcoesFooter>
                <sh.FooterBotao> Exportar </sh.FooterBotao>
            </sh.AcoesFooter>

            {floatGui.data.active && floatGui.data.type == 'editCliente' &&
                <InterfaceFlutuante
                    title='Adicionar Cliente'
                    onClose={floatGuiActions.close}>

                    <CreateEditClient_FloatGuiModule
                        onComplete={() => {
                            floatGuiActions.close()
                            getApiInformations()
                        }}
                    />
                </InterfaceFlutuante>
            }
        </sh.MainPageContainer>
    )
}

export default ListaDeClientesCadastrados;