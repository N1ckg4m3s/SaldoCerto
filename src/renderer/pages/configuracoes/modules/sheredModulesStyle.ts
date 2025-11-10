import { GlobalBackgroundColor, GlobalBorderColor, GlobalTextColor } from "@renderer/globalStyleInformations";
import { flexCenter, resetButtonStyle, resetInputStyle } from "@renderer/sheredStyles";
import styled from "styled-components";

export const ModuleFormCheck = styled.input`
  background-color: red;
  height: 30px;
  background-color: #fff;
  align-self: flex-start;
  margin-right: 100%;
`;

export const ModuleContainer = styled.section<{ gap?: number }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props) => `${props.gap || 16}px`};
`;

export const ModuleFieldRow = styled.div`
  display: flex;
  gap: 10px;
  height: 30px;
  justify-content: space-between;
`;

export const ModuleFormLabel = styled.label`
  white-space: nowrap;
  font-weight: 500;
  color: ${GlobalTextColor.DarkGray};
  margin-bottom: 4px;
  font-size: 0.95rem;
`;

export const ModuleFormInput = styled.input`
  ${resetInputStyle};
  width: 100%;
  height: 36px;
  border: 1px solid ${GlobalBorderColor.MidGray};
  border-radius: 6px;
  padding: 0 10px;
  font-size: 15px;
  color: ${GlobalTextColor.DarkGray};
  background-color: ${GlobalBackgroundColor.White};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${GlobalBackgroundColor.Button}; /* botão padrão */
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1); /* precisa criar GlobalShadow.Focus */
  }

  &::placeholder {
    color: ${GlobalTextColor.AlmostWhite};
  }
`;

export const ModuleFormSelect = styled.select`
  ${resetInputStyle};
  width: 100%;
  height: 36px;
  border: 1px solid ${GlobalBorderColor.MidGray};
  border-radius: 6px;
  padding: 0 10px;
  font-size: 15px;
  color: ${GlobalTextColor.DarkGray};
  background-color: ${GlobalBackgroundColor.White};
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
`;

export const FieldTip = styled.span`
  display: inline-block;
  margin-left: 4px;
  color: ${GlobalTextColor.Muted};
  cursor: pointer;
  font-weight: bold;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  background-color: ${GlobalBackgroundColor.Gray};
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
    background: ${GlobalTextColor.DarkGray};
    color: ${GlobalTextColor.White};
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
  ${flexCenter}
  width: 100%;
  padding: 10px 0;
  border-radius: 8px;
  background-color: ${GlobalBackgroundColor.Success};
  color: ${GlobalTextColor.White};
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.3px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15); /* precisa criar GlobalShadow.Base */
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${GlobalBackgroundColor.MintGreen}; /* precisa criar SuccessHover */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: ${GlobalBackgroundColor.Accent};
    box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

/* Options button */

export const SelectClientContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`;

export const SelectClientSelect = styled.div`
  position: absolute;
  top: 100%;
  background: ${GlobalBackgroundColor.White};
  width: 100%;
  border: 1px solid ${GlobalBorderColor.MidGray};
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
`;

export const SelectClientOption = styled.div`
  padding: 6px;
  cursor: pointer;
  color: ${GlobalTextColor.DarkGray};
  background-color: ${GlobalBackgroundColor.White};

  &:hover {
    background-color: ${GlobalBackgroundColor.LightGray}; /* precisa criar HoverGray */
  }
`;

export const FillSpace = styled.div`
  flex: 1;
`;

export const span = styled.span`
  color: ${GlobalBackgroundColor.Black}
`