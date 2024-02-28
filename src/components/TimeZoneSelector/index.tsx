import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { addMinutes, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useTimeZones, { TimeZoneDataType } from '@app/hooks/useTimeZones'
import { Venue } from '@app/types'

export const convertTimeZoneOffset = (seconds: number) => {
  const baseDate = new Date(0, 0, 0, 0, 0)
  const resultDate = addMinutes(baseDate, Math.abs(seconds))

  return `(GMT${seconds < 0 ? '-' : '+'}${format(resultDate, 'HH:mm')})`
}

export type TimeZoneSelectorSelectorProps = {
  code?: string
  editCourse?: boolean
  ignoreVenue?: boolean
  initialValue?: boolean
  onChange: (selected: TimeZoneDataType | null) => void
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
  value,
  venue,
}: TimeZoneSelectorSelectorProps) => {
  const { t } = useTranslation()
  const { getTimeZonesByCountryCode, getTimeZoneLatLng, getTimeZoneOffset } =
    useTimeZones()
  const [timeZoneOptions, setTimeZoneOptions] = useState<TimeZoneDataType[]>([])
  const [initialValueOnEdit, setInitialValueOnEdit] = useState<boolean>(false)

  useEffect(() => {
    const getTimeZoneByLatLong = async () => {
      if (editCourse && value?.timeZoneId && !initialValueOnEdit) {
        if (ignoreVenue) {
          const timeZones = getTimeZonesByCountryCode(code)

          setTimeZoneOptions(timeZones)
        } else {
          setTimeZoneOptions([
            {
              timeZoneId: value.timeZoneId,
              rawOffset: getTimeZoneOffset(value.timeZoneId),
            },
          ])
        }

        setInitialValueOnEdit(true)
        return
      } else {
        if (!ignoreVenue && venue?.geoCoordinates) {
          const coordinates = venue.geoCoordinates
            ?.replace(/[()]/g, '')
            .split(',')

          if (
            Array.isArray(coordinates) &&
            coordinates.every(element => typeof element === 'string')
          ) {
            const timeZone = await getTimeZoneLatLng(
              coordinates[0],
              coordinates[1]
            )

            if (timeZone) {
              setTimeZoneOptions([timeZone])

              onChange(timeZone)

              return
            }
          }
        }

        if (code) {
          const timeZones = getTimeZonesByCountryCode(code)

          setTimeZoneOptions(timeZones)

          if (
            !(
              value?.timeZoneId &&
              timeZones.some(zone => zone.timeZoneId === value.timeZoneId)
            )
          ) {
            onChange(timeZones.length === 1 ? timeZones[0] : null)
          }

          return
        }

        setTimeZoneOptions([])
      }
    }

    getTimeZoneByLatLong().then()
  }, [
    code,
    editCourse,
    getTimeZoneLatLng,
    getTimeZoneOffset,
    getTimeZonesByCountryCode,
    ignoreVenue,
    initialValueOnEdit,
    onChange,
    value?.timeZoneId,
    venue?.geoCoordinates,
  ])

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
