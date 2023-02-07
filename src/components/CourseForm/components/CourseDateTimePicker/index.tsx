import { Grid, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React, { useState, useEffect } from 'react'
import { noop } from 'ts-essentials'

import { DATE_MASK, INPUT_DATE_FORMAT } from '@app/util'

import { makeDate } from '../../helpers'
import { CourseTimePicker } from '../CourseTimePicker'

export type CourseDateTimePickerProps = {
  dateValue: Date | null
  timeValue: string
  minDate?: Date
  maxDate?: Date
  error?: {
    message?: string
  }
  dateLabel?: string
  timeLabel: string
  timeId: 'start' | 'end'
  onBlur?: () => void
  onChange: (value: Date | null) => void
}

export const CourseDateTimePicker = ({
  dateValue,
  timeValue,
  minDate,
  maxDate,
  error,
  dateLabel,
  timeLabel = '',
  timeId,
  onBlur,
  onChange = noop,
}: CourseDateTimePickerProps) => {
  const [date, setDate] = useState<Date | null>(dateValue)
  const [time, setTime] = useState<string>(timeValue)

  useEffect(() => {
    if (dateValue) {
      setDate(new Date(dateValue))
    }
  }, [dateValue])

  const handleDateChange = (newDate: Date | null) => {
    let newDateAndTime = newDate

    if (newDate && time) {
      newDateAndTime = makeDate(newDate, time)
    }

    setDate(newDateAndTime)
    onChange(newDateAndTime)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTimeChange = (newTime: any) => {
    setTime(newTime)

    if (date) {
      const newDateAndTime = makeDate(date, newTime)
      console.log('handleTimeChange, newDateAndTime', newDateAndTime)

      setDate(newDateAndTime)
      onChange(newDateAndTime)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DatePicker
          label={dateLabel}
          mask={DATE_MASK}
          inputFormat={INPUT_DATE_FORMAT}
          value={dateValue}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          renderInput={params => (
            <TextField
              variant="filled"
              {...params}
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <CourseTimePicker
          id={timeId}
          label={timeLabel}
          value={time}
          onChange={handleTimeChange}
        />
      </Grid>
    </Grid>
  )
}
