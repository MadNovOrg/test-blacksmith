import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  Box,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { debounce } from 'lodash-es'
import React, { HTMLAttributes, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/profile/find-profiles'
import { Profile, RoleName } from '@app/types'

export type ProfileSelectorProps = {
  value?: Profile
  onChange: (value: Profile | undefined) => void
  orgId?: string
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  disabled?: boolean
  roleName?: RoleName
  testId?: string
}

export const ProfileSelector: React.FC<
  React.PropsWithChildren<ProfileSelectorProps>
> = function ({
  value,
  onChange,
  orgId,
  sx,
  textFieldProps,
  placeholder,
  disabled,
  roleName,
  testId,
  ...props
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)
  const [options, setOptions] = useState<Profile[]>(value ? [value] : [])
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
            ...(roleName
              ? { roles: { role: { name: { _eq: roleName } } } }
              : null),
          },
        })

        setLoading(false)

        if (results.profiles) {
          setOptions(results.profiles)
        }
      }, 1000),
    [fetcher, orgId, roleName]
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

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: Profile,
    _state: AutocompleteRenderOptionState
  ) => {
    return (
      <Box {...props} component="li" sx={{ display: 'flex', gap: 2 }}>
        <Avatar size={32} src={option.avatar} name={option.fullName} />
        <Typography variant="body1" sx={{ flex: 1 }}>
          {option.fullName}
        </Typography>
      </Box>
    )
  }

  const renderStartAdornment = () => {
    if (open) {
      return <SearchIcon sx={{ color: 'grey.500' }} />
    }

    if (selected) {
      return <Avatar size={32} src={selected.avatar} name={selected.fullName} />
    }
  }

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false)
        setLoading(false)
        debouncedQuery.cancel()
      }}
      data-testid={testId ?? 'profile-selector'}
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
            startAdornment: renderStartAdornment(),
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
      renderOption={renderOption}
      {...props}
    />
  )
}
