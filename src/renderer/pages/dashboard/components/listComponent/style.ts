import { cardBrackgroundBase, flexColumn } from "../../../../sheredStyles";
import { GlobalBackgroundColor, GlobalBorderColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../../../globalStyleInformations";
import styled, { css } from "styled-components";

export const painelContainer = styled.div`
    ${cardBrackgroundBase};
`

export const painelTitle = styled.h3`
    margin-bottom: ${GlobalSpacing.SmallMedium};
    font-size: ${GlobalTextSize.Base};
    color: ${GlobalTextColor.Accent};
`

export const paineItensList = styled.div`
    ${flexColumn}
`

/* ===== ROW  ===== */

export const rowItemList = styled.div`
    display:flex;
    justify-content: space-between;
    padding: ${GlobalSpacing.Padding6x10};
    border-bottom: 1px solid ${GlobalBorderColor.LightGray};
`

export const rowAditionalInfo = styled.div`
    font-size: ${GlobalTextSize.Normal};
    color: ${GlobalTextColor.Muted};
`

type PillProps = {
    bad?: boolean,
    good?: boolean,
    ok?: boolean,
}

export const rowPill = styled.div<PillProps>`
    padding: ${GlobalSpacing.Padding6x10};
    border-radius: 8px;
    font-weight: 700;
    font-size: ${GlobalTextSize.Base};

    ${props => props.bad && css`
        background-color: ${GlobalBackgroundColor.LightPink};
        color: ${GlobalTextColor.Danger};
    `}
        
    ${props => props.good && css`
        background-color: ${GlobalBackgroundColor.LightGreen};
        color: ${GlobalTextColor.Success};
    `}
            
    ${props => props.ok && css`
        background-color: ${GlobalBackgroundColor.LightOrange};
        color: ${GlobalTextColor.Warn};
    `}
`

export const Title = styled.strong`
    color: ${GlobalTextColor.Black};
    font-size: ${GlobalTextSize.Base};
`