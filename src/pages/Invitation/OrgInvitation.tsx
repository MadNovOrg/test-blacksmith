import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'

import { Logo } from '@app/components/Logo'
import { useAuth } from '@app/context/auth'
import { gqlRequest } from '@app/lib/gql-request'
import {
  MUTATION as DECLINE_ORG_INVITE_MUTATION,
  ResponseType as DeclineOrgInviteResponseType,
} from '@app/queries/invites/decline-org-invite'
import {
  QUERY as GET_ORG_INVITE_QUERY,
  ResponseType as GetOrgInviteResponseType,
} from '@app/queries/invites/get-org-invite'
import { GqlError } from '@app/types'
import { userExistsInCognito } from '@app/util'

export const OrgInvitationPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [response, setResponse] = useState('yes')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { token, inviteId, email } = useMemo(() => {
    const token = searchParams.get('token') as string

    const decoded = jwtDecode<{ invite_id: string; sub: string }>(token)
    const inviteId = decoded.invite_id

    return { token, inviteId, email: decoded.sub }
  }, [searchParams])

  useEffect(() => {
    if (!profile || !email || profile.email === email) return

    logout()
  }, [profile, email, logout])

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data, error } = useSWR<GetOrgInviteResponseType, GqlError>(
    token ? GET_ORG_INVITE_QUERY : null,
    (query, variables) =>
      gqlRequest(query, variables, { headers: { 'x-auth': `Bearer ${token}` } })
  )

  const invite = (data?.invite || {}) as GetOrgInviteResponseType['invite']
  const isFetching = !data && !error

  const handleSubmit = async () => {
    setIsLoading(true)

    if (response === 'yes') {
      const isUserLoggedIn = profile?.email === email
      const exists = isUserLoggedIn ? true : await userExistsInCognito(email)
      const nextUrl = exists ? '/auto-login' : '/auto-register'
      const continueUrl = `/accept-org-invite/${inviteId}?token=${token}`
      const qs = new URLSearchParams({ token, continue: continueUrl })

      return navigate(`${isUserLoggedIn ? continueUrl : nextUrl}?${qs}`, {
        replace: true,
      })
    }

    setSubmitError(null)

    try {
      await gqlRequest<DeclineOrgInviteResponseType>(
        DECLINE_ORG_INVITE_MUTATION,
        {
          inviteId: data?.invite.id,
        },
        { headers: { 'x-auth': `Bearer ${token}` } }
      )
      return navigate('/login?invitationDeclined=true')
    } catch (e) {
      const err = e as Error
      console.log(err)
      setSubmitError('Unable to submit response')
    }

    setIsLoading(false)
  }

  if (isFetching) {
    return <CircularProgress size={40} />
  }

  if (error) {
    return (
      <Box>
        <Typography>Invitation expired</Typography>
      </Box>
    )
  }

  return (
    <Box
      bgcolor="grey.200"
      width="100%"
      height="100%"
      p={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="scroll"
    >
      <Logo width={80} height={80} />

      <Box
        mt={5}
        bgcolor="common.white"
        py={3}
        px={3}
        borderRadius={2}
        width={isMobile ? undefined : 500}
      >
        <Typography variant="h3" fontWeight="600" mb={3}>
          {`${t('pages.org-invite.title')} ${invite.orgName}`}
        </Typography>

        <Box mt={3} mb={2}>
          <FormControl fullWidth>
            <RadioGroup
              aria-labelledby="response-q"
              name="response"
              sx={{ mt: 1 }}
              value={response}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setResponse(e.target.value)
              }
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={t<string>('pages.org-invite.accept')}
                sx={{
                  border: 1,
                  borderColor: 'grey.700',
                  ml: 0,
                  height: 50,
                  borderBottom: 0,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
                data-testid="accept"
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label={t<string>('pages.org-invite.decline')}
                sx={{
                  border: 1,
                  borderColor: 'grey.700',
                  ml: 0,
                  height: 50,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
                data-testid="decline"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <LoadingButton
          loading={isLoading}
          type="button"
          variant="contained"
          color="primary"
          data-testid="invite-submit"
          size="large"
          onClick={handleSubmit}
        >
          {response === 'yes'
            ? t('pages.org-invite.continue-to-organization')
            : t('invitation.send-response')}
        </LoadingButton>

        {submitError && (
          <FormHelperText sx={{ mt: 2 }} error>
            {submitError}
          </FormHelperText>
        )}
      </Box>
    </Box>
  )
}
