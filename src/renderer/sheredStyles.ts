import { css } from "styled-components";
import { themeGet } from "./globalStyleInformations";

export const flexCenter = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const flexColumn = css`
    display: flex;
    flex-direction:column;
`

export const resetButtonStyle = css`
    border: 0;
    outline: none;
    background-color: transparent;
    cursor: pointer;
`

export const resetInputStyle = css`
    border: none;
    outline: none;
`

export const cardBrackgroundBase = css`
    background-color: ${themeGet(t => t.GlobalBackgroundColor.Card)};
    padding: ${themeGet(t => t.GlobalSpacing.Large)};
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
`