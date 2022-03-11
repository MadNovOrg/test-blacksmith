import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Container } from '@mui/material'

import useAcceptInvite from '@app/hooks/useAcceptInvite'

import { LoadingStatus } from '@app/util'

export const AcceptInvite = () => {
  const navigate = useNavigate()
  const { id: courseId } = useParams()

  const { status } = useAcceptInvite(courseId ?? '')

  useEffect(() => {
    if (status === LoadingStatus.SUCCESS) {
      navigate(`/my-training/courses/${courseId}?acceptedInvite=true`)
    }
  }, [status, courseId, navigate])

  return status === LoadingStatus.ERROR ? (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Alert
        severity="error"
        variant="outlined"
        data-testid="accept-invite-error-alert"
      >
        There was an error accepting the invite. Please try again later.
      </Alert>
    </Container>
  ) : null
}
