import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translation from './en/translation.json'

type Locales = Record<string, { name: string; display: string }>

export const supportedLocales: Locales = {
  en: {
    name: 'English',
    display: '**English**',
    ...translation,
  },
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: supportedLocales,
  ns: Object.keys(translation),
  defaultNS: 'common',
  nsSeparator: '.',
  parseMissingKeyHandler: () => {
    return ''
  },
})
