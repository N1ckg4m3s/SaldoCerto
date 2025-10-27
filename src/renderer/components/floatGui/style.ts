import { GlobalTextSize } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexCenter, resetButtonStyle } from "@renderer/sheredStyles";
import styled, { css } from "styled-components";

export const BlurBackground = styled.main`
  ${flexCenter}
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  /* google */
  backdrop-filter: blur(2px);
  /* safari */
  -webkit-backdrop-filter: blur(2px);
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
`

export const InterfaceBackground = styled.main`
  ${cardBrackgroundBase};
  max-width: clamp(75%, 70vh, 1000px);
  width: 100%;
  max-height: 75%;
`

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 2px;
`

export const TitleContainer = styled.div`
  ${flexCenter}
  font-weight: bold;
  font-size: ${GlobalTextSize.Heading};
  position: relative;
`

export const CloseButton = styled.button`
  ${resetButtonStyle}
  position: absolute;
  right: 0px;
  background-color: red;
  font-weight: bold;
  color:white;
  border-radius: 8px;
  width: 30px;
  aspect-ratio: 1/1;
`
