import { TextField } from '@mui/material'
import React from 'react'

interface Props {
  id: 'start' | 'end'
  label: string
  value: string
  onChange: React.Dispatch<string>
  error?: {
    message?: string
  }
}

export const CourseTimePicker: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  label,
  value,
  onChange,
  error,
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type="time"
      inputProps={{
        step: 300, // 5 min
      }}
      InputLabelProps={{ shrink: true }}
      fullWidth
      error={Boolean(error)}
      helperText={error?.message}
      data-testid={`${id}-time`}
      variant="filled"
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
    />
  )
}
