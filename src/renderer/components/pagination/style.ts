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
    background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
    color: ${(props) => (props.active ? '#fff' : '#000')};  
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: ${(props) => (props.active ? '#0056b3' : '#e0e0e0')};
    }
`;

export const DisabledButton = styled.button`
    padding: 8px 12px;
    border: none;
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
    border-radius: 4px;
    &:hover {
        background-color: #e0e0e0;
    }
`;

