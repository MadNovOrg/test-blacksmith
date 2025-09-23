import { DatePicker } from '@mui/x-date-pickers'
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
  required?: boolean
  name?: string
}

export const CourseDatePicker = ({
  value,
  minDate,
  maxDate,
  error,
  label,
  onBlur,
  onChange = noop,
  required = false,
  name,
}: CourseDatePickerProps) => {
  return (
    <DatePicker
      name={name}
      label={label}
      format={INPUT_DATE_FORMAT}
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          variant: 'filled',
          fullWidth: true,
          error: Boolean(error),
          helperText: error?.message,
          onBlur: onBlur,
          // @ts-expect-error no arbitrary props are allowed by types, which is wrong
          'data-testid': `${label}-datePicker-textField`,
          required,
          name,
        },
      }}
    />
  )
}
