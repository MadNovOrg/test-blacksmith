import { waitFor } from '@testing-library/react'
import { noop } from 'ts-essentials'

import TimeZoneSelector, {
  convertTimeZoneOffset,
} from '@app/components/TimeZoneSelector/index'
import useTimeZones from '@app/hooks/useTimeZones'
import { Venue } from '@app/types'

import { chance, render, screen } from '@test/index'

vi.mock('@app/hooks/useTimeZones')

const useTimeZonesMocked = vi.mocked(useTimeZones)

describe(`${TimeZoneSelector.name}`, () => {
  test('convertTimeZoneOffset function', () => {
    expect(convertTimeZoneOffset(-60)).toBe('(GMT-01:00)')
    expect(convertTimeZoneOffset(0)).toBe('(GMT+00:00)')
    expect(convertTimeZoneOffset(60)).toBe('(GMT+01:00)')
  })

  it('disable the time zone selector in case of one time zone country selected', async () => {
    useTimeZonesMocked.mockReturnValue({
      getTimeZoneLatLng: vi.fn(),
      getTimeZoneOffset: vi.fn(),
      getTimeZonesByCountryCode: vi
        .fn()
        .mockReturnValue([{ timeZoneId: 'Europe/London', rawOffset: 0 }]),
      setDateTimeGeoCoordinates: vi.fn(),
      setDateTimeTimeZone: vi.fn(),
      formatGMTDateTimeByTimeZone: vi.fn(),
    })

    render(
      <TimeZoneSelector
        date={new Date(Date.now())}
        onChange={noop}
        value={{ timeZoneId: 'Europe/London', rawOffset: 0 }}
        code={'GB'}
      />
    )

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('(GMT+00:00) Europe/London')
      ).toBeDisabled()
    })
  })

  it('enable the time zone selector in case of multiple time zone country selected', async () => {
    useTimeZonesMocked.mockReturnValue({
      getTimeZoneLatLng: vi.fn(),
      getTimeZoneOffset: vi.fn(),
      getTimeZonesByCountryCode: vi.fn().mockReturnValue([
        { timeZoneId: 'America/New_York', rawOffset: -300 },
        { timeZoneId: 'America/Los_Angeles', rawOffset: -480 },
      ]),
      setDateTimeGeoCoordinates: vi.fn(),
      setDateTimeTimeZone: vi.fn(),
      formatGMTDateTimeByTimeZone: vi.fn(),
    })

    render(
      <TimeZoneSelector
        date={new Date(Date.now())}
        onChange={noop}
        value={null}
        code={'US'}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    })
  })

  it('disable the time zone selector in case of multiple time zone country selected but with venue', async () => {
    useTimeZonesMocked.mockReturnValue({
      getTimeZoneLatLng: vi
        .fn()
        .mockReturnValue({ timeZoneId: 'America/New_York', rawOffset: -300 }),
      getTimeZoneOffset: vi.fn(),
      getTimeZonesByCountryCode: vi.fn(),
      setDateTimeGeoCoordinates: vi.fn(),
      setDateTimeTimeZone: vi.fn(),
      formatGMTDateTimeByTimeZone: vi.fn(),
    })

    const testVenue: Venue = {
      addressLineOne: chance.string(),
      city: chance.city(),
      geoCoordinates: '(0,0)',
      id: chance.guid(),
      name: chance.name(),
      postCode: chance.postcode(),
    }

    render(
      <TimeZoneSelector
        date={new Date(Date.now())}
        onChange={noop}
        value={{ timeZoneId: 'America/New_York', rawOffset: -300 }}
        venue={testVenue}
        code={'US'}
      />
    )

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('(GMT-05:00) America/New_York')
      ).toBeDisabled()
    })
  })

  it('enable the time zone selector in case of multiple time zone country selected with venue but with ignoreVenue true', async () => {
    useTimeZonesMocked.mockReturnValue({
      getTimeZoneLatLng: vi
        .fn()
        .mockReturnValue({ timeZoneId: 'America/New_York', rawOffset: -300 }),
      getTimeZoneOffset: vi.fn(),
      getTimeZonesByCountryCode: vi.fn().mockReturnValue([
        { timeZoneId: 'America/New_York', rawOffset: -300 },
        { timeZoneId: 'America/Los_Angeles', rawOffset: -480 },
      ]),
      setDateTimeGeoCoordinates: vi.fn(),
      setDateTimeTimeZone: vi.fn(),
      formatGMTDateTimeByTimeZone: vi.fn(),
    })

    const testVenue: Venue = {
      addressLineOne: chance.string(),
      city: chance.city(),
      geoCoordinates: '(0,0)',
      id: chance.guid(),
      name: chance.name(),
      postCode: chance.postcode(),
    }

    render(
      <TimeZoneSelector
        date={new Date(Date.now())}
        onChange={noop}
        value={{ timeZoneId: 'America/New_York', rawOffset: -300 }}
        venue={testVenue}
        code={'US'}
        ignoreVenue={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    })
  })
})
