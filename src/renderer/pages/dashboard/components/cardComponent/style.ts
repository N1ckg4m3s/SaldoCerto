import { themeGet } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexColumn } from "../../../../sheredStyles";
import styled, { css } from "styled-components";

interface CardProps {
    clicable?: boolean
}

export const cardContainer = styled.div<CardProps>`
    ${cardBrackgroundBase};
    ${flexColumn}
    justify-content: space-between;

    ${props => props.clicable && css`
        cursor: pointer;
    `}
    
    height: 100%;
`

export const cardTitle = styled.small`
    color: ${themeGet(t => t.GlobalTextColor.Muted)};
    font-size: ${themeGet(t => t.GlobalTextSize.Normal)};
`

export const cardData = styled.div`
    font-size: ${themeGet(t => t.GlobalTextSize.Heading)};
    font-weight: 700;
    margin-top: ${themeGet(t => t.GlobalSpacing.Medium)};
    color: ${themeGet(t => t.GlobalTextColor.Black)};
`

export const cardDescription = styled.div`
    margin-top: ${themeGet(t => t.GlobalSpacing.XS)};
    font-size: ${themeGet(t => t.GlobalTextSize.Normal)};
    color: ${themeGet(t => t.GlobalTextColor.Muted)}
`