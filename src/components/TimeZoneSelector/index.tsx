import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { addMinutes, format } from 'date-fns'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const getTimeZoneByLatLong = async () => {
      if (editCourse && value?.timeZoneId && !initialValueOnEdit) {
        if (ignoreVenue) {
          const timeZones = getTimeZonesByCountryCode(code, date)

          setTimeZoneOptions(timeZones)
        } else {
          setTimeZoneOptions([
            {
              timeZoneId: value.timeZoneId,
              rawOffset: getTimeZoneOffset(value.timeZoneId, date),
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
              coordinates[1],
              date,
            )

            if (timeZone) {
              setTimeZoneOptions([timeZone])

              onChange(timeZone)

              return
            }
          }
        }

        if (code) {
          const timeZones = getTimeZonesByCountryCode(code, date)

          setTimeZoneOptions(timeZones)

          const currentTimeZoneInOptions = timeZones.find(
            zone => zone.timeZoneId === value?.timeZoneId,
          )

          // The same time zone can have different GMT because of Day Save Time
          const isSameTimeZoneWithDifferentGMT =
            currentTimeZoneInOptions &&
            value?.rawOffset &&
            convertTimeZoneOffset(value.rawOffset) !=
              convertTimeZoneOffset(currentTimeZoneInOptions.rawOffset)

          if (!(value?.timeZoneId && Boolean(currentTimeZoneInOptions))) {
            onChange(timeZones.length === 1 ? timeZones[0] : null)
          } else if (isSameTimeZoneWithDifferentGMT) {
            onChange(currentTimeZoneInOptions)
          }

          return
        }

        setTimeZoneOptions([])
      }
    }

    getTimeZoneByLatLong().then()
  }, [
    code,
    date,
    editCourse,
    getTimeZoneLatLng,
    getTimeZoneOffset,
    getTimeZonesByCountryCode,
    ignoreVenue,
    initialValueOnEdit,
    onChange,
    value?.rawOffset,
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
