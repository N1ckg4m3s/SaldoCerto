// NotificationContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Notification } from "@renderer/shered/viewTypes";
import { NotificationContainer } from "./component";

type NotificationContextType = {
    addNotification: (notification: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addNotification = (notification: Notification) => {
        setNotifications(prev => [...prev, notification]);
        setTimeout(() => removeNotification(notification.id), notification.duration || 5000);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
        </NotificationContext.Provider>
    );
};

