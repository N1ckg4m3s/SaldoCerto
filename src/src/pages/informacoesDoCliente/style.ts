import { GlobalSpacing, GlobalTextSize } from "../..//globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "../..//sheredStyles";
import styled from "styled-components";

export const HistoryContainer = styled.div`
    ${cardBrackgroundBase};
    ${flexColumn}
    gap: ${GlobalSpacing.Gap10};
    `

export const informationsContainer = styled.div`
    ${cardBrackgroundBase};
    ${flexColumn}
    gap: ${GlobalSpacing.Gap10};
    margin-bottom: ${GlobalSpacing.Medium};
`

export const Information = styled.span`
    font-size: ${GlobalTextSize.Small};
`
