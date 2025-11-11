import { GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "../../sheredStyles";
import styled from "styled-components";

export const HistoryContainer = styled.div`
    ${cardBrackgroundBase};
    ${flexColumn}
    gap: ${GlobalSpacing.Gap10};
`

export const informationsContainer = styled.div`
    ${cardBrackgroundBase};
    display: flex;
    margin-bottom: ${GlobalSpacing.Medium};
    color: ${GlobalTextColor.AlmostBlack};
`

export const Information = styled.span`
    font-size: ${GlobalTextSize.Small};
`

export const InformationsGroup = styled.section`
    ${flexColumn}
    gap: ${GlobalSpacing.Gap10};
    width: 100%;
`

export const title = styled.h3`
    color: ${GlobalTextColor.AlmostBlack};
    font-size: ${GlobalTextSize.Heading};
`