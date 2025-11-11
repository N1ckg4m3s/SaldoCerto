import { themeGet } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "../../../../sheredStyles";
import styled, { css } from "styled-components";

export const painelContainer = styled.div`
    ${cardBrackgroundBase};
`

export const painelTitle = styled.h3`
    margin-bottom: ${themeGet(t => t.GlobalSpacing.SmallMedium)};
    font-size: ${themeGet(t => t.GlobalTextSize.Base)};
    color: ${themeGet(t => t.GlobalTextColor.Accent)};
`

export const paineItensList = styled.div`
    ${flexColumn}
`

/* ===== ROW  ===== */

export const rowItemList = styled.div`
    display:flex;
    justify-content: space-between;
    padding: ${themeGet(t => t.GlobalSpacing.Padding6x10)};
    border-bottom: 1px solid ${themeGet(t => t.GlobalBorderColor.LightGray)};
`

export const rowAditionalInfo = styled.div`
    font-size: ${themeGet(t => t.GlobalTextSize.Normal)};
    color: ${themeGet(t => t.GlobalTextColor.Muted)};
`

type PillProps = {
    bad?: boolean,
    good?: boolean,
    ok?: boolean,
}

export const rowPill = styled.div<PillProps>`
    padding: ${themeGet(t => t.GlobalSpacing.Padding6x10)};
    border-radius: 8px;
    font-weight: 700;
    font-size: ${themeGet(t => t.GlobalTextSize.Base)};

    ${props => props.bad && css`
        background-color: ${themeGet(t => t.GlobalBackgroundColor.LightPink)};
        color: ${themeGet(t => t.GlobalTextColor.Danger)};
    `}
        
    ${props => props.good && css`
        background-color: ${themeGet(t => t.GlobalBackgroundColor.LightGreen)};
        color: ${themeGet(t => t.GlobalTextColor.Success)};
    `}
            
    ${props => props.ok && css`
        background-color: ${themeGet(t => t.GlobalBackgroundColor.LightOrange)};
        color: ${themeGet(t => t.GlobalTextColor.Warn)};
    `}
`

export const Title = styled.strong`
    color: ${themeGet(t => t.GlobalTextColor.Black)};
    font-size: ${themeGet(t => t.GlobalTextSize.Base)};
`