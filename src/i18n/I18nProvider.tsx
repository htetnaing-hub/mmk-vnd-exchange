import { useEffect, type ReactNode } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import { I18nContext } from './context'
import { LANGUAGES, MESSAGES, type Language } from './messages'

const isLanguage = (v: unknown): v is Language => LANGUAGES.includes(v as Language)

/** First visit: whichever of English or Burmese comes first in the browser's preferences. */
function browserLanguage(): Language {
  for (const l of navigator.languages ?? []) {
    const code = l.toLowerCase().split('-')[0]
    if (isLanguage(code)) return code
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = usePersistentState<Language>('lang', browserLanguage(), isLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <I18nContext value={{ lang, t: MESSAGES[lang], setLang }}>{children}</I18nContext>
}
