// src/provider/ThemeProviderWrapper.tsx
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { type ReactNode } from 'react';
import { useTheme } from './themeProvider';
import { getThemeValues } from '@renderer/globalStyleInformations';

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
    const { darkMode, fontSize } = useTheme();
    const theme = getThemeValues(darkMode, fontSize);

    return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};
