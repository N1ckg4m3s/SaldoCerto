import { themeGet } from "@renderer/globalStyleInformations";
import styled from "styled-components";

export const gridCard4x2 = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap:${themeGet(t => t.GlobalSpacing.Gap14)};
    margin-bottom:${themeGet(t => t.GlobalSpacing.Medium)};
`

export const gridCard2x1 = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap:${themeGet(t => t.GlobalSpacing.Gap14)};
    margin-top:${themeGet(t => t.GlobalSpacing.Medium)};
`
