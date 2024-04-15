import { MenuItem, TextField } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Organization_Type } from '@app/generated/graphql'
import { useOrgType } from '@app/hooks/useOrgType'

type Props = {
  sector: string
  label?: string
  error?: string | undefined
  required?: boolean
  disabled?: boolean
  value?: Pick<Organization_Type, 'name'> | string
  register?: UseFormRegisterReturn
}

export const OrgTypeSelector: FC<PropsWithChildren<Props>> = ({
  error,
  sector,
  disabled = false,
  required,
  label,
  value,
  register,
}) => {
  const { t } = useTranslation()

  const { data } = useOrgType(sector)

  return (
    <TextField
      select
      variant="filled"
      fullWidth
      label={label ?? t('org-type')}
      error={!!error}
      sx={{ bgcolor: 'grey.100' }}
      disabled={disabled}
      required={required}
      helperText={error}
      value={value}
      defaultValue={value}
      {...register}
      data-testid="org-type-selector"
    >
      {data?.organization_type.length ? (
        data?.organization_type.map(m => (
          <MenuItem
            key={m.id}
            value={m.name ?? value}
            data-testid={`type-${m.name}`}
          >
            {m.name}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          {t('fields.organization-sector')}
        </MenuItem>
      )}
    </TextField>
  )
}
