import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
// Only downloaded when Burmese text is on screen (the CSS uses unicode-range).
import '@fontsource/noto-sans-myanmar/400.css'
import '@fontsource/noto-sans-myanmar/600.css'
import '@fontsource/noto-sans-myanmar/700.css'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
