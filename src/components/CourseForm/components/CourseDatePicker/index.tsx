import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import { noop } from 'ts-essentials'

import { INPUT_DATE_FORMAT } from '@app/util'

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
      format={INPUT_DATE_FORMAT}
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          // @ts-expect-error no arbitrary props are allowed by types, which is wrong
          variant: 'filled',
          fullWidth: true,
          error: Boolean(error),
          helperText: error?.message,
          onBlur: onBlur,
          'data-testid': `${label}-datePicker-textField`,
        },
      }}
    />
  )
}
