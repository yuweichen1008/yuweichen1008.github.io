import { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import ja from '../locales/ja.json'

const LOCALES = { en, zh, ja }
const STORAGE_KEY = 'yomi_locale'
const SUPPORTED = ['en', 'zh', 'ja']

function detectBrowserLocale() {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language || ''
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('ja')) return 'ja'
  return 'en'
}

export const LocaleContext = createContext({ locale: 'en', setLocale: () => {} })

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED.includes(stored)) {
      setLocaleState(stored)
    } else {
      setLocaleState(detectBrowserLocale())
    }
  }, [])

  function setLocale(l) {
    if (!SUPPORTED.includes(l)) return
    localStorage.setItem(STORAGE_KEY, l)
    setLocaleState(l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

// Deep-get a key like "nav.life" from the locale object
function get(obj, path) {
  return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj)
}

export function useTranslation() {
  const { locale, setLocale } = useContext(LocaleContext)
  const strings = LOCALES[locale] || LOCALES.en

  function t(key) {
    return get(strings, key) || get(LOCALES.en, key) || key
  }

  return { t, locale, setLocale }
}
