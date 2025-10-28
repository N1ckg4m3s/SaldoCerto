import { useNavigate } from 'react-router-dom';
import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import { useEffect, useState } from 'react';
import type { ListaClienteView, NumberFilterType, PaginacaoView } from '@renderer/shered/viewTypes';
import { nextNumberFilterType } from '@renderer/controler/auxiliar';
import { Paginacao } from '@renderer/components/pagination/component';
import type { FloatGuiProps } from '@renderer/shered/types';
import InterfaceFlutuante from '@renderer/components/floatGui/component';
import { CreateEditClient_FloatGuiModule } from '@renderer/components/floatGui/models/createEditClient';

interface TableHeadFilterProps {
    SomaTotal: NumberFilterType;
    ProximoPagamento: NumberFilterType;
    ValorProximaNota: NumberFilterType;
}

const ListaDeClientesCadastrados = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<PaginacaoView>({
        currentPage: 0,
        totalPages: 5
    });
    const [floatGui, setFloatGui] = useState<FloatGuiProps>({
        active: true,
        type: '',
        GuiInformations: {},
    })

    const mockData: ListaClienteView[] = [
        {
            nome: "João da Silva",
            SomaTotal: 320,
            ProximoPagamento: '22/10/2025',
            ValorProximaNota: 120,
            Situacao: 'ativo',
        },
        {
            nome: "Maria Souza",
            SomaTotal: 500,
            ProximoPagamento: '14/10/2025',
            ValorProximaNota: 500,
            Situacao: 'vencido',
        },
        {
            nome: "Carlos Lima",
            SomaTotal: 0,
            ProximoPagamento: '-',
            ValorProximaNota: 0,
            Situacao: 'quitado',
        }
    ]

    const [TableHeadFilter, setTableHeadFilter] = useState<TableHeadFilterProps>({
        SomaTotal: null,
        ProximoPagamento: null,
        ValorProximaNota: null,
    });

    const TableHeadDataClick = (column: keyof TableHeadFilterProps) => {
        setTableHeadFilter(prev => {
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

    const handleOpenClientInformations = () => {
        navigate('/informacoesDoCliente');
    }

    const handleChangePage = (page: number) => {

    }

    const handleOpenFloatGui = () => {
        setFloatGui({
            active: true,
            type: 'editCliente',
            GuiInformations: {},
        })
    }
    const handleCloseFloatGui = () => {
        setFloatGui({
            active: false,
            type: '',
            GuiInformations: {},
        })
    }

    useEffect(() => { }, [TableHeadFilter, page.currentPage])

    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Clientes cadastrados'
                buttons={[
                    { label: 'Adicionar Cliente', onClick: handleOpenFloatGui }
                ]}
            />
            <sh.filtrosContainer>
                <sh.searchContainer>
                    <sh.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </sh.svg>
                    <sh.searchInput />
                </sh.searchContainer>
                <sh.filterSelect>
                    <option value={""}>Todos</option>
                    <option value={"ativo"}>Ativo</option>
                    <option value={"vencido"}>Vencido</option>
                    <option value={"quitado"}>Quitado</option>
                </sh.filterSelect>
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
                    {mockData.map((value, index) => {

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
                                    <sh.smallTableButton onClick={handleOpenClientInformations}>
                                        🔍
                                    </sh.smallTableButton>
                                </sh.tableData>
                            </sh.tableRow>
                        )
                    })}
                </tbody>
            </sh.tableContainer>

            <Paginacao
                currentPage={page.currentPage}
                onPageChange={handleChangePage}
                totalPages={page.totalPages}
            />

            <sh.AcoesFooter>
                <sh.FooterBotao> Exportar </sh.FooterBotao>
            </sh.AcoesFooter>

            {floatGui.active && floatGui.type == 'editCliente' &&
                <InterfaceFlutuante
                    title='Adicionar Cliente'
                    onClose={handleCloseFloatGui}>

                    <CreateEditClient_FloatGuiModule
                        onComplete={() => { }}
                        onError={() => { }}
                    />
                </InterfaceFlutuante>
            }
        </sh.MainPageContainer>
    )
}

export default ListaDeClientesCadastrados;