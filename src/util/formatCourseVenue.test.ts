import { getI18n } from 'react-i18next'

import { Course_Delivery_Type_Enum, Venue } from '@app/generated/graphql'

import { formatCourseVenue } from './formatCourseVenue'

import '../i18n/config.ts'

const { t } = getI18n()
const tbcTranslation = t('common.tbc')
const virtualTranslation = t('common.course-delivery-type.VIRTUAL')

describe('formatCourseVenue utils', () => {
  const venueName = 'Queen Elizabeth II Centre'
  const venueCity = 'New York'
  it('returns the "TBC" string if the venue is undefined and delivery type is F2F', () => {
    expect(formatCourseVenue(Course_Delivery_Type_Enum.F2F, undefined)).toBe(
      tbcTranslation,
    )
  })

  it('returns the "TBC" string if the city and name are empty and delivery type is F2F', () => {
    const venue = {} as Venue
    expect(formatCourseVenue(Course_Delivery_Type_Enum.F2F, venue)).toBe(
      tbcTranslation,
    )
  })

  it('returns the name if the city is undefined and delivery type is F2F', () => {
    const venue = { name: venueName } as Venue
    expect(formatCourseVenue(Course_Delivery_Type_Enum.F2F, venue)).toBe(
      venueName,
    )
  })

  it('returns the city if the name is undefined and delivery type is F2F', () => {
    const venue = { city: venueCity } as Venue
    expect(formatCourseVenue(Course_Delivery_Type_Enum.F2F, venue)).toBe(
      venueCity,
    )
  })

  it('returns name and city are empty and delivery type is F2F', () => {
    const venue = { name: venueName, city: venueCity } as Venue
    expect(formatCourseVenue(Course_Delivery_Type_Enum.F2F, venue)).toBe(
      `${venueName}, ${venueCity}`,
    )
  })

  it('returns name and city are empty and delivery type is MIXED', () => {
    const venue = { name: venueName, city: venueCity } as Venue
    expect(formatCourseVenue(Course_Delivery_Type_Enum.Mixed, venue)).toBe(
      `${venueName}, ${venueCity}`,
    )
  })

  it('returns "Virtual" if delivery type is VIRTUAL', () => {
    expect(
      formatCourseVenue(Course_Delivery_Type_Enum.Virtual, undefined),
    ).toBe(virtualTranslation)
  })
})
