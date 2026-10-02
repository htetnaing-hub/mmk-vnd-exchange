import { createContext, useContext } from 'react'
import { MESSAGES, type Language, type Messages } from './messages'

export interface I18n {
  lang: Language
  t: Messages
  setLang: (lang: Language) => void
}

export const I18nContext = createContext<I18n>({ lang: 'en', t: MESSAGES.en, setLang: () => {} })

export const useI18n = () => useContext(I18nContext)
