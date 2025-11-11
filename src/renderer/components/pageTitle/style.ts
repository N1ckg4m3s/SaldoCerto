import { resetButtonStyle } from "../../sheredStyles";
import { GlobalSpacing, GlobalTextColor, GlobalTextSize } from "../../globalStyleInformations";
import styled from "styled-components";

export const TitleContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${GlobalSpacing.Medium};
`

export const TitleH1 = styled.h1`
  font-size: ${GlobalTextSize.Heading};
  color: ${GlobalTextColor.Black};
`

export const HeaderButton = styled.button<{ color: string }>`
  ${resetButtonStyle};

  background-color: ${({ color }) => color};
  color: ${GlobalTextColor.White};

  padding: ${GlobalSpacing.Padding8x14};
  border-radius: 8px;
  font-weight: 500;
  transition: 0.2s;
  font-size: ${GlobalTextSize.Large};
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${GlobalSpacing.Gap10};
`;