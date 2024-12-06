import { TextField, MenuItem } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

export type Props = {
  register: UseFormRegisterReturn
  value?: string
  error?: string
  label?: string
  required?: boolean
}
export const sectors = {
  edu: 'Education',
  hsc_child: 'Health & Social Care Children',
  hsc_adult: 'Health & Social Care Adults',
  other: 'Other',
} as const
export const OrganisationSectorDropdown: FC<PropsWithChildren<Props>> = ({
  register,
  value,
  error,
  label,
  required = false,
}) => {
  return (
    <TextField
      select
      value={value}
      {...register}
      variant="filled"
      fullWidth
      label={label ?? ''}
      error={Boolean(error)}
      sx={{ bgcolor: 'grey.100' }}
      data-testid="sector-select"
      helperText={error}
      inputProps={{
        required,
      }}
    >
      <MenuItem value="" disabled>
        {label}
      </MenuItem>
      {Object.entries(sectors).map(([value, label]) => (
        <MenuItem key={value} value={value} data-testid={`sector-${value}`}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  )
}
