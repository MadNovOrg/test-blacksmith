import { MenuItem, TextField } from '@mui/material'
import { ChangeEvent, FC, PropsWithChildren } from 'react'
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
  onChange: (orgType: Pick<Organization_Type, 'name'> | '') => void
  label?: string
  error?: string | undefined
  required?: boolean
  disabled?: boolean
  value?: Pick<Organization_Type, 'name'> | ''
}

export const OrgTypeSelector: FC<PropsWithChildren<Props>> = ({
  onChange,
  error,
  sector,
  disabled = false,
  required,
  label,
  value,
}) => {
  const { t } = useTranslation()
  const sectorMap = new Map()
  if (sector === 'edu') {
    sectorMap.set(sector, Organisation_Sector_Enum.Edu)
  } else sectorMap.set(sector, Organisation_Sector_Enum.HscAdultAndChildren)

  const [{ data }] = useQuery<GetOrgTypesQuery, GetOrgTypesQueryVariables>({
    query: GET_ORG_TYPES,
    variables: {
      sector: sectorMap.get(sector),
    },
    pause: !sector,
  })
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as Pick<Organization_Type, 'name'> | '')
  }
  return (
    <TextField
      select
      variant="filled"
      fullWidth
      label={label ?? t('org-type')}
      error={!!error}
      sx={{ bgcolor: 'grey.100' }}
      onChange={handleChange}
      disabled={disabled}
      required={required}
      helperText={error}
      value={value}
    >
      {data?.organization_type.length ? (
        data?.organization_type.map(m => (
          <MenuItem key={m.id} value={m.name} data-testid={`type-${m.name}`}>
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
