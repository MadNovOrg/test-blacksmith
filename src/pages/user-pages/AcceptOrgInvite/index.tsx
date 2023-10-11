import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'

import { useAuth } from '@app/context/auth'
import {
  AcceptOrgInviteMutation,
  AcceptOrgInviteMutationVariables,
} from '@app/generated/graphql'
import { gqlRequest } from '@app/lib/gql-request'
import { MUTATION as ACCEPT_ORG_INVITE_MUTATION } from '@app/queries/invites/accept-org-invite'

export const AcceptOrgInvite = () => {
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { profile, reloadCurrentProfile } = useAuth()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''

  const acceptOrgInvite = useCallback(async () => {
    if (profile) {
      gqlRequest<AcceptOrgInviteMutation, AcceptOrgInviteMutationVariables>(
        ACCEPT_ORG_INVITE_MUTATION,
        { profileId: profile.id },
        { headers: { 'x-auth': `Bearer ${token}` } }
      )
        .then(response => {
          if (!response.invite?.id) {
            setError(true)
            return Promise.reject()
          }

          setError(false)
          reloadCurrentProfile()
          return navigate('/')
        })
        .catch(() => {
          setError(true)
          return Promise.reject()
        })
    }
  }, [navigate, profile, reloadCurrentProfile, token])

  useUpdateEffect(() => {
    if (profile) {
      acceptOrgInvite()
    }
  })

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

  return <CircularProgress size={50} />
}
