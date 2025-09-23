import {
  Autocomplete,
  Box,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import React, { FocusEventHandler, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMount } from 'react-use'
import { useQuery } from 'urql'
import { useDebounce } from 'use-debounce'

import { GET_ORG_MEMBERS } from '@app/components/UserSelector/queries/get-members'
import {
  GetOrgMembersQuery,
  GetOrgMembersQueryVariables,
} from '@app/generated/graphql'
import { NonNullish } from '@app/types'

export type Member = Pick<
  NonNullish<GetOrgMembersQuery['members'][0]>,
  'profile'
>

export type Profile = Member['profile'] | null

export type UserSelectorProps = {
  onChange: (profile: Profile) => void
  onEmailChange: (email: string) => void
  organisationId: string | string[]
  disabled?: boolean
  error?: string
  textFieldProps?: TextFieldProps
  sx?: SxProps
  value?: string
  required?: boolean
  disableSuggestions?: boolean
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export const UserSelector: React.FC<
  React.PropsWithChildren<UserSelectorProps>
> = function ({
  onChange,
  onEmailChange,
  sx,
  error,
  organisationId,
  textFieldProps,
  disabled = false,
  value,
  required,
  disableSuggestions,
  onBlur,
  ...props
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [debouncedQuery] = useDebounce(q, 300)

  const [{ data, fetching: loading }] = useQuery<
    GetOrgMembersQuery,
    GetOrgMembersQueryVariables
  >({
    query: GET_ORG_MEMBERS,
    variables: {
      id: [
        ...(Array.isArray(organisationId) ? organisationId : [organisationId]),
      ],
      email: `%${debouncedQuery}%`,
    },
    pause: !debouncedQuery,
  })

  const emailOptions = useMemo(() => {
    return [...new Set(data?.members.map(o => o.profile.email))]
  }, [data?.members])

  useMount(() => {
    if (value) {
      setQ(value)
    }
  })

  const onInputChange = useCallback(
    async (_: React.SyntheticEvent, value: string, reason: string) => {
      if (reason !== 'reset') {
        onEmailChange(value)
      }
    },
    [onEmailChange],
  )

  const handleChange = (
    event: React.SyntheticEvent,
    option?: string | null,
  ) => {
    event.preventDefault()
    const profile = data?.members.find(o => o.profile.email === option)
    onChange(profile?.profile ?? null)
  }

  const noOptionsText =
    q.length < 3 ? (
      t('components.user-selector.min-chars')
    ) : (
      <Typography variant="body2">
        {loading ? t('loading') : t('components.user-selector.no-results')}
      </Typography>
    )

  function renderProfile(email: string) {
    const option = data?.members.find(o => o.profile.email === email) as Member
    return [option.profile.email, option.profile.fullName]
      .filter(Boolean)
      .join(', ')
  }

  return (
    <Autocomplete
      open={open && !disableSuggestions}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      data-testid="user-selector"
      sx={sx}
      openOnFocus
      clearOnBlur={false}
      onInputChange={onInputChange}
      onChange={handleChange}
      value={value ?? null}
      options={emailOptions ?? []}
      noOptionsText={noOptionsText}
      loading={(q && !debouncedQuery) || loading}
      disabled={disabled}
      renderInput={params => (
        <TextField
          {...params}
          onBlur={event => {
            if (
              onBlur &&
              !data?.members.find(opt => {
                return opt.profile.email === value
              })
            ) {
              onBlur(event)
            }
          }}
          onChange={e => setQ(e.target.value)}
          disabled={disabled}
          required={required}
          label={t('components.user-selector.placeholder')}
          placeholder={t('components.user-selector.placeholder')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {disableSuggestions ? null : params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          error={!!error}
          helperText={error || ''}
          {...textFieldProps}
        />
      )}
      renderOption={(props, email) => {
        if (!email) return null
        const profile = renderProfile(email)

        return (
          <Box
            display="flex"
            justifyContent="space-between"
            px={2}
            component="li"
            {...props}
            key={email}
            data-testid={`profile-selector-result-${email}`}
            onClick={() => {
              onChange(
                data?.members.find(o => o.profile.email === email)?.profile ??
                  null,
              )
              setOpen(false)
            }}
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
  )
}
