import { createGlobalStyle } from 'styled-components'
// Cores
import * as Dark from './styles/darkStyle'
import * as Light from './styles/lightStyle'

// Fontes
import * as fontSmall from './styles/font/smallSizes'
import * as fontNormal from './styles/font/normalSizes'
import * as fontBig from './styles/font/bigSizes'

const isLightMode: boolean = true
const fontSize: 'small' | 'normal' | 'big' = 'normal'

const fontBySize = {
  small: fontSmall.TextSize,
  normal: fontNormal.TextSize,
  big: fontBig.TextSize,
}
const spacingBySize = {
  small: fontSmall.Spacing,
  normal: fontNormal.Spacing,
  big: fontBig.Spacing,
}

export const GlobalBackgroundColor = isLightMode ? Light.LightBackgroundColor : Dark.DarkBackgroundColor

export const GlobalBorderColor = isLightMode ? Light.LightBorderColor : Dark.DarkBorderColor

export const GlobalTextColor = isLightMode ? Light.LightTextColor : Dark.DarkTextColor

export const GlobalTextSize = fontBySize[fontSize]

export const GlobalSpacing = spacingBySize[fontSize]

export const HeaderTitleButtonColors = isLightMode ? Light.LightHeaderTitleButtonColors : Dark.DarkHeaderTitleButtonColors

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Inter, system-ui, Arial;
  }

  body {
    margin: 10px 20px;
    background-color: ${GlobalBackgroundColor.BG};
  }
`