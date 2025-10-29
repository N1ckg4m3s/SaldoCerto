import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import type { HistoricoDeLancamentoView, PaginacaoView } from '@renderer/shered/viewTypes';
import { Paginacao } from '@renderer/components/pagination/component';
import { useRef, useState } from 'react';
import type { FloatGuiProps } from '@renderer/shered/types';
import { AdicionarMovimentacao_FloatGuiModule } from '@renderer/components/floatGui/models/adicionarMovimentacao';
import InterfaceFlutuante from '@renderer/components/floatGui/component';

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
    const searchRef = useRef<HTMLInputElement>(null);

    return {
        page: { data: page, set: setPage },
        floatGui: { data: floatGui, set: setFloatGui },
        movimentacoes: { data: movimentacoes, set: setMovimentacoes },
        deDataRef,
        ateDataRef,
        optionRef,
        searchRef
    }
}

const HistoricoDeLancamentos = () => {
    const { page, floatGui, movimentacoes, deDataRef, ateDataRef, optionRef, searchRef } = useAllStates();

    const mockData: HistoricoDeLancamentoView[] = [
        {
            id: '',
            data: "10/10/2025",
            ClientId: '',
            nome: "João Silva",
            tipo: "Pedido",
            valor: 250,
            codigo: '0-001c',
        },
        {
            id: '',
            data: "12/10/2025",
            ClientId: '',
            nome: "João Silva",
            tipo: "Pagamento",
            valor: 100,
            codigo: '-',
        },
        {
            id: '',
            data: "15/10/2025",
            ClientId: '',
            nome: "Maria Oliveira",
            tipo: "Pedido",
            valor: 350,
            codigo: '0-005c',
        },
    ];

    const formatValue = (valor: string | undefined): string => {
        // se não tiver valor retorna '-'
        if (!valor) return '-';

        // tenta transformar em numero
        const stringToNumber = Number(valor);
        if (isNaN(stringToNumber)) {
            return '-' // nulo
        }

        // retorna formatado
        return `$${stringToNumber.toFixed(2)}`
    }

    const getAllApiMovimentations = () => {
        // aqui vai obter todos os dados do cliente
        const payload = {
            page: page.data.currentPage,
            limit: 20,
            search: searchRef.current?.value || '',
            filters: {
                de: deDataRef.current?.value || '',
                ate: ateDataRef.current?.value || '',
                option: optionRef.current?.value || '',
            },
        }
    }

    const handleChangePage = (page: number) => {

    }

    const floatGuiActions = {
        openAddNewMovimentacao: () => floatGui.set({ active: true, type: 'addMovimentacao', GuiInformations: {} }),
        close: () => floatGui.set({ active: false, type: '', GuiInformations: {} }),
    }

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
                    <option value={"pedigos"}>Pedidos</option>
                    <option value={"pagamento"}>Pagamentos</option>
                </sh.filterSelect>

                {/* Pesquisa */}
                <sh.searchContainer>
                    <sh.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </sh.svg>
                    <sh.searchInput placeholder='Cliente' ref={searchRef} />
                </sh.searchContainer>

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
                    {
                        mockData.map((value, index) => (
                            <sh.tableRow>
                                <sh.tableData>{value.data}</sh.tableData>
                                <sh.tableData>{value.nome}</sh.tableData>
                                <sh.tableData>
                                    <sh.tipoNota
                                        situacao={value.tipo}>
                                        {value.tipo}
                                    </sh.tipoNota>
                                </sh.tableData>
                                <sh.tableData>{formatValue(value.valor.toString())}</sh.tableData>
                                <sh.tableData>{value.codigo || '-'}</sh.tableData>
                                <sh.tableData>
                                    <sh.smallTableButton onClick={() => { }}>
                                        🔍
                                    </sh.smallTableButton>
                                </sh.tableData>
                            </sh.tableRow>
                        ))
                    }
                </tbody>
            </sh.tableContainer>

            <Paginacao
                currentPage={page.data.currentPage}
                onPageChange={handleChangePage}
                totalPages={page.data.totalPages}
            />

            {floatGui.data.active && floatGui.data.type == 'addMovimentacao' &&
                <InterfaceFlutuante
                    title='Adicionar movimentação'
                    onClose={floatGuiActions.close}>

                    <AdicionarMovimentacao_FloatGuiModule
                        onComplete={() => {
                            floatGuiActions.close()
                            getAllApiMovimentations();
                        }}
                        onError={() => { }}
                    />
                    
                </InterfaceFlutuante>
            }

        </sh.MainPageContainer>
    )
}

export default HistoricoDeLancamentos;