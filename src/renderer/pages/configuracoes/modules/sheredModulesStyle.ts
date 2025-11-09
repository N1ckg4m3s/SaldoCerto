import { flexCenter, resetButtonStyle, resetInputStyle } from "@renderer/sheredStyles";
import styled from "styled-components";

export const ModuleFieldRow = styled.div`
  display: flex;
  gap: 10px;
  height: 30px;
  justify-content: space-between;
`

export const ModuleFormLabel = styled.label`
  white-space: nowrap;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  font-size: 0.95rem;
  align-self: center;
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
  ${flexCenter}
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

export const ModuleFormCheck = styled.input`
  background-color: red;
  height: 30px;
  background-color: #fff;
  align-self: flex-start;
  margin-right: 100%;
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