import axios from 'axios'
import { getTimeZonesByCode } from 'country-tz'
import { addMinutes } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { CountryCode as CountryISOCode } from 'libphonenumber-js/types'
import { useCallback } from 'react'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'

export type TimeZoneDataType = {
  rawOffset: number
  timeZoneId: string
}

export type GoogleTimeZoneDataType = TimeZoneDataType & {
  dstOffset: number
}

export default function useTimeZones() {
  const { isUKCountry } = useWorldCountries()

  const getTimeZoneLatLng = useCallback(
    async (lat: string, lng: string, date?: Date) => {
      const key = import.meta.env.VITE_GMAPS_KEY
      const timestamp = (date?.getTime() ?? Date.now()) / 1000
      const coordinates = [parseFloat(lat), parseFloat(lng)]

      if (coordinates.some(c => isNaN(c))) return null

      try {
        const response = await axios.get<GoogleTimeZoneDataType>(
          `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timestamp}&key=${key}`,
          {
            timeout: 5000,
          }
        )

        response.data.rawOffset =
          (response.data.rawOffset + response.data.dstOffset) / 60 // Convert seconds offset in minutes

        return response.data
      } catch {
        return null
      }
    },
    []
  )

  const getTimeZoneOffset = useCallback(
    (timeZone: string, date?: Date | number) => {
      return getTimezoneOffset(timeZone, date ?? Date.now()) / 1000 / 60
    },
    []
  )

  const getTimeZonesByCountryCode = useCallback(
    (code: CountryISOCode | string | undefined, date?: Date | number) => {
      if (!code) return []

      const timeZones = getTimeZonesByCode(isUKCountry(code) ? 'GB' : code)

      if (!timeZones) return []

      return timeZones.map(zone => ({
        rawOffset: getTimeZoneOffset(zone, date),
        timeZoneId: zone,
      }))
    },
    [getTimeZoneOffset, isUKCountry]
  )

  const setDateTimeTimeZone = useCallback(
    (date: Date, timeZone: TimeZoneDataType) => {
      const currentTimeZoneOffset = date.getTimezoneOffset()

      const timeZoneDateTime = addMinutes(
        date,
        -getTimeZoneOffset(timeZone.timeZoneId, date) - currentTimeZoneOffset
      )

      return timeZoneDateTime.toISOString()
    },
    [getTimeZoneOffset]
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
