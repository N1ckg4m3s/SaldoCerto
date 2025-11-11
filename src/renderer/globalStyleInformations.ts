import { createGlobalStyle } from 'styled-components'
// globalStyleInformations.ts
import * as Dark from './styles/darkStyle';
import * as Light from './styles/lightStyle';
import * as fontSmall from './styles/font/smallSizes';
import * as fontNormal from './styles/font/normalSizes';
import * as fontBig from './styles/font/bigSizes';

/** theme get */
export const themeGet = (fn: (theme: any) => string) => (props: any) => fn(props.theme);

const fontBySize = { small: fontSmall.TextSize, normal: fontNormal.TextSize, big: fontBig.TextSize };
const spacingBySize = { small: fontSmall.Spacing, normal: fontNormal.Spacing, big: fontBig.Spacing };

export const getThemeValues = (darkMode: boolean, fontSize: 'small' | 'normal' | 'big') => {
  return {
    GlobalBackgroundColor: darkMode ? Dark.DarkBackgroundColor : Light.LightBackgroundColor,
    GlobalBorderColor: darkMode ? Dark.DarkBorderColor : Light.LightBorderColor,
    GlobalTextColor: darkMode ? Dark.DarkTextColor : Light.LightTextColor,
    GlobalTextSize: fontBySize[fontSize],
    GlobalSpacing: spacingBySize[fontSize],
    HeaderTitleButtonColors: darkMode ? Dark.DarkHeaderTitleButtonColors : Light.LightHeaderTitleButtonColors
  }
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Inter, system-ui, Arial;
  }

  body {
    margin: 10px 20px;
    background-color: ${themeGet(t => t.GlobalBackgroundColor.BG)};
  }
`