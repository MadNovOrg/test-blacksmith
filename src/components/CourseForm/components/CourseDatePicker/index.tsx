import { TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import { noop } from 'ts-essentials'

import { DATE_MASK, INPUT_DATE_FORMAT } from '@app/util'

export type CourseDatePickerProps = {
  value: Date | null
  minDate?: Date
  maxDate?: Date
  error?: {
    message?: string
  }
  label?: string
  onBlur?: () => void
  onChange: (value: Date | null) => void
}

export const CourseDatePicker = ({
  value,
  minDate,
  maxDate,
  error,
  label,
  onBlur,
  onChange = noop,
}: CourseDatePickerProps) => {
  return (
    <DatePicker
      label={label}
      mask={DATE_MASK}
      inputFormat={INPUT_DATE_FORMAT}
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      renderInput={params => (
        <TextField
          data-test={`${label}-datePicker-textField`}
          variant="filled"
          {...params}
          fullWidth
          error={Boolean(error)}
          helperText={error?.message}
          onBlur={onBlur}
        />
      )}
    />
  )
}
