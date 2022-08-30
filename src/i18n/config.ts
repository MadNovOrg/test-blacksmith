import { format as F } from 'date-fns'
import {} from 'date-fns/locale'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import aol from './en/aol.json'
import translation from './en/translation.json'

type Locales = Record<string, { name: string; display: string }>

const dateLocales: Record<string, Locale> = {}

export const supportedLocales: Locales = {
  en: {
    name: 'English',
    display: '**English**',
    ...translation,
    ...aol,
  },
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: supportedLocales,
  ns: [...Object.keys(translation), 'aol'],
  defaultNS: 'common',
  nsSeparator: '.',
  parseMissingKeyHandler: () => '',
})

export const dateFormats = {
  date_default: 'd MMMM yyyy',
  date_defaultShort: 'd MMM yyyy',
  date_short: 'dd MMM',
  date_withTime: 'd MMMM yyyy, hh:mm aa',
  date_long: 'EEE, dd MMM yyyy',
  date_full: 'PPpp',
  date_onlyTime: 'hh:mm aa',
}

Object.entries(dateFormats).forEach(([name, format]) => {
  i18n.services.formatter?.add(name, formatDates(format))
})

function formatDates(format: string) {
  return (value: string, lng?: string) => {
    const d = new Date(value)
    const dateLocale = lng ? dateLocales[lng] : undefined
    return F(d, format, { locale: dateLocale })
  }
}
