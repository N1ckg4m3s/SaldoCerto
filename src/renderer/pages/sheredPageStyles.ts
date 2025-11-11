import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { cardBrackgroundBase, resetButtonStyle, resetInputStyle } from "../sheredStyles";
import { themeGet } from "@renderer/globalStyleInformations";

export const MainPageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`

export const CleanReacrLink = styled(Link)`
    text-decoration: none;
    color: ${themeGet(t => t.GlobalTextColor.Black)};
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
    color: ${themeGet(t => t.GlobalBackgroundColor.Accent)};
`

interface TableThProps {
    clickable?: boolean;
}

export const tableTh = styled.th<TableThProps>`
    text-align: left;
    padding: ${themeGet(t => t.GlobalSpacing.Padding14x16)};
    background-color: ${themeGet(t => t.GlobalBackgroundColor.GraySoft)};
    color: ${themeGet(t => t.GlobalTextColor.MediumGray)};
    font-size: ${themeGet(t => t.GlobalTextSize.Small)};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
    user-select: ${({ clickable }) => (clickable ? 'none' : 'auto')};
`;


export const tableRow = styled.tr`
    border-bottom: 1px solid ${themeGet(t => t.GlobalBorderColor.Gray)};
    background-color: ${themeGet(t => t.GlobalBackgroundColor.White)};
    font-size: ${themeGet(t => t.GlobalTextSize.Small)};
`

export const tableData = styled.td`
    text-align: left;
    padding: ${themeGet(t => t.GlobalSpacing.Padding14x16)};
`

type situacaoClienteProps = {
    situacao: 'ativo' | 'vencido' | 'quitado';
}

type tipoNotaProps = {
    situacao: 'Pedido' | 'Pagamento';
}

export const situacaoCliente = styled.span<situacaoClienteProps>`
    font-weight: 600;
    padding: ${themeGet(t => t.GlobalSpacing.Padding6x10)};
    border-radius: 8px;
    font-size: ${themeGet(t => t.GlobalTextSize.XS)};

    ${props => props.situacao == "ativo" ?
        // Situação ativa
        css`
            background-color: ${themeGet(t => t.GlobalBackgroundColor.MintGreen)};
            color: ${themeGet(t => t.GlobalTextColor.MintGreen)};
            ` :
        props.situacao == 'vencido' ?
            // Situação Vencida
            css`
                background-color: ${themeGet(t => t.GlobalBackgroundColor.SoftRed)};
                color: ${themeGet(t => t.GlobalTextColor.SoftRed)};
            ` :
            // Situação Quitada
            css`
                background-color: ${themeGet(t => t.GlobalBackgroundColor.GrayLight)};
                color: ${themeGet(t => t.GlobalTextColor.Muted)};
            `
    }
`

export const tipoNota = styled.span<tipoNotaProps>`
    font-weight: 600;
    padding: ${themeGet(t => t.GlobalSpacing.Padding6x10)};
    border-radius: 8px;
    font-size: ${themeGet(t => t.GlobalTextSize.XS)};

    ${props => props.situacao == "Pedido" ?
        css`
            background-color: ${themeGet(t => t.GlobalBackgroundColor.SoftRed)};
            color: ${themeGet(t => t.GlobalTextColor.SoftRed)};
            ` :
        css`
            background-color: ${themeGet(t => t.GlobalBackgroundColor.MintGreen)};
            color: ${themeGet(t => t.GlobalTextColor.MintGreen)};
        `
    }
`

export const smallTableButton = styled.button`
    ${resetButtonStyle};
    background-color: ${themeGet(t => t.GlobalBackgroundColor.GrayNeutral)};
    border-radius: 6px;
    padding: ${themeGet(t => t.GlobalSpacing.Padding6x10)};
    transition: background 0.2s;
    font-size: ${themeGet(t => t.GlobalTextSize.Normal)};

    &:hover{
      background-color: #e2e5ea;
    }
`

/* footer */
export const FooterBotao = styled.button`
    ${resetButtonStyle}
    background-color: ${themeGet(t => t.GlobalBackgroundColor.Button)};
    color: ${themeGet(t => t.GlobalBackgroundColor.White)};
    padding: ${themeGet(t => t.GlobalSpacing.Padding8x14)};
    border-radius: 8px;
    font-size: ${themeGet(t => t.GlobalTextSize.Normal)};
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

/* FILTRO */
export const filtrosContainer = styled.form`
    display: flex;
    justify-content: space-between; 
    align-items: center;
    margin-bottom: ${themeGet(t => t.GlobalSpacing.Large)};
    gap: ${themeGet(t => t.GlobalSpacing.Gap10)};
`

export const searchContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    background-color: ${themeGet(t => t.GlobalBackgroundColor.White)};
    border-radius: 8px;
    padding: ${themeGet(t => t.GlobalSpacing.Padding6x10)};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: ${themeGet(t => t.GlobalTextColor.DarkGray)};
    font-size: ${themeGet(t => t.GlobalTextSize.HeadingSmall)};
`

export const svg = styled.svg`
    width: 18px;
    height: 18px;
    margin-right: ${themeGet(t => t.GlobalSpacing.Small)};
    opacity: 0.6;
`

export const searchInput = styled.input`
    ${resetInputStyle}
    flex: 1;
    padding: ${themeGet(t => t.GlobalSpacing.Small)};
    font-size: ${themeGet(t => t.GlobalTextSize.Base)};
    background-color: ${themeGet(t => t.GlobalBackgroundColor.White)};
    color: ${themeGet(t => t.GlobalTextColor.DarkGray)};
`

export const filterSelect = styled.select`
    padding: ${themeGet(t => t.GlobalSpacing.SmallMedium)};
    border-radius: 8px;
    border: 1px solid ${themeGet(t => t.GlobalBorderColor.MidGray)};
    background-color: ${themeGet(t => t.GlobalBackgroundColor.White)};
    font-size: ${themeGet(t => t.GlobalTextSize.Base)};
    color: ${themeGet(t => t.GlobalTextColor.DarkGray)};
    cursor: pointer;
`