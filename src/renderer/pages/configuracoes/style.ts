import { themeGet } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "@renderer/sheredStyles";
import styled, { css } from "styled-components";

const ContainerBase = css`
    ${cardBrackgroundBase};
    ${flexColumn}
    justify-content: space-between;
    margin-bottom: calc(${themeGet(t => t.GlobalSpacing.Gap10)}*2);
    gap: ${themeGet(t => t.GlobalSpacing.Gap10)};
`

export const SectionContainer = styled.section`
    ${ContainerBase}
`

export const SectionContainer_Danger = styled.section`
    ${ContainerBase}
    background: hsla(0, 100%, 95%, 1.00);
    border: 1px solid #f5c6cb;
`

export const SectionTitle = styled.span`
    font-size: ${themeGet(t => t.GlobalTextSize.Heading)};
    color: ${themeGet(t => t.GlobalTextColor.Black)};
`

export const SectionTitle_Danger = styled.span`
    font-size: ${themeGet(t => t.GlobalTextSize.Heading)};
    color: ${themeGet(t => t.GlobalTextColor.SoftRed)};
    font-weight: bold;
`

export const SectionMessage_Danger = styled.span`
    font-size: ${themeGet(t => t.GlobalTextSize.HeadingSmall)};
    color: ${themeGet(t => t.GlobalTextColor.SoftRed)}
`