import { GlobalSpacing, GlobalTextColor, GlobalTextSize } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "@renderer/sheredStyles";
import styled, { css } from "styled-components";

const ContainerBase = css`
    ${cardBrackgroundBase};
    ${flexColumn}
    justify-content: space-between;
    margin-bottom: calc(${GlobalSpacing.Gap10}*2);
    gap: ${GlobalSpacing.Gap10};
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
    font-size: ${GlobalTextSize.Heading};
`

export const SectionTitle_Danger = styled.span`
    font-size: ${GlobalTextSize.Heading};
    color: ${GlobalTextColor.SoftRed};
    font-weight: bold;
`

export const SectionMessage_Danger = styled.span`
    color: ${GlobalTextColor.SoftRed}
`