import { TextField } from '@mui/material'
import React from 'react'

interface Props {
  error?: boolean
  id: 'start' | 'end'
  label: string
  onChange: React.Dispatch<React.SetStateAction<Date | string>>
  value: Date | string
}

export const CourseTimePicker: React.FC<Props> = ({
  error,
  id,
  label,
  onChange,
  value,
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type="time"
      inputProps={{
        step: 300, // 5 min
      }}
      fullWidth
      error={error}
      data-testid={`${id}-time`}
      variant="filled"
      value={value === '' ? '08:00' : value}
      onChange={({ target: { value } }) => onChange(value)}
    />
  )
}
