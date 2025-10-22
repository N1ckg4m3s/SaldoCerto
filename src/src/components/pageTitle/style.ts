import { GlobalSpacing, GlobalTextSize } from "../../globalStyleInformations";
import styled from "styled-components";

export const TitleContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${GlobalSpacing.Medium};
`

export const TitleH1 = styled.h1`
  font-size: ${GlobalTextSize.Heading};
`