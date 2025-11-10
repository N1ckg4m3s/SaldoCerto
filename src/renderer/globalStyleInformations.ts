import { createGlobalStyle } from 'styled-components'
import * as Dark from './styles/darkStyle'
import * as Light from './styles/lightStyle'

const isLightMode: boolean = false

export const GlobalBackgroundColor = isLightMode ? Light.LightBackgroundColor : Dark.DarkBackgroundColor

export const GlobalBorderColor = isLightMode ? Light.LightBorderColor : Dark.DarkBorderColor

export const GlobalTextColor = isLightMode ? Light.LightTextColor : Dark.DarkTextColor

export const GlobalTextSize = isLightMode ? Light.LightTextSize : Dark.DarkTextSize

export const GlobalSpacing = isLightMode ? Light.LightSpacing : Dark.DarkSpacing

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