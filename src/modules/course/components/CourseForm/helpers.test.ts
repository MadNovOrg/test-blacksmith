import { subDays } from 'date-fns'

import { makeDate, isEndDateTimeBeforeStartDateTime } from './helpers'

describe('makeDate', () => {
  it('returns today with time set to midnight if the date is null and time is an empty string', () => {
    const date = makeDate(null, '')

    const expectedDate = new Date(new Date().setHours(0, 0, 0, 0))

    expect(date).toEqual(expectedDate)
  })

  it('returns the provided date with time set to midnight if time is an empty string', () => {
    const inputDate = new Date(2023, 2, 15) // 15th of March 2023

    const date = makeDate(inputDate, '')

    const expectedDate = new Date(new Date(inputDate).setHours(0, 0, 0, 0))

    expect(date).toEqual(expectedDate)
  })

  it('returns today with time set to the provided time if the date is null', () => {
    const date = makeDate(null, '11:37')

    const expectedDate = new Date(new Date().setHours(11, 37, 0, 0))

    expect(date).toEqual(expectedDate)
  })
})

describe('isEndDateTimeBeforeStartDateTime', () => {
  const validStartDate = new Date(2023, 0, 10) // The 10th of January 2023
  const validStartTime = '9:00'
  const validEndDate = new Date(2023, 2, 15) // The 15th of March 2023
  const validEndTime = '11:00'

  it('returns false if Start Date is null', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        null,
        validStartTime,
        validEndDate,
        validEndTime,
      ),
    ).toBeFalsy()
  })

  it('returns false if Start Date is an invalid date', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        new Date(''),
        validStartTime,
        validEndDate,
        validEndTime,
      ),
    ).toBeFalsy()
  })

  it('returns false if Start Time is an empty string', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        '',
        validEndDate,
        validEndTime,
      ),
    ).toBeFalsy()
  })

  it('returns false if End Date is null', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        validStartTime,
        null,
        validEndTime,
      ),
    ).toBeFalsy()
  })

  it('returns false if End Date is an invalid date', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        validStartTime,
        new Date(''),
        validEndTime,
      ),
    ).toBeFalsy()
  })

  it('returns false if End Time is an empty string', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        validStartTime,
        validEndDate,
        '',
      ),
    ).toBeFalsy()
  })

  it('returns true if End Date is before Start Date', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        validStartTime,
        subDays(validStartDate, 1),
        validEndTime,
      ),
    ).toBeTruthy()
  })

  it('returns true if End Date and Time are the same of Start Date and Time', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        validStartTime,
        validStartDate,
        validStartTime,
      ),
    ).toBeTruthy()
  })

  it('returns true if End and Start Dates are the same but End Time is before Start Time', () => {
    expect(
      isEndDateTimeBeforeStartDateTime(
        validStartDate,
        '9:00',
        validStartDate,
        '8:59',
      ),
    ).toBeTruthy()
  })
})
