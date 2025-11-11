// themeContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ThemeContextProps {
    darkMode: boolean;
    fontSize: 'small' | 'normal' | 'big';
    setDarkMode: (v: boolean) => void;
    setFontSize: (v: 'small' | 'normal' | 'big') => void;
}
const ThemeContext = createContext<ThemeContextProps>({} as any);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultDarkMode?: boolean;
    defaultFontSize?: "small" | "normal" | "big";
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultDarkMode = false, defaultFontSize = "normal", }) => {
    const [darkMode, setDarkMode] = useState(defaultDarkMode);
    const [fontSize, setFontSize] = useState(defaultFontSize);

    return (
        <ThemeContext.Provider value={{ darkMode, fontSize, setDarkMode, setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);