import { GlobalBackgroundColor, GlobalBorderColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../globalStyleInformations";
import { cardBrackgroundBase, resetButtonStyle, resetInputStyle } from "../../sheredStyles";
import styled, { css } from "styled-components";

export const filtrosContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${GlobalSpacing.Large};
    gap: ${GlobalSpacing.Gap10};
`

export const searchContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    background-color: ${GlobalBackgroundColor.White};
    border-radius: 8px;
    padding: ${GlobalSpacing.Padding6x10};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const svg = styled.svg`
    width: 18px;
    height: 18px;
    margin-right: ${GlobalSpacing.Small};
    opacity: 0.6;
`

export const searchInput = styled.input`
    ${resetInputStyle}
    flex: 1;
    padding: ${GlobalSpacing.Small};
    font-size: ${GlobalTextSize.Base};
    `

export const filterSelect = styled.select`
    padding: ${GlobalSpacing.SmallMedium};
    border-radius: 8px;
    border: 1px solid ${GlobalBorderColor.MidGray};
    background-color: ${GlobalBackgroundColor.White};
    font-size: ${GlobalTextSize.Base};
    color: ${GlobalTextColor.DarkGray};
    cursor: pointer;
`
