import { formatCourseVenue } from './formatCourseVenue'

describe('formatCourseVenue utils', () => {
  const venueName = 'Queen Elizabeth II Centre'
  const venueCity = 'New York'
  it('returns an empty string if the venue is undefined', () => {
    expect(formatCourseVenue(undefined)).toBe('')
  })

  it('returns an empty string if the city and name are empty', () => {
    const venue = {}
    expect(formatCourseVenue(venue)).toBe('')
  })

  it('returns the name if the city is undefined', () => {
    const venue = { name: venueName }
    expect(formatCourseVenue(venue)).toBe(venueName)
  })

  it('returns the city if the name is undefined', () => {
    const venue = { city: venueCity }
    expect(formatCourseVenue(venue)).toBe(venueCity)
  })

  it('returns name and city', () => {
    const venue = { name: venueName, city: venueCity }
    expect(formatCourseVenue(venue)).toBe(`${venueName}, ${venueCity}`)
  })
})
