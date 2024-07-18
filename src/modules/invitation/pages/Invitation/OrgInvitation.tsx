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
import { useMutation, useQuery } from 'urql'

import { AppLogo } from '@app/components/AppLogo'
import { useAuth } from '@app/context/auth'
import {
  DeclineOrgInviteMutation,
  DeclineOrgInviteMutationVariables,
  GetOrgInviteQuery,
  GetOrgInviteQueryVariables,
} from '@app/generated/graphql'
import { MUTATION as DECLINE_ORG_INVITE_MUTATION } from '@app/queries/invites/decline-org-invite'
import {
  QUERY as GET_ORG_INVITE_QUERY,
  ResponseType as GetOrgInviteResponseType,
} from '@app/queries/invites/get-org-invite'
import { userExistsInCognito } from '@app/util'

export const OrgInvitationPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [response, setResponse] = useState('yes')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [errorOnDecode, setErrorOnDecode] = useState<boolean>(false)

  const tokenData = useMemo(() => {
    const token = searchParams.get('token') as string

    try {
      const decoded = jwtDecode<{ invite_id: string; sub: string }>(token)
      const inviteId = decoded.invite_id

      return { token, inviteId, email: decoded.sub }
    } catch (e) {
      console.log(e)
      setErrorOnDecode(true)
      return undefined
    }
  }, [searchParams])

  useEffect(() => {
    if (!profile || !tokenData?.email || profile.email === tokenData?.email)
      return

    logout()
  }, [profile, tokenData?.email, logout])

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [{ data, error }] = useQuery<
    GetOrgInviteQuery,
    GetOrgInviteQueryVariables
  >({
    query: GET_ORG_INVITE_QUERY,
    pause: !tokenData?.token,
    context: useMemo(
      () => ({
        fetchOptions: {
          headers: { 'x-auth': `Bearer ${tokenData?.token}` },
        },
      }),
      [tokenData?.token],
    ),
  })

  const [, declineInvite] = useMutation<
    DeclineOrgInviteMutation,
    DeclineOrgInviteMutationVariables
  >(DECLINE_ORG_INVITE_MUTATION)

  const invite = (data?.invite || {}) as GetOrgInviteResponseType['invite']
  const isFetching = !data && !error

  const organizationId = data?.invite?.orgId

  const handleSubmit = async () => {
    setIsLoading(true)

    if (tokenData) {
      if (response === 'yes') {
        const isUserLoggedIn = profile?.email === tokenData?.email
        const exists = isUserLoggedIn
          ? true
          : await userExistsInCognito(tokenData.email)
        const nextUrl = exists ? '/auto-login' : '/auto-register'
        const continueUrl = `/accept-org-invite/${tokenData.inviteId}?token=${tokenData.token}`
        const qs = new URLSearchParams({
          token: tokenData.token,
          continue: continueUrl,
          orgId: organizationId ?? '',
        })

        return navigate(
          `${isUserLoggedIn ? continueUrl : `${nextUrl}?${qs}`}`,
          {
            replace: true,
          },
        )
      }

      setSubmitError(null)

      try {
        declineInvite(
          {
            inviteId: data?.invite?.id,
          },
          {
            fetchOptions: {
              headers: { 'x-auth': `Bearer ${tokenData.token}` },
            },
          },
        )
        return navigate('/login?invitationDeclined=true')
      } catch (e) {
        const err = e as Error
        console.log(err)
        setSubmitError('Unable to submit response')
      }

      setIsLoading(false)
    }
  }

  if (errorOnDecode) {
    return (
      <Box>
        <Typography>{t('invitation.invitation-invalid-token')}</Typography>
      </Box>
    )
  }

  if (isFetching) {
    return <CircularProgress size={40} />
  }

  if (error) {
    return (
      <Box>
        <Typography>{t('invitation.invitation-expired')}</Typography>
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
      <AppLogo width={80} height={80} />

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
