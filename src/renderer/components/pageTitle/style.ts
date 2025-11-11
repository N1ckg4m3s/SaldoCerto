import { themeGet } from "@renderer/globalStyleInformations";
import { resetButtonStyle } from "../../sheredStyles";
import styled from "styled-components";

export const TitleContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${themeGet(t => t.GlobalSpacing.Medium)};
`

export const TitleH1 = styled.h1`
  font-size: ${themeGet(t => t.GlobalTextSize.HeadingSmall)};
  color: ${themeGet(t => t.GlobalTextColor.Black)};
`

export const HeaderButton = styled.button<{ color: string }>`
  ${resetButtonStyle};

  background-color: ${({ color }) => color};
  color: ${themeGet(t => t.GlobalTextColor.White)};

  padding: ${themeGet(t => t.GlobalSpacing.Padding8x14)};
  border-radius: 8px;
  font-weight: 500;
  transition: 0.2s;
  font-size: ${themeGet(t => t.GlobalTextSize.Normal)};
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${themeGet(t => t.GlobalSpacing.Gap10)};
`;