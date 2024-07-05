import { t } from 'i18next'

import './config'

const date = '2022-04-27T09:10:11.125Z'
const dateTo = '2022-04-27T17:10:11.125Z'

describe('i18n', () => {
  it('translates as expected', () => {
    expect(t('appTitle')).toBe('Team Teach Connect')
  })

  it('translates prices to GBP implicitly or explicitly', () => {
    expect(t('currency', { amount: '123.45' })).toBe('£123.45')
    expect(t('currency', { amount: '123.45', currency: 'GBP' })).toBe('£123.45')
  })

  it('translates prices to other currencies', () => {
    expect(t('currency', { amount: '123.45', currency: 'USD' })).toBe('$123.45')
    expect(t('currency', { amount: '123.45', currency: 'EUR' })).toBe('€123.45')
  })

  it('formats dates to date_short', () => {
    expect(t('dates.short', { date })).toBe('27 Apr')
  })

  it('formats dates to date_default', () => {
    expect(t('dates.default', { date })).toBe('27 April 2022')
  })

  it('formats dates to date_withTime', async () => {
    expect(t('dates.withTime', { date })).toBe('27 April 2022, 10:10 AM')
  })

  it('formats dates to date_long', () => {
    expect(t('dates.long', { date })).toBe('Wed, 27 Apr 2022')
  })

  it('formats dates to date_full', () => {
    expect(t('dates.fullDateTime', { date })).toBe('Apr 27, 2022, 10:10:11 AM')
  })

  it('formats dates to date_onlyTime', () => {
    expect(t('dates.time', { date })).toBe('10:10 AM')
  })

  it('formats dates to time from - to', () => {
    expect(t('dates.timeFromTo', { from: date, to: dateTo })).toBe(
      '10:10 AM - 06:10 PM',
    )
  })
})
