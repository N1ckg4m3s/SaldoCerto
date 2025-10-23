import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { GlobalBackgroundColor, GlobalBorderColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../globalStyleInformations";
import { cardBrackgroundBase, resetButtonStyle } from "../sheredStyles";

export const MainPageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`

export const CleanReacrLink = styled(Link)`
    text-decoration: none;
    color: ${GlobalTextColor.Black};
`

/* TABELA */
export const tableContainer = styled.table`
    ${cardBrackgroundBase}
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`

interface TableThProps {
    clickable?: boolean;
}

export const tableTh = styled.th<TableThProps>`
    text-align: left;
    padding: ${GlobalSpacing.Padding14x16};
    background-color: ${GlobalBackgroundColor.GraySoft};
    color: ${GlobalTextColor.MediumGray};
    font-size: ${GlobalTextSize.Small};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
    user-select: ${({ clickable }) => (clickable ? 'none' : 'auto')};
`;


export const tableRow = styled.tr`
    border-bottom: 1px solid ${GlobalBorderColor.Gray};
`

export const tableData = styled.td`
    text-align: left;
    padding: ${GlobalSpacing.Padding14x16};
`

type situacaoClienteProps = {
    situacao: 'ativo' | 'vencido' | 'quitado'
}

export const situacaoCliente = styled.span<situacaoClienteProps>`
    font-weight: 600;
    padding: ${GlobalSpacing.Padding6x10};
    border-radius: 8px;
    font-size: ${GlobalTextSize.XS};

    ${props => props.situacao == "ativo" ?
        // Situação ativa
        css`
            background-color: ${GlobalBackgroundColor.MintGreen};
            color: ${GlobalTextColor.MintGreen};
            ` :
        props.situacao == 'vencido' ?
            // Situação Vencida
            css`
                background-color: ${GlobalBackgroundColor.SoftRed};
                color: ${GlobalTextColor.SoftRed};
            ` :
            // Situação Quitada
            css`
                background-color: ${GlobalBackgroundColor.GrayLight};
                color: ${GlobalTextColor.Muted};
            `
    }
`

export const smallTableButton = styled.button`
    ${resetButtonStyle};
    background-color: ${GlobalBackgroundColor.GrayNeutral};
    border-radius: 6px;
    padding: ${GlobalSpacing.Padding6x10};
    transition: background 0.2s;

    &:hover{
      background-color: #e2e5ea;
    }
`

/* footer */

export const FooterBotao = styled.button`
    ${resetButtonStyle}
    background-color: ${GlobalBackgroundColor.Button};
    color: ${GlobalBackgroundColor.White};
    padding: ${GlobalSpacing.Padding8x14};
    border-radius: 8px;
    font-weight: 500;
    transition: background 0.2s;
    
    &:hover {
        background-color: #0056b3;
    }
`

export const AcoesFooter = styled.footer`
    margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
`