import { formatDateRange } from './util'

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
