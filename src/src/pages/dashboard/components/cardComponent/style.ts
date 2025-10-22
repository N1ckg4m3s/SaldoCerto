import { flexColumn } from "../../../../sheredStyles";
import { GlobalBackgroundColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../../../globalStyleInformations";
import styled, { css } from "styled-components";

interface CardProps {
    clicable?: boolean
}

export const cardContainer = styled.div<CardProps>`
    background-color: ${GlobalBackgroundColor.Card};
    padding: ${GlobalSpacing.Large};
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
    ${flexColumn}
    justify-content: space-between;

    ${props => props.clicable && css`
        cursor: pointer;
    `}
`

export const cardTitle = styled.small`
    color: ${GlobalTextColor.Muted};
    font-size: ${GlobalTextSize.Normal};
    `

export const cardData = styled.div`
    font-size: ${GlobalTextSize.HeadingLarge};
    font-weight: 700;
    margin-top: ${GlobalSpacing.Medium};
`

export const cardDescription = styled.div`
    margin-top: ${GlobalSpacing.XS};
    font-size: ${GlobalTextSize.Normal};
    color: ${GlobalTextColor.Muted}
`