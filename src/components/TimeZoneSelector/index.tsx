import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { addMinutes, format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useTimeZones, { TimeZoneDataType } from '@app/hooks/useTimeZones'
import { Venue } from '@app/types'

export const convertTimeZoneOffset = (minutes: number) => {
  const baseDate = new Date(0, 0, 0, 0, 0)
  const resultDate = addMinutes(baseDate, Math.abs(minutes))

  return `(GMT${minutes < 0 ? '-' : '+'}${format(resultDate, 'HH:mm')})`
}

export type TimeZoneSelectorSelectorProps = {
  code?: string
  editCourse?: boolean
  ignoreVenue?: boolean
  initialValue?: boolean
  onChange: (selected: TimeZoneDataType | null) => void
  date: Date
  value: TimeZoneDataType | null
  venue?: Venue | null
} & BaseTextFieldProps

const TimeZoneSelector = ({
  code,
  editCourse,
  error,
  helperText,
  ignoreVenue,
  label,
  onChange,
  required,
  date,
  value,
  venue,
}: TimeZoneSelectorSelectorProps) => {
  const { t } = useTranslation()
  const { getTimeZonesByCountryCode, getTimeZoneLatLng, getTimeZoneOffset } =
    useTimeZones()
  const [timeZoneOptions, setTimeZoneOptions] = useState<TimeZoneDataType[]>([])
  const [initialValueOnEdit, setInitialValueOnEdit] = useState<boolean>(false)

  const shouldInitializeValue = useCallback((): boolean => {
    return Boolean(editCourse && value?.timeZoneId && !initialValueOnEdit)
  }, [editCourse, initialValueOnEdit, value?.timeZoneId])

  const shouldFetchTimeZoneByCoordinates = useCallback((): boolean => {
    return Boolean(!ignoreVenue && venue?.geoCoordinates)
  }, [ignoreVenue, venue?.geoCoordinates])

  const handleInitialValue = useCallback(() => {
    if (ignoreVenue) {
      const timeZones = getTimeZonesByCountryCode(code, date)
      setTimeZoneOptions(timeZones)
    } else {
      setTimeZoneOptions([
        {
          timeZoneId: value?.timeZoneId as string,
          rawOffset: getTimeZoneOffset(value?.timeZoneId as string, date),
        },
      ])
    }
    setInitialValueOnEdit(true)
  }, [
    code,
    date,
    getTimeZoneOffset,
    getTimeZonesByCountryCode,
    ignoreVenue,
    value?.timeZoneId,
  ])

  const fetchTimeZoneByCoordinates = useCallback(async () => {
    const coordinates = venue?.geoCoordinates?.replace(/[()]/g, '').split(',')

    if (
      Array.isArray(coordinates) &&
      coordinates.every(element => typeof element === 'string')
    ) {
      const timeZone = await getTimeZoneLatLng(
        coordinates[0],
        coordinates[1],
        date,
      )

      if (timeZone) {
        setTimeZoneOptions([timeZone])
        onChange(timeZone)

        return timeZone
      }
    }

    return null
  }, [date, getTimeZoneLatLng, onChange, venue?.geoCoordinates])

  const findCurrentTimeZoneInOptions = useCallback(
    (timeZones: TimeZoneDataType[]) => {
      return timeZones.find(zone => zone.timeZoneId === value?.timeZoneId)
    },
    [value?.timeZoneId],
  )

  const checkSameTimeZoneWithDifferentGMT = useCallback(
    (currentTimeZoneInOptions: TimeZoneDataType | undefined) => {
      return (
        currentTimeZoneInOptions &&
        value?.rawOffset &&
        convertTimeZoneOffset(value.rawOffset) !=
          convertTimeZoneOffset(currentTimeZoneInOptions.rawOffset)
      )
    },
    [value?.rawOffset],
  )

  const handleCountryCodeTimeZones = useCallback(() => {
    const timeZones = getTimeZonesByCountryCode(code, date)
    setTimeZoneOptions(timeZones)

    const currentTimeZoneInOptions = findCurrentTimeZoneInOptions(timeZones)
    const isSameTimeZoneWithDifferentGMT = checkSameTimeZoneWithDifferentGMT(
      currentTimeZoneInOptions,
    )

    if (!currentTimeZoneInOptions) {
      onChange(timeZones.length === 1 ? timeZones[0] : null)
    } else if (isSameTimeZoneWithDifferentGMT) {
      onChange(currentTimeZoneInOptions)
    }
  }, [
    checkSameTimeZoneWithDifferentGMT,
    code,
    date,
    findCurrentTimeZoneInOptions,
    getTimeZonesByCountryCode,
    onChange,
  ])

  const getTimeZoneByLatLong = useCallback(async () => {
    if (shouldInitializeValue()) {
      handleInitialValue()
      return
    }

    if (shouldFetchTimeZoneByCoordinates()) {
      const tz = await fetchTimeZoneByCoordinates()
      if (tz) return
    }

    if (code) {
      handleCountryCodeTimeZones()
      return
    }

    setTimeZoneOptions([])
  }, [
    code,
    fetchTimeZoneByCoordinates,
    handleCountryCodeTimeZones,
    handleInitialValue,
    shouldFetchTimeZoneByCoordinates,
    shouldInitializeValue,
  ])

  useEffect(() => {
    getTimeZoneByLatLong().then()
  }, [getTimeZoneByLatLong])

  return (
    <Autocomplete
      disabled={timeZoneOptions.length === 1}
      value={value}
      id="timezone-select-demo"
      data-testid="timezone-selector-autocomplete"
      options={timeZoneOptions}
      autoHighlight
      getOptionLabel={zone =>
        `${convertTimeZoneOffset(zone.rawOffset)} ${zone.timeZoneId}`
      }
      renderOption={(props, zone) => (
        <Box
          data-testid={zone}
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {`${convertTimeZoneOffset(zone.rawOffset)} ${zone.timeZoneId}`}
        </Box>
      )}
      isOptionEqualToValue={(option, value) =>
        option.timeZoneId === value.timeZoneId
      }
      renderInput={params => (
        <TextField
          {...params}
          disabled={timeZoneOptions.length === 1}
          data-testid={`timezone-selector-input`}
          error={error}
          helperText={helperText}
          label={label ?? t('timeZone')}
          required={required}
          inputProps={{
            ...params.inputProps,
          }}
          variant="filled"
        />
      )}
      onChange={(_, timeZone) => {
        onChange(timeZone)
      }}
    />
  )
}

export default TimeZoneSelector
