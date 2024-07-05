import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  Box,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { uniqBy } from 'lodash'
import React, { HTMLAttributes, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'
import { useDebounce } from 'use-debounce'

import {
  FindProfilesQuery,
  FindProfilesQueryVariables,
} from '@app/generated/graphql'
import { Avatar } from '@app/modules/profile/components/Avatar'
import { ProfileAvatar } from '@app/modules/profile/components/ProfileAvatar'
import { FIND_PROFILES } from '@app/modules/profile/queries/find-profiles'
import { RoleName, Profile } from '@app/types'

export type ProfileSelectorProps = {
  value?: FindProfilesQuery['profiles'][0] | undefined | Profile
  onChange: (
    value: FindProfilesQuery['profiles'][0] | undefined | Profile,
  ) => void
  orgId?: string
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  disabled?: boolean
  roleName?: RoleName
  testId?: string
  required?: boolean
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
  required = false,
  ...props
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)

  const [{ data: profiles, fetching: loading }] = useQuery<
    FindProfilesQuery,
    FindProfilesQueryVariables
  >({
    query: FIND_PROFILES,
    variables: {
      where: {
        ...(orgId
          ? { organizations: { organization_id: { _eq: orgId } } }
          : null),
        fullName: { _ilike: `%${debouncedQuery}%` },
        ...(roleName ? { roles: { role: { name: { _eq: roleName } } } } : null),
      },
    },
    pause: !debouncedQuery,
    requestPolicy: 'cache-and-network',
  })

  const noOptionsText =
    query.length < 2
      ? t('components.profile-selector.min-chars')
      : t('components.profile-selector.no-results')

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: FindProfilesQuery['profiles'][0],
    _state: AutocompleteRenderOptionState,
  ) => {
    return (
      <Box
        {...props}
        key={option.id}
        component="li"
        sx={{ display: 'flex', gap: 2 }}
      >
        <ProfileAvatar profile={option} disableLink={true} />
      </Box>
    )
  }

  const renderStartAdornment = () => {
    if (open) {
      return <SearchIcon sx={{ color: 'grey.500' }} />
    }

    if (selected) {
      return (
        <Avatar
          size={32}
          src={selected.avatar ?? ''}
          name={selected.fullName ?? ''}
        />
      )
    }
  }

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false)
      }}
      data-testid={testId ?? 'profile-selector'}
      disabled={disabled}
      sx={sx}
      value={selected as FindProfilesQuery['profiles'][0]}
      openOnFocus
      clearOnBlur={false}
      onChange={(_, newValue) => {
        if (value) {
          setSelected(newValue ?? undefined)
        }

        onChange(newValue ?? undefined)
      }}
      onInputChange={(_: unknown, value: string, __: unknown) => {
        value.length < 1 ? setOpen(false) : null
      }}
      options={loading ? [] : uniqBy(profiles?.profiles, 'id') ?? []}
      getOptionLabel={option => option.fullName ?? ''}
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
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            ...params.InputProps,
            required,
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
