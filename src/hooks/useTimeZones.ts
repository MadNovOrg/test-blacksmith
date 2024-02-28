import axios from 'axios'
import { getTimeZonesByCode } from 'country-tz'
import { addMinutes } from 'date-fns'
import { CountryCode as CountryISOCode } from 'libphonenumber-js/types'
import { DateTime } from 'luxon'
import { useCallback } from 'react'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'

export type TimeZoneDataType = {
  rawOffset: number
  timeZoneId: string
}

export default function useTimeZones() {
  const { isUKCountry } = useWorldCountries()

  const getTimeZoneLatLng = useCallback(async (lat: string, lng: string) => {
    const key = import.meta.env.VITE_GMAPS_KEY
    const timestamp = Date.now() / 1000
    const coordinates = [parseFloat(lat), parseFloat(lng)]

    if (coordinates.some(c => isNaN(c))) return null

    try {
      const response = await axios.get<TimeZoneDataType>(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timestamp}&key=${key}`,
        {
          timeout: 5000,
        }
      )

      response.data.rawOffset = response.data.rawOffset / 60 // Convert seconds offset in minutes

      return response.data
    } catch {
      return null
    }
  }, [])

  const getTimeZoneOffset = useCallback((timeZone: string) => {
    return DateTime.now().setZone(timeZone).offset
  }, [])

  const getTimeZonesByCountryCode = useCallback(
    (code: CountryISOCode | string | undefined) => {
      if (!code) return []

      const timeZones = getTimeZonesByCode(isUKCountry(code) ? 'GB' : code)

      if (!timeZones) return []

      return timeZones.map(zone => ({
        rawOffset: getTimeZoneOffset(zone),
        timeZoneId: zone,
      }))
    },
    [getTimeZoneOffset, isUKCountry]
  )

  const setDateTimeTimeZone = useCallback(
    (date: Date, timeZone: TimeZoneDataType) => {
      const currentTimeZoneOffset = date.getTimezoneOffset()

      const timeZoneDate = DateTime.fromISO(
        addMinutes(date, -currentTimeZoneOffset).toISOString(),
        {
          zone: timeZone.timeZoneId,
        }
      )

      return addMinutes(
        timeZoneDate.toJSDate(),
        -timeZoneDate.offset
      ).toISOString()
    },
    []
  )

  const setDateTimeGeoCoordinates = useCallback(
    async (date: Date, lat: string, lng: string) => {
      const timeZone = await getTimeZoneLatLng(lat, lng)

      if (timeZone) {
        return setDateTimeTimeZone(date, timeZone)
      }

      return null
    },
    [getTimeZoneLatLng, setDateTimeTimeZone]
  )

  return {
    getTimeZoneLatLng,
    getTimeZoneOffset,
    getTimeZonesByCountryCode,
    setDateTimeGeoCoordinates,
    setDateTimeTimeZone,
  }
}
