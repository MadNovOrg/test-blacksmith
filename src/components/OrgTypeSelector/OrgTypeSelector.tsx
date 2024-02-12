import { MenuItem, TextField } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import {
  GetOrgTypesQuery,
  GetOrgTypesQueryVariables,
  Organisation_Sector_Enum,
  Organization_Type,
} from '@app/generated/graphql'
import { GET_ORG_TYPES } from '@app/queries/organization/get-org-types'

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
  const sectorMap = new Map()
  switch (sector) {
    case 'edu':
      sectorMap.set(sector, Organisation_Sector_Enum.Edu)
      break
    case 'hsc_child':
      sectorMap.set(sector, Organisation_Sector_Enum.HscChildren)
      break
    case 'hsc_adult':
      sectorMap.set(sector, Organisation_Sector_Enum.HscAdult)
      break
    default:
      'other'
  }

  const [{ data }] = useQuery<GetOrgTypesQuery, GetOrgTypesQueryVariables>({
    query: GET_ORG_TYPES,
    variables: {
      sector: sectorMap.get(sector),
    },
    pause: !sector,
  })
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
