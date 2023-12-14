import CalendarIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { differenceInSeconds } from 'date-fns'
import jwtDecode from 'jwt-decode'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import { AppLogo } from '@app/components/AppLogo'
import { useAuth } from '@app/context/auth'
import {
  CourseDeliveryType,
  DeclineInviteMutation,
  DeclineInviteMutationVariables,
  GetInviteQuery,
  GetInviteQueryVariables,
  InviteStatus,
} from '@app/generated/graphql'
import { MUTATION as DECLINE_INVITE_MUTATION } from '@app/queries/invites/decline-invite'
import { QUERY as GET_INVITE_QUERY } from '@app/queries/invites/get-invite'
import { TimeDifferenceAndContext } from '@app/types'
import {
  formatCourseVenueName,
  getTimeDifferenceAndContext,
  now,
  userExistsInCognito,
} from '@app/util'

export const InvitationPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { profile, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [response, setResponse] = useState('yes')
  const [note, setNote] = useState<string>('')

  const { token, inviteId, courseId, email } = useMemo(() => {
    const token = searchParams.get('token') as string
    const courseId = searchParams.get('courseId') as string

    const decoded = jwtDecode<{ invite_id: string; sub: string }>(token)
    const inviteId = decoded.invite_id

    return { token, inviteId, courseId, email: decoded.sub }
  }, [searchParams])

  useEffect(() => {
    if (!profile || !email || profile.email === email) return

    logout()
  }, [profile, email, logout])

  const [
    { data: inviteData, error: inviteDataError, fetching: inviteDataIsLoading },
    getInviteData,
  ] = useQuery<GetInviteQuery, GetInviteQueryVariables>({
    query: GET_INVITE_QUERY,
    pause: !token,
    requestPolicy: 'network-only',
    context: useMemo(
      () => ({
        fetchOptions: {
          headers: { 'x-auth': `Bearer ${token}` },
        },
      }),
      [token]
    ),
  })

  const [
    { error: declineInvitationError, fetching: declineInvitationLoading },
    declineInvitation,
  ] = useMutation<DeclineInviteMutation, DeclineInviteMutationVariables>(
    DECLINE_INVITE_MUTATION
  )

  const invite = (inviteData?.invite || {}) as GetInviteQuery['invite']
  const isSubmitted = invite?.status !== InviteStatus.Pending

  const startDate = invite ? new Date(invite.startDate) : null
  const endDate = invite ? new Date(invite.endDate) : null

  const courseHasBegun = startDate
    ? differenceInSeconds(startDate, now()) < 0
    : false

  const startsIn: TimeDifferenceAndContext | null = startDate
    ? getTimeDifferenceAndContext(startDate, now())
    : null
  const endsIn: TimeDifferenceAndContext | null = endDate
    ? getTimeDifferenceAndContext(endDate, now())
    : null

  const address = invite?.venueAddress

  const handleSubmit = async () => {
    if (response === 'yes') {
      const isUserLoggedIn = profile?.email === email
      const exists = isUserLoggedIn ? true : await userExistsInCognito(email)
      const nextUrl = exists ? '/auto-login' : '/auto-register'
      const continueUrl = `/accept-invite/${inviteId}?courseId=${courseId}`
      const qs = new URLSearchParams({ token, continue: continueUrl })

      return navigate(isUserLoggedIn ? continueUrl : `${nextUrl}?${qs}`, {
        replace: true,
      })
    }

    await declineInvitation(
      { note },
      { fetchOptions: { headers: { 'x-auth': `Bearer ${token}` } } }
    )
    getInviteData()
  }

  // aligns the spinner as it was positioned in the top left of the screen
  if (inviteDataIsLoading) {
    return (
      <Container sx={{ py: 5 }}>
        <CircularProgress sx={{ m: 'auto', display: 'block' }} size={40} />
      </Container>
    )
  }
  if (inviteDataError) {
    // TODO: Need designs
    switch (inviteDataError.message) {
      case 'EXPIRED':
        return (
          <Box>
            <Typography>Invitation expired</Typography>
          </Box>
        )

      default:
        return (
          <Box>
            <Typography>Invitation not found</Typography>
          </Box>
        )
    }
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
        <Typography variant="h3" fontWeight="600" color="grey.800" mb={3}>
          {t('course-registration')}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          {invite?.courseName}
        </Typography>

        <Typography variant="body2" color="grey.600">
          {invite?.description}
        </Typography>

        <Box mt={3} mb={4}>
          {courseHasBegun && endsIn ? (
            <Chip
              label={t('pages.course-participants.until-course-ends', endsIn)}
            />
          ) : startsIn ? (
            <Chip
              label={t(
                'pages.course-participants.until-course-begins',
                startsIn
              )}
            />
          ) : null}

          <Box display="flex" mb={2}>
            <Box mr={1} display="flex">
              <CalendarIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                {t('dates.withTime', { date: invite?.startDate })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t('dates.withTime', { date: invite?.endDate })}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" mb={2} alignItems="center">
            <Box mr={1} display="flex">
              <PersonIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2">
                {t('pages.course-participants.hosted-by', {
                  trainer: invite?.trainerName,
                })}
              </Typography>
            </Box>
          </Box>

          <Box display="flex">
            <Box mr={1}>
              <LocationOnIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600">
                {formatCourseVenueName(
                  invite?.deliveryType as CourseDeliveryType,
                  invite?.venueName
                )}
              </Typography>
              <Typography variant="body2">
                {address?.addressLineOne || ''}
              </Typography>
              <Typography variant="body2">
                {address?.addressLineTwo || ''}
              </Typography>
              <Typography variant="body2">{address?.city || ''}</Typography>
              <Typography variant="body2">{address?.postCode || ''}</Typography>
            </Box>
          </Box>
        </Box>

        {isSubmitted ? (
          <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
            <Alert variant="outlined" color="success" sx={{ mb: 3 }}>
              {t('invitation.response-sent')}
            </Alert>

            <Button href="/" variant="contained">
              {t('invitation.goto-tt')}
            </Button>
          </Box>
        ) : (
          <>
            <Box mt={3} mb={2}>
              <FormControl fullWidth>
                <FormLabel id="response-q">
                  {t('invitation.can-attend-q')}
                </FormLabel>
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
                    label={t<string>('invitation.will-attend')}
                    sx={{
                      border: 1,
                      borderColor: 'grey.700',
                      ml: 0,
                      height: 50,
                      borderBottom: 0,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                    }}
                    data-testid="will-attend"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label={t<string>('invitation.wont-attend')}
                    sx={{
                      border: 1,
                      borderColor: 'grey.700',
                      ml: 0,
                      height: 50,
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                    }}
                    data-testid="wont-attend"
                  />
                </RadioGroup>
              </FormControl>

              {response === 'no' && (
                <Box width="80%" mt={2}>
                  <TextField
                    id="note"
                    variant="filled"
                    label={t('invitation.leave-note-op')}
                    placeholder={t('invitation.leave-note-op')}
                    fullWidth
                    value={note}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNote(e.target.value)
                    }
                  />
                </Box>
              )}
            </Box>

            <LoadingButton
              loading={declineInvitationLoading || inviteDataIsLoading}
              type="button"
              variant="contained"
              color="primary"
              data-testid="login-submit"
              size="large"
              onClick={handleSubmit}
            >
              {response === 'yes'
                ? t('invitation.continue-registration')
                : t('invitation.send-response')}
            </LoadingButton>
            {declineInvitationError || inviteDataError ? (
              <FormHelperText sx={{ mt: 2 }} error>
                {t('errors.unable-to-submit-error')}
              </FormHelperText>
            ) : null}
          </>
        )}
      </Box>
    </Box>
  )
}
