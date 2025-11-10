import { GlobalBackgroundColor, GlobalTextColor } from "@renderer/globalStyleInformations";
import { resetButtonStyle } from "@renderer/sheredStyles";
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
    border: none;
    background-color: ${(props) => (props.active ? GlobalBackgroundColor.Button : GlobalBackgroundColor.LightGray)};
    color: ${(props) => (props.active ? GlobalTextColor.White : GlobalTextColor.Black)};  
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: ${(props) => (props.active ? GlobalBackgroundColor.ButtonHold : GlobalBackgroundColor.AlmostGray)};
    }
`;

export const DisabledButton = styled.button`
    padding: 8px 12px;
    border: none;
    background-color: ${GlobalBackgroundColor.AlmostGray};
    color: ${GlobalTextColor.AlmostWhite};
    cursor: not-allowed;
    border-radius: 4px;
    &:hover {
        background-color: ${GlobalBackgroundColor.AlmostGray};
    }
`;

