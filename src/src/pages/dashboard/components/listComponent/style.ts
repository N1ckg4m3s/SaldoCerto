import { flexColumn } from "../../../../sheredStyles";
import { GlobalBackgroundColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../../../globalStyleInformations";
import styled, { css } from "styled-components";

export const painelContainer = styled.div`
    background-color: ${GlobalBackgroundColor.Card};
    padding: ${GlobalSpacing.MediumLarge};
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);
`

export const painelTitle = styled.h3`
    margin-bottom: ${GlobalSpacing.SmallMedium};
    font-size: ${GlobalTextSize.Large};
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
    border-bottom: 1px solid #f0f0f0;
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

    ${props => props.bad && css`
        background-color: ${GlobalBackgroundColor.LightPink};
        color: ${GlobalTextColor.Danger}
    `}
        
    ${props => props.good && css`
        background-color: ${GlobalBackgroundColor.LightGreen};
        color: ${GlobalTextColor.Success}
    `}
            
    ${props => props.ok && css`
        background-color: ${GlobalBackgroundColor.LightOrange};
        color: ${GlobalTextColor.Warn}
    `}
`