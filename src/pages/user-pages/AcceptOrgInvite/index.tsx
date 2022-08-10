import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import { gqlRequest } from '@app/lib/gql-request'
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
  const { profile, reloadCurrentProfile } = useAuth()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''
  const inviteId = params.id as string

  useEffect(() => {
    if (profile) {
      gqlRequest<AcceptOrgInviteResponseType, AcceptOrgInviteParamsType>(
        ACCEPT_ORG_INVITE_MUTATION,
        { profileId: profile.id },
        { headers: { 'x-auth': `Bearer ${token}` } }
      )
        .then(resp => {
          if (!resp?.invite?.id) {
            return Promise.reject()
          }
          setSuccess(true)
          return reloadCurrentProfile()
        })
        .catch(() => setError(true))
    }
  }, [inviteId, fetcher, profile, token, reloadCurrentProfile])

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
