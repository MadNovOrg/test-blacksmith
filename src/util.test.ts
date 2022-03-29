import {
  formatDateRange,
  courseStarted,
  courseEnded,
  formatDateForDraft,
} from './util'

import { buildCourse } from '@test/mock-data-utils'

describe('formatDateRange', () => {
  it('returns single date with month when within same day', () => {
    const from = new Date(2022, 1, 8)
    const to = new Date(2022, 1, 8)
    expect(formatDateRange(from, to)).toEqual('8th February')
  })

  it('returns dates and single month when within same month', () => {
    const from = new Date(2022, 1, 8)
    const to = new Date(2022, 1, 9)
    expect(formatDateRange(from, to)).toEqual('8th-9th February')
  })

  it('returns both dates and months when within same year', () => {
    const from = new Date(2022, 1, 8)
    const to = new Date(2022, 2, 9)
    expect(formatDateRange(from, to)).toEqual('8th February - 9th March')
  })

  it('returns full date range when not in the same year', () => {
    const from = new Date(2022, 1, 8)
    const to = new Date(2023, 2, 9)
    expect(formatDateRange(from, to)).toEqual(
      '8th February 2022 - 9th March 2023'
    )
  })
})

describe('formatDateForDraft', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns appropriate message if date is within the last half a minute', () => {
    jest.setSystemTime(new Date(2022, 3, 28, 15, 15, 59))
    const date = new Date(2022, 3, 28, 15, 15, 31)
    expect(formatDateForDraft(date, 'ago')).toEqual('less than a minute ago')
  })

  it('returns minutes elapsed if date is within the hour', () => {
    jest.setSystemTime(new Date(2022, 3, 28, 15, 15))
    const date = new Date(2022, 3, 28, 15, 0)
    expect(formatDateForDraft(date, 'ago')).toEqual('15 minutes ago')
  })

  it('returns hours elapsed if date is within the day', () => {
    jest.setSystemTime(new Date(2022, 3, 28, 23, 59))
    const date = new Date(2022, 3, 28, 0, 0)
    expect(formatDateForDraft(date, 'ago')).toEqual('about 24 hours ago')
  })

  it('returns actual date, if date is over one day ago', () => {
    jest.setSystemTime(new Date('2022-03-28 12:00'))
    const date = new Date('2022-03-27 11:59')
    expect(formatDateForDraft(date, 'ago')).toEqual('March 27, 2022')
  })
})

describe('courseStarted', () => {
  it('should return false', () => {
    const course = buildCourse()
    course.schedule[0].start = new Date(2030, 0, 1)
    expect(courseStarted(course)).toBeFalsy()
  })

  it('should return true', () => {
    const course = buildCourse()
    course.schedule[0].start = new Date(2000, 0, 1)
    expect(courseStarted(course)).toBeTruthy()
  })
})

describe('courseEnded', () => {
  it('should return false', () => {
    const course = buildCourse()
    course.schedule[0].end = new Date(2030, 0, 1)
    expect(courseEnded(course)).toBeFalsy()
  })

  it('should return true', () => {
    const course = buildCourse()
    course.schedule[0].end = new Date(2000, 0, 1)
    expect(courseEnded(course)).toBeTruthy()
  })
})
