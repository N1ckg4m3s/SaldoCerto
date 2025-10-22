import { resetButtonStyle } from "../../sheredStyles";
import { GlobalBackgroundColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../globalStyleInformations";
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

export const HeaderButton = styled.button`
  ${resetButtonStyle}

  background-color: ${GlobalBackgroundColor.Button};
  color: ${GlobalTextColor.White};

  padding: ${GlobalSpacing.Padding8x14};
  border-radius: 8px;
  font-weight: 500;
  transition:  0.2s;

  &:hover{
    background-color: #0056b3;
  }
`

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${GlobalSpacing.Gap10};
`;