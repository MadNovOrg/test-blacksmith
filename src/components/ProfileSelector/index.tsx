import React, { useState } from 'react'
import {
  Autocomplete,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Profile } from '@app/types'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/profile/find-profiles'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type ProfileSelectorProps = {
  value?: Profile
  onChange: (value: Profile | undefined) => void
  orgId?: string
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
}

const ProfileSelector: React.FC<ProfileSelectorProps> = function ({
  value,
  onChange,
  orgId,
  sx,
  textFieldProps,
  placeholder,
  ...props
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)

  const where = orgId
    ? { organizations: { organization_id: { _eq: orgId } } }
    : undefined
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    { where },
  ])
  const loading = getSWRLoadingStatus(data, error) === LoadingStatus.FETCHING

  const options: Profile[] = data?.profiles ?? []

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
      getOptionLabel={option => option.fullName}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      loading={loading}
      disableClearable={true}
      renderInput={params => (
        <TextField
          {...textFieldProps}
          {...params}
          placeholder={
            placeholder ?? t('components.profile-selector.placeholder')
          }
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

export default ProfileSelector
