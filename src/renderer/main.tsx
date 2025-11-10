import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// @ts-ignore: allow importing css without type declarations
import './globalStyleInformations'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
