import { format as F } from 'date-fns'
import {} from 'date-fns/locale'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translation from './en/translation.json'

type Locales = Record<string, { name: string; display: string }>

const dateLocales: Record<string, Locale> = {}

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
    format: (value, format = 'dd/MM/yyyy', lng) => {
      if (!value) return ''

      if (format === 'price') {
        return Intl.NumberFormat(lng, {
          style: 'currency',
          currency: 'GBP',
        }).format(value)
      }

      // else it's a date
      const d = new Date(value)
      const dateLocale = lng ? dateLocales[lng] : undefined
      return F(d, format, { locale: dateLocale })
    },
  },
  resources: supportedLocales,
  ns: Object.keys(translation),
  defaultNS: 'common',
  nsSeparator: '.',
  parseMissingKeyHandler: () => {
    return ''
  },
})
