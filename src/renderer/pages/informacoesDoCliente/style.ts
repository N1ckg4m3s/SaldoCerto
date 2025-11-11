import { themeGet } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "../../sheredStyles";
import styled from "styled-components";

export const HistoryContainer = styled.div`
    ${cardBrackgroundBase};
    ${flexColumn}
    gap: ${themeGet(t => t.GlobalSpacing.Gap10)};
`

export const informationsContainer = styled.div`
    ${cardBrackgroundBase};
    display: flex;
    margin-bottom: ${themeGet(t => t.GlobalSpacing.Medium)};
    color: ${themeGet(t => t.GlobalTextColor.AlmostBlack)};
`

export const Information = styled.span`
    font-size: ${themeGet(t => t.GlobalTextSize.Small)};
`

export const InformationsGroup = styled.section`
    ${flexColumn}
    gap: ${themeGet(t => t.GlobalSpacing.Gap10)};
    width: 100%;
`

export const title = styled.h3`
    color: ${themeGet(t => t.GlobalTextColor.AlmostBlack)};
    font-size: ${themeGet(t => t.GlobalTextSize.Heading)};
`