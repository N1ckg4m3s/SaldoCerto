import { useEffect, useState } from 'react';
import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import type { ClienteAtrazoView, NumberFilterType } from 'src/renderer/shered/viewTypes';
import { nextNumberFilterType } from '@renderer/controler/auxiliar';

interface TableHeadFilterProps {
    ValorVencido: NumberFilterType;
    DiasDeAtrazo: NumberFilterType;
    NumeroDeNotas: NumberFilterType;
}

const TabelaDeClientesEmAtrazo = () => {
    const [ClientesEmAtrazo, setClientesEmAtrazo] = useState<ClienteAtrazoView[]>([
        {
            nome: "João da Silva",
            ValorVencido: 450,
            DiasDeAtrazo: 5,
            NumeroDeNotas: 3,
        },
        {
            nome: "Maria Souza",
            ValorVencido: 220,
            DiasDeAtrazo: 12,
            NumeroDeNotas: 2,
        },
        {
            nome: "Carlos Lima",
            ValorVencido: 900,
            DiasDeAtrazo: 20,
            NumeroDeNotas: 5,
        }
    ])

    const [TableHeadFilter, setTableHeadFilter] = useState<TableHeadFilterProps>({
        ValorVencido: null,
        DiasDeAtrazo: null,
        NumeroDeNotas: null
    });

    const TableHeadDataClick = (column: keyof TableHeadFilterProps) => {
        setTableHeadFilter(prev => {
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

    useEffect(() => {
        console.log('Buscar itens:', TableHeadFilter)
    }, [TableHeadFilter])

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
                    {ClientesEmAtrazo.map((value, index) => (
                        <sh.tableRow>
                            <sh.tableData>{value.nome}</sh.tableData>
                            <sh.tableData>{value.ValorVencido}</sh.tableData>
                            <sh.tableData>{value.DiasDeAtrazo}</sh.tableData>
                            <sh.tableData>{value.NumeroDeNotas}</sh.tableData>
                            <sh.tableData>
                                <sh.smallTableButton onClick={() => { }}>
                                    🔍
                                </sh.smallTableButton>
                            </sh.tableData>
                        </sh.tableRow>
                    ))}
                </tbody>
            </sh.tableContainer>
        </sh.MainPageContainer>
    )
}

export default TabelaDeClientesEmAtrazo;