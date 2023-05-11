import {
  Autocomplete,
  Box,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { debounce } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  GetOrgMembersQuery,
  GetOrgMembersQueryVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { GET_ORG_MEMBERS } from '@app/queries/organization/get-members'
import { NonNullish } from '@app/types'

export type Member = Pick<
  NonNullish<GetOrgMembersQuery['members'][0]>,
  'profile'
>

export type Profile = NonNullish<Member['profile']>

export type UserSelectorProps = {
  onChange: (profile: Profile) => void
  organisationId: string
  disabled?: boolean
  error?: string
  textFieldProps?: TextFieldProps
  sx?: SxProps
}

export const UserSelector: React.FC<
  React.PropsWithChildren<UserSelectorProps>
> = function ({
  onChange,
  sx,
  error,
  organisationId,
  textFieldProps,
  disabled = false,
  ...props
}) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  const refreshOptions = useCallback(
    async (query: string) => {
      const { members } = await fetcher<
        GetOrgMembersQuery,
        GetOrgMembersQueryVariables
      >(GET_ORG_MEMBERS, { id: organisationId, email: `%${query}%` })
      setLoading(false)

      console.log('members', members)
      setOptions(members)
    },
    [fetcher, organisationId]
  )

  const debouncedQuery = useMemo(() => {
    return debounce(async query => refreshOptions(query), 1000)
  }, [refreshOptions])

  const onInputChange = useCallback(
    async (event: React.SyntheticEvent, value: string, reason: string) => {
      setQ(value)
      setOptions([])
      if (reason === 'input' && value && value.length > 2 && organisationId) {
        setLoading(true)
        debouncedQuery(value)
      }
    },
    [debouncedQuery, organisationId]
  )

  const getOptionLabel = (option: Member) => option.profile.email ?? ''

  const handleChange = (event: React.SyntheticEvent, option: Member | null) => {
    event.preventDefault()

    if (option?.profile) {
      onChange(option?.profile)
    }
  }

  const noOptionsText =
    q.length < 3 ? (
      t('components.user-selector.min-chars')
    ) : (
      <Typography variant="body2">
        {loading ? t('loading') : t('components.user-selector.no-results')}
      </Typography>
    )

  function renderProfile(option: Member) {
    return [option.profile.email, option.profile.fullName]
      .filter(Boolean)
      .join(', ')
  }

  return (
    <>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        data-testid="user-selector"
        sx={sx}
        openOnFocus
        clearOnBlur={false}
        getOptionLabel={getOptionLabel}
        onInputChange={onInputChange}
        onChange={handleChange}
        options={options}
        noOptionsText={noOptionsText}
        isOptionEqualToValue={(o, v) => {
          return o.profile.id === v.profile.id
        }}
        loading={loading}
        disabled={disabled}
        renderInput={params => (
          <TextField
            {...textFieldProps}
            {...params}
            placeholder={t('components.user-selector.placeholder')}
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
            error={!!error}
            helperText={error || ''}
          />
        )}
        renderOption={(props, option) => {
          const profile = renderProfile(option)

          return (
            <Box
              display="flex"
              justifyContent="space-between"
              px={2}
              component="li"
              {...props}
              key={option.profile.id}
              data-testid={`profile-selector-result-${option.profile.id}`}
            >
              <Typography
                flex={1}
                pr={2}
                component="span"
                display="flex"
                alignItems="center"
              >
                <Typography variant="body2" color="grey.700" ml={1}>
                  {profile}
                </Typography>
              </Typography>
            </Box>
          )
        }}
        {...props}
      />
    </>
  )
}
