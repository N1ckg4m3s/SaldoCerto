import styled, { keyframes } from "styled-components";
import { flexCenter } from "../../sheredStyles";

export const LoadingContainer = styled.div`
  ${flexCenter}
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  flex-direction: column;
`;

export const MoisaicContainer = styled.div`
  width: 120px;
  height: 120px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
`;

const bounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(.1);
  }
`;

export const MoisaicBlock = styled.div<{ delay: number }>`
  width: 100%;
  height: 100%;
  background-color: #28d637ff;
  animation: ${bounce} 1.5s infinite;
  animation-delay: ${props => props.delay}s;
  border-radius: 5px;
`;