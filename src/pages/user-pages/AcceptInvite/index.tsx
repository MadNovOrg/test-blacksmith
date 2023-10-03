import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation } from 'urql'

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

  const courseId = searchParams.get('courseId') || ''
  const inviteId = params.id as string

  const [, acceptInvite] = useMutation<
    AcceptInviteResponseType,
    AcceptInviteParamsType
  >(ACCEPT_INVITE_MUTATION)

  const acceptInviteCallback = useCallback(async () => {
    const { data: resp } = await acceptInvite({ inviteId, courseId })

    if (
      resp?.acceptInvite?.status !== InviteStatus.ACCEPTED &&
      !resp?.addParticipant?.id
    ) {
      setError(true)
    }

    setSuccess(true)
  }, [acceptInvite, courseId, inviteId])

  useEffect(() => {
    acceptInviteCallback()
  }, [acceptInviteCallback])

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
