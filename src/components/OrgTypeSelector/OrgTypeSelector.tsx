import { MenuItem, TextField } from '@mui/material'
import { FC, PropsWithChildren, useMemo } from 'react'
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
  international?: boolean
}

export const OrgTypeSelector: FC<PropsWithChildren<Props>> = ({
  error,
  sector,
  disabled = false,
  required,
  label,
  value,
  register,
  international = false,
}) => {
  const { t } = useTranslation()

  const { data } = useOrgType(sector, international)

  const orgTypes = useMemo(() => {
    const orgTypesOptions = [...(data?.organization_type ?? [])]

    const otherOption = orgTypesOptions.findIndex(
      option => option.name === 'Other',
    )

    if (otherOption && otherOption !== -1) {
      const item = orgTypesOptions.splice(otherOption, 1)[0]
      orgTypesOptions.push(item)
    }

    return orgTypesOptions
  }, [data?.organization_type])

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
      {orgTypes ? (
        orgTypes.map(m => (
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
