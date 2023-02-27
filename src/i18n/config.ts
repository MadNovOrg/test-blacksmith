import { format as F } from 'date-fns'
import {} from 'date-fns/locale'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import aol from './en/aol.json'
import common from './en/common.json'
import components from './en/components.json'
import dates from './en/dates.json'
import pages from './en/pages.json'

const dateLocales: Record<string, Locale> = {}

export const supportedLocales = {
  en: {
    name: 'English',
    display: '**English**',
    pages,
    common,
    components,
    dates,
    aol,
  },
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: supportedLocales,
  ns: ['common', 'components', 'dates', 'pages', 'aol'],
  defaultNS: 'common',
  nsSeparator: '.',
  parseMissingKeyHandler: () => '',
  returnNull: false,
})

export const dateFormats = {
  date_default: 'd MMMM yyyy',
  date_defaultShort: 'd MMM yyyy',
  date_short: 'dd MMM',
  date_withTime: 'd MMMM yyyy, hh:mm aa',
  date_long: 'EEE, dd MMM yyyy',
  date_long_withTime: 'EEE, dd MMM yyyy, hh:mm aa',
  date_full: 'PPpp',
  date_onlyTime: 'hh:mm aa',
  date_fullInSentence: "do 'of' MMMM yyyy",
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
