import { themeGet } from "@renderer/globalStyleInformations";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
`;

export const PageButton = styled.button<{ active?: boolean }>`
    padding: 8px 12px;
    font-size: ${themeGet(t => t.GlobalTextSize.Normal)};
    border: none;
    background-color: ${(props) => (props.active ? themeGet(t => t.GlobalBackgroundColor.Button) : themeGet(t => t.GlobalBackgroundColor.LightGray))};
    color: ${(props) => (props.active ? themeGet(t => t.GlobalTextColor.White) : themeGet(t => t.GlobalTextColor.Black))};  
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: ${(props) => (props.active ? themeGet(t => t.GlobalBackgroundColor.ButtonHold) : themeGet(t => t.GlobalBackgroundColor.AlmostGray))};
    }
`;

export const DisabledButton = styled.button`
    padding: 8px 12px;
    border: none;
    background-color: ${themeGet(t => t.GlobalBackgroundColor.AlmostGray)};
    color: ${themeGet(t => t.GlobalTextColor.AlmostWhite)};
    cursor: not-allowed;
    border-radius: 4px;
    &:hover {
        background-color: ${themeGet(t => t.GlobalBackgroundColor.AlmostGray)};
    }
`;

