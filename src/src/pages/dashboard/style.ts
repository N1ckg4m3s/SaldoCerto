import { GlobalSpacing } from "../../globalStyleInformations";
import styled from "styled-components";

export const Warp = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`

export const gridCard4x2 = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${GlobalSpacing.Gap14};
    margin-bottom: ${GlobalSpacing.Medium};
`

export const gridCard2x1 = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${GlobalSpacing.Gap14};
    margin-top: ${GlobalSpacing.Medium};
`
