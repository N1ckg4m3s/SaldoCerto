import { GlobalBackgroundColor, GlobalBorderColor, GlobalSpacing, GlobalTextColor, GlobalTextSize } from "@renderer/globalStyleInformations";
import { cardBrackgroundBase, flexCenter, flexColumn, resetButtonStyle, resetInputStyle } from "@renderer/sheredStyles";
import styled, { css } from "styled-components";

export const BlurBackground = styled.div`
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
  width: clamp(500px, 70vh, 250px);
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

/*
    ==================== MODULOS ====================
    Daqui para baixo vai ser as estilizações dos modulos.
*/

export const ModuleContainer = styled.section`
  ${flexCenter}
  flex-direction: column;
  gap: 10px;

  & > *{
    width: 100%;
  }
`

export const ModuleFieldRow = styled.div`
  ${flexCenter}
  gap: 10px;
  height: 30px;
`

export const ModuleFormLabel = styled.label`
  white-space: nowrap;
`

export const ModuleFormInput = styled.input`
  ${resetInputStyle}
  border-bottom: 1px solid ${GlobalBorderColor.MidGray};
  width: 100%;
  height: 100%;
`

export const ModuleFormSelect = styled.select`
  ${resetInputStyle}
  border-bottom: 1px solid ${GlobalBorderColor.MidGray};
  width: 100%;
  height: 100%;
`

export const FieldTip = styled.span`
  display: inline-block;
  margin-left: 4px;
  color: #888;
  cursor: pointer;
  font-weight: bold;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  background-color: #eee;
  position: relative;

  &:hover > span {
    display: block;
  }

  & > span {
    text-align: start;
    display: none;
    position: absolute;
    top: 120%;
    left: 25%;
    transform: translateX(-25%);
    background: #333;
    color: #fff;
    padding: 6px 8px;
    font-size: 15px;
    border-radius: 4px;
    width: max-content;
    white-space: pre-wrap;
    z-index: 10;
  }
`;

export const ModuleFormButton = styled.button`
  ${resetButtonStyle}
  ${cardBrackgroundBase}
  padding: ${GlobalSpacing.Padding6x10};
  background-color: ${GlobalBackgroundColor.Success};
  font-weight: bold;
  font-size: ${GlobalTextSize.HeadingSmall};
  color: ${GlobalTextColor.White};
  letter-spacing: 1px;
  max-width: 250px;
  margin-top: ${GlobalSpacing.MediumLarge};
`

/* Options button */

export const SelectClientContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`

export const SelectClientSelect = styled.div`
  position: absolute;
  top: 100%;
  background: white;
  width: 100%;
  border: 1px solid #ccc;
  list-Style: none;
  margin: 0;
  padding: 0;
  z-Index: 10;
`

export const SelectClientOption = styled.div`
  padding: 6px;
  cursor: pointer
`