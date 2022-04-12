import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION as ACCEPT_INVITE_MUTATION,
  ParamsType as AcceptInviteParamsType,
  ResponseType as AcceptInviteResponseType,
} from '@app/queries/invites/accept-invite'
import { InviteStatus } from '@app/types'

export const AcceptInvite = () => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const params = useParams()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher()

  const courseId = searchParams.get('courseId') || ''
  const inviteId = params.id as string

  useEffect(() => {
    fetcher<AcceptInviteResponseType, AcceptInviteParamsType>(
      ACCEPT_INVITE_MUTATION,
      { inviteId, courseId }
    )
      .then(resp => {
        if (
          resp?.acceptInvite?.status !== InviteStatus.ACCEPTED &&
          !resp?.addParticipant?.id
        ) {
          return Promise.reject()
        }

        setSuccess(true)
      })
      .catch(() => setError(true))
  }, [inviteId, courseId, fetcher])

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Alert
          severity="error"
          variant="outlined"
          data-testid="accept-invite-error-alert"
        >
          There was an error accepting the invite. Please try again later.
        </Alert>
      </Container>
    )
  }

  if (success) {
    return (
      <Navigate
        to={`/courses/${courseId}/details?success=invite_accepted`}
        replace
      />
    )
  }

  return <CircularProgress size={50} />
}
