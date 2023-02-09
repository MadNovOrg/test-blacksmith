import { getI18n } from 'react-i18next'

import { CourseDeliveryType } from '@app/types'

import { formatCourseVenue } from './formatCourseVenue'

import '../i18n/config.ts'

const { t } = getI18n()
const tbcTranslation = t('common.tbc')
const virtualTranslation = t('common.course-delivery-type.VIRTUAL')

describe('formatCourseVenue utils', () => {
  const venueName = 'Queen Elizabeth II Centre'
  const venueCity = 'New York'
  it('returns the "TBC" string if the venue is undefined and delivery type is F2F', () => {
    expect(formatCourseVenue(CourseDeliveryType.F2F, undefined)).toBe(
      tbcTranslation
    )
  })

  it('returns the "TBC" string if the city and name are empty and delivery type is F2F', () => {
    const venue = {}
    expect(formatCourseVenue(CourseDeliveryType.F2F, venue)).toBe(
      tbcTranslation
    )
  })

  it('returns the name if the city is undefined and delivery type is F2F', () => {
    const venue = { name: venueName }
    expect(formatCourseVenue(CourseDeliveryType.F2F, venue)).toBe(venueName)
  })

  it('returns the city if the name is undefined and delivery type is F2F', () => {
    const venue = { city: venueCity }
    expect(formatCourseVenue(CourseDeliveryType.F2F, venue)).toBe(venueCity)
  })

  it('returns name and city are empty and delivery type is F2F', () => {
    const venue = { name: venueName, city: venueCity }
    expect(formatCourseVenue(CourseDeliveryType.F2F, venue)).toBe(
      `${venueName}, ${venueCity}`
    )
  })

  it('returns name and city are empty and delivery type is MIXED', () => {
    const venue = { name: venueName, city: venueCity }
    expect(formatCourseVenue(CourseDeliveryType.MIXED, venue)).toBe(
      `${venueName}, ${venueCity}`
    )
  })

  it('returns "Virtual" if delivery type is VIRTUAL', () => {
    expect(formatCourseVenue(CourseDeliveryType.VIRTUAL, undefined)).toBe(
      virtualTranslation
    )
  })
})
