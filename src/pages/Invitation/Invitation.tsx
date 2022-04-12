import CalendarIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  FormHelperText,
  Chip,
  CircularProgress,
  Alert,
  Link,
  TextField,
} from '@mui/material'
import { differenceInDays, format } from 'date-fns'
import jwtDecode from 'jwt-decode'
import React, { ChangeEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'

import { Logo } from '@app/components/Logo'
import { gqlRequest } from '@app/lib/gql-request'
import {
  MUTATION as DECLINE_INVITE_MUTATION,
  ParamsType as DeclineInviteParamsType,
  ResponseType as DeclineInviteResponseType,
} from '@app/queries/invites/decline-invite'
import {
  QUERY as GET_INVITE_QUERY,
  ResponseType as GetInviteResponseType,
} from '@app/queries/invites/get-invite'
import { GqlError, InviteStatus } from '@app/types'
import { now } from '@app/util'

export const InvitationPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [response, setResponse] = useState('yes')
  const [note, setNote] = useState<string>('')

  const { token, inviteId, courseId } = useMemo(() => {
    const token = searchParams.get('token') as string
    const courseId = searchParams.get('courseId') as string

    const decoded = jwtDecode<{ invite_id: string }>(token)
    const inviteId = decoded.invite_id

    return { token, inviteId, courseId }
  }, [searchParams])

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data, error, mutate } = useSWR<GetInviteResponseType, GqlError>(
    token ? GET_INVITE_QUERY : null,
    (query, variables) =>
      gqlRequest(query, variables, { headers: { 'x-auth': `Bearer ${token}` } })
  )

  const invite = (data?.invite || {}) as GetInviteResponseType['invite']
  const isFetching = !data && !error
  const isSubmitted = invite.status !== InviteStatus.PENDING
  const startsInDays = differenceInDays(new Date(invite.startDate), now())
  const courseDuration = differenceInDays(
    new Date(invite.endDate),
    new Date(invite.startDate)
  )

  const address = invite.venueAddress

  const handleSubmit = async () => {
    if (response === 'yes') {
      navigate(`/accept-invite/${inviteId}?courseId=${courseId}`)
      return
    }

    setIsLoading(true)
    setSubmitError(null)

    try {
      await gqlRequest<DeclineInviteResponseType, DeclineInviteParamsType>(
        DECLINE_INVITE_MUTATION,
        { note },
        { headers: { 'x-auth': `Bearer ${token}` } }
      )
      mutate()
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
    // TODO: Need designs
    if (error.code === 'EXPIRED') {
      return (
        <Box>
          <Typography>Invitation expired</Typography>
        </Box>
      )
    }

    return null
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
        width={500}
      >
        <Typography variant="h3" fontWeight="600" color="grey.800" mb={3}>
          {t('course-registration')}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          {invite.courseName}
        </Typography>

        <Typography variant="body2" color="grey.600">
          {invite.description}
        </Typography>

        <Box mt={3} mb={4}>
          <Chip
            label={t('pages.course-participants.until-course-begins', {
              count: startsInDays,
            })}
            size="small"
            sx={{ borderRadius: 2, mb: 1 }}
          />

          <Box display="flex" mb={2}>
            <Box mr={1} display="flex">
              <CalendarIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                {format(new Date(invite.startDate), 'd MMMM yyyy, HH:mm a')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {format(new Date(invite.endDate), 'd MMMM yyyy, HH:mm a')}
              </Typography>
              <Typography variant="body2" color="grey.600" gutterBottom>
                {t('pages.course-participants.course-duration', {
                  count: courseDuration,
                })}
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
                  trainer: invite.trainerName,
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
                {invite.venueName}
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

            <Link href="/" variant="body1" fontWeight="600">
              {t('invitation.goto-tt')}
            </Link>
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
                    variant="standard"
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
              loading={isLoading}
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

            {submitError && (
              <FormHelperText sx={{ mt: 2 }} error>
                {submitError}
              </FormHelperText>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
