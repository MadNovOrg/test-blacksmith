import {
  Autocomplete,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { debounce } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/profile/find-profiles'
import { Profile } from '@app/types'

export type ProfileSelectorProps = {
  value?: Profile
  onChange: (value: Profile | undefined) => void
  orgId?: string
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  disabled?: boolean
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = function ({
  value,
  onChange,
  orgId,
  sx,
  textFieldProps,
  placeholder,
  disabled,
  ...props
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)
  const [options, setOptions] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const fetcher = useFetcher()

  const debouncedQuery = useMemo(
    () =>
      debounce(async query => {
        const results = await fetcher<ResponseType, ParamsType>(QUERY, {
          where: {
            ...(orgId
              ? { organizations: { organization_id: { _eq: orgId } } }
              : null),
            fullName: { _ilike: `${query}` },
          },
        })

        setLoading(false)

        if (results.profiles) {
          setOptions(results.profiles)
        }
      }),
    [fetcher, orgId]
  )

  const handleInputChange = (_: unknown, value: string, reason: string) => {
    if (reason === 'input' && value && value.length >= 2) {
      setLoading(true)
      setOptions([])

      debouncedQuery(`%${value}%`)
    }

    setQuery(value)
  }

  const noOptionsText =
    query.length < 2
      ? t('components.profile-selector.min-chars')
      : t('components.profile-selector.no-results')

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false)
        setLoading(false)
        debouncedQuery.cancel()
      }}
      data-testid="profile-selector"
      disabled={disabled}
      sx={sx}
      value={selected}
      openOnFocus
      clearOnBlur={false}
      onInputChange={handleInputChange}
      onChange={(_, newValue) => {
        if (value) {
          setSelected(newValue ?? undefined)
        }

        onChange(newValue ?? undefined)
      }}
      options={options}
      getOptionLabel={option => option.fullName}
      noOptionsText={noOptionsText}
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
