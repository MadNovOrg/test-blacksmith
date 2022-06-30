import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION as ACCEPT_ORG_INVITE_MUTATION,
  ParamsType as AcceptOrgInviteParamsType,
  ResponseType as AcceptOrgInviteResponseType,
} from '@app/queries/invites/accept-org-invite'

export const AcceptOrgInvite = () => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const params = useParams()
  const fetcher = useFetcher()
  const { profile } = useAuth()

  const inviteId = params.id as string

  useEffect(() => {
    if (profile) {
      fetcher<AcceptOrgInviteResponseType, AcceptOrgInviteParamsType>(
        ACCEPT_ORG_INVITE_MUTATION,
        { profileId: profile.id }
      )
        .then(resp => {
          if (!resp?.invite?.id) {
            return Promise.reject()
          }
          setSuccess(true)
        })
        .catch(() => setError(true))
    }
  }, [inviteId, fetcher, profile])

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
    return <Navigate to={`/`} replace />
  }

  return <CircularProgress size={50} />
}
