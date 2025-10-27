import type { Notification, NotificationType } from "@renderer/shered/viewTypes";
import * as s from './style'

// NotificationContainer.tsx
export const NotificationContainer = ({ notifications, removeNotification }: {
    notifications: Notification[];
    removeNotification: (id: string) => void;
}) => {
    return (
        <s.NotificationWrapper>
            {(notifications || []).map(n => (
                <s.NotificationContainer type={n.type} >
                    <s.NotificationHeader type={n.type} >
                        <s.NotificationText>{n.title}</s.NotificationText>
                        {n.errorCode && <s.NotificationText>{n.errorCode}</s.NotificationText>}
                    </s.NotificationHeader>
                    <s.NotificationMessage>
                        {n.message}
                    </s.NotificationMessage>
                </s.NotificationContainer>
            ))}
        </s.NotificationWrapper>
    );
};