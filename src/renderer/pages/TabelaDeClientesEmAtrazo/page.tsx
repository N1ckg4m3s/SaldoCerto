import { useEffect, useRef, useState } from 'react';
import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import type { ClienteAtrazoView, NumberFilterType, PaginacaoView } from 'src/renderer/shered/viewTypes';
import { nextNumberFilterType } from '@renderer/controler/auxiliar';
import { Paginacao } from '@renderer/components/pagination/component';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNavigate } from 'react-router-dom';

interface TableHeadFilterProps {
    ValorVencido: NumberFilterType;
    DiasDeAtrazo: NumberFilterType;
    NumeroDeNotas: NumberFilterType;
}

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });

    const [ClientesEmAtrazo, setClientesEmAtrazo] = useState<ClienteAtrazoView[]>([])

    const [TableHeadFilter, setTableHeadFilter] = useState<TableHeadFilterProps>({
        ValorVencido: null,
        DiasDeAtrazo: null,
        NumeroDeNotas: null
    });

    const searchRef = useRef<HTMLInputElement>(null)

    return {
        page: { data: page, set: setPage },
        TableHeadFilter: { data: TableHeadFilter, set: setTableHeadFilter },
        ClientesEmAtrazo: { data: ClientesEmAtrazo, set: setClientesEmAtrazo },
        searchRef
    }
}

const TabelaDeClientesEmAtrazo = () => {
    const navigate = useNavigate();
    const { page, TableHeadFilter, ClientesEmAtrazo, searchRef } = useAllStates();

    const TableHeadDataClick = (column: keyof TableHeadFilterProps) => {
        TableHeadFilter.set(prev => {
            const next = nextNumberFilterType(prev[column]);
            return {
                // colunas atuais
                ValorVencido: null,
                DiasDeAtrazo: null,
                NumeroDeNotas: null,

                // coluna que vai ser alterada
                [column]: next,
            };
        });
    };

    const handleChangePage = (page: number) => {

    }

    useEffect(() => {
        try {
            const payload = {
                page: page.data.currentPage,
                limit: 20,
                search: searchRef.current?.value || '',
                filters: TableHeadFilter.data,
            };
            ApiCaller({
                url: '/movimentacoes/getInadimplentesList',
                args: payload,
                onSuccess(response) {
                    if (response.success) {
                        ClientesEmAtrazo.set(response.data.inadimplentes)
                        page.set({
                            currentPage: 0,
                            totalPages: response.data.totalPages
                        })
                    }
                    console.log(response);
                },
                onError(error) {
                    console.error(error)
                }
            })
        } catch (e) {

        }
    }, [])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Tabela de clientes em atrazo'
                buttons={[
                    { label: 'Exportar', onClick: () => { } },
                ]}
            />

            <sh.filtrosContainer>
                <sh.searchContainer>
                    <sh.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </sh.svg>
                    <sh.searchInput />
                </sh.searchContainer>
            </sh.filtrosContainer>

            <sh.tableContainer>
                <thead>
                    <sh.tableRow>
                        <sh.tableTh>Nome</sh.tableTh>
                        <sh.tableTh onClick={() => TableHeadDataClick('ValorVencido')} clickable>
                            Total vencido
                        </sh.tableTh>
                        <sh.tableTh onClick={() => TableHeadDataClick('DiasDeAtrazo')} clickable >
                            Dias em atrazo
                        </sh.tableTh>
                        <sh.tableTh onClick={() => TableHeadDataClick('NumeroDeNotas')} clickable >
                            Nº Notas
                        </sh.tableTh>

                        <sh.tableTh>Ações</sh.tableTh>
                    </sh.tableRow>
                </thead>
                <tbody>
                    {ClientesEmAtrazo.data && ClientesEmAtrazo.data.map((value, index) => (
                        <sh.tableRow>
                            <sh.tableData>{value.nome}</sh.tableData>
                            <sh.tableData>{value.ValorVencido}</sh.tableData>
                            <sh.tableData>{value.DiasDeAtrazo}</sh.tableData>
                            <sh.tableData>{value.NumeroDeNotas}</sh.tableData>
                            <sh.tableData>
                                <sh.smallTableButton onClick={() => {
                                    navigate(`/informacoesDoCliente/${value.id}`);
                                }}> 🔍 </sh.smallTableButton>
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

        </sh.MainPageContainer>
    )
}

export default TabelaDeClientesEmAtrazo;