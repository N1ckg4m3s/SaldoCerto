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
  ${flexColumn}
  ${cardBrackgroundBase};
  width: clamp(400px, 35vw, 500px);
  height: clamp(400px, 35vw, 500px);
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e8ec;
`;

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

export const TitleContainer = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  color: #222;
  position: relative;
  width: 100%;
  text-align: center;
`;

export const CloseButton = styled.button`
  ${resetButtonStyle};
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(-5%);
  background-color: #ff4d4f;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #d9363e;
  }
`;

/*
    ==================== MODULOS ====================
    Daqui para baixo vai ser as estilizações dos modulos.
*/

export const ModuleContainer = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModuleFieldRow = styled.div`
  ${flexCenter}
  gap: 10px;
  height: 30px;
`

export const ModuleFormLabel = styled.label`
  white-space: nowrap;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  font-size: 0.95rem;
`;

export const ModuleFormInput = styled.input`
  ${resetInputStyle};
  width: 100%;
  height: 36px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 15px;
  color: #333;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const ModuleFormSelect = styled.select`
  ${resetInputStyle};
  width: 100%;
  height: 36px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 15px;
  color: #333;
  background-color: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
`;

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
  ${resetButtonStyle};
  width: 100%;
  padding: 10px 0;
  border-radius: 8px;
  background-color: #28a745;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.3px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #218838;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #1e7e34;
    box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

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
  cursor: pointer;
`

export const FillSpace = styled.div`
  flex: 1;
`;
