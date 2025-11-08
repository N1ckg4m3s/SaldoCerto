import { useEffect, useState } from 'react';
import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import type { ClienteAtrazoView, PaginacaoView } from 'src/renderer/shered/viewTypes';
import { Paginacao } from '@renderer/components/pagination/component';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNavigate } from 'react-router-dom';

const useAllStates = () => {
    const [page, setPage] = useState<PaginacaoView>({ currentPage: 0, totalPages: 0 });

    const [ClientesEmAtrazo, setClientesEmAtrazo] = useState<ClienteAtrazoView[]>([])

    return {
        page: { data: page, set: setPage },
        ClientesEmAtrazo: { data: ClientesEmAtrazo, set: setClientesEmAtrazo },
    }
}

const TabelaDeClientesEmAtrazo = () => {
    const navigate = useNavigate();
    const { page, ClientesEmAtrazo } = useAllStates();

    const handleChangePage = (pageToSet: number) => {
        page.set({ ...page.data, currentPage: pageToSet });
    }

    const getApiInformations = () => {
        const payload = {
            page: page.data.currentPage,
            limit: 20,
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
            },
            onError(error) {
                console.error(error)
            }
        })
    }

    useEffect(() => { getApiInformations() }, [page.data.currentPage])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Tabela de clientes em atrazo'
                buttons={[
                    { label: 'Exportar', onClick: () => { } },
                ]}
            />

            <sh.tableContainer>
                <thead>
                    <sh.tableRow>
                        <sh.tableTh>Nome</sh.tableTh>
                        <sh.tableTh>Total vencido</sh.tableTh>
                        <sh.tableTh>Dias em atrazo</sh.tableTh>
                        <sh.tableTh>Nº Notas</sh.tableTh>
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