import {
  Autocomplete,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import {
  QUERY,
  ResponseType,
} from '@app/queries/organization/get-organizations'
import { Organization } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type OrgSelectorProps = {
  value?: Organization
  onChange: (value: Organization | undefined) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
}

const OrgSelector: React.FC<OrgSelectorProps> = function ({
  value,
  onChange,
  sx,
  textFieldProps,
  placeholder,
  ...props
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)

  const { data, error } = useSWR<ResponseType, Error>(QUERY)
  const loading = getSWRLoadingStatus(data, error) === LoadingStatus.FETCHING

  const options: Organization[] = data?.orgs ?? []

  return (
    <Autocomplete
      sx={sx}
      value={selected}
      onChange={(_, newValue) => {
        if (value) {
          setSelected(newValue ?? undefined)
        }
        onChange(newValue ?? undefined)
      }}
      options={options}
      getOptionLabel={option => option.name}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      loading={loading}
      disableClearable={true}
      renderInput={params => (
        <TextField
          {...textFieldProps}
          {...params}
          placeholder={placeholder ?? t('components.org-selector.placeholder')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      {...props}
    />
  )
}

export default OrgSelector
