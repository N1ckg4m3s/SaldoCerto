import type { NotificationType } from "@renderer/shered/viewTypes";
import styled from "styled-components";

export const NotificationWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
`;

export const NotificationContainer = styled.div<{ type: NotificationType }>`
  border-radius: 10px;
  max-width: 250px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(234, 170, 170, 0.15);

  background-color: ${({ type }) => {
    switch (type) {
      case 'success': return '#81B182'; // verde claro
      case 'warning': return '#FFB84D'; // laranja claro
      case 'error': return '#F68880';   // vermelho claro
      default: return '#EEE';
    }
  }};
`;

export const NotificationHeader = styled.header<{ type: NotificationType }>`
  display: flex;
  justify-content: space-between;
  padding: 2px 6px;
  font-weight: bold;
  background-color: ${({ type }) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#999';
    }
  }};
`;

export const NotificationText = styled.span`
  color: black;
  font-weight: bold;
  display: block;
  padding: 8px 6px;
`;

export const NotificationMessage = styled.span`
  display: block;
  padding: 12px 6px;
  font-weight: normal;
  font-weight: 500;
`;
