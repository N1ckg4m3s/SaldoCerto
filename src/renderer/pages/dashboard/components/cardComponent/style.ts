import { cardBrackgroundBase, flexColumn } from "../../../../sheredStyles";
import { GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../../../globalStyleInformations";
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
    color: ${GlobalTextColor.Muted};
    font-size: ${GlobalTextSize.Large};
`

export const cardData = styled.div`
    font-size: ${GlobalTextSize.HeadingLarge};
    font-weight: 700;
    margin-top: ${GlobalSpacing.Medium};
    color: ${GlobalTextColor.Black};
`

export const cardDescription = styled.div`
    margin-top: ${GlobalSpacing.XS};
    font-size: ${GlobalTextSize.Large};
    color: ${GlobalTextColor.Muted}
`