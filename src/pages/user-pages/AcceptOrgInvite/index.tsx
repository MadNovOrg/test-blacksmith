import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  AcceptOrgInviteMutation,
  AcceptOrgInviteMutationVariables,
} from '@app/generated/graphql'
import { MUTATION as ACCEPT_ORG_INVITE_MUTATION } from '@app/queries/invites/accept-org-invite'

export const AcceptOrgInvite = () => {
  const navigate = useNavigate()
  const { profile, reloadCurrentProfile } = useAuth()
  const [searchParams] = useSearchParams()

  const accepted = useRef<boolean>(false)

  const token = searchParams.get('token') || ''

  const [{ error }, acceptOrgInvite] = useMutation<
    AcceptOrgInviteMutation,
    AcceptOrgInviteMutationVariables
  >(ACCEPT_ORG_INVITE_MUTATION)

  const accept = useCallback(async () => {
    if (profile && !accepted.current) {
      const resp = await acceptOrgInvite(
        { profileId: profile.id },
        {
          fetchOptions: {
            headers: { 'x-auth': `Bearer ${token}` },
          },
        }
      )

      if (resp.data?.invite?.id) {
        accepted.current = true
        await reloadCurrentProfile()
        return navigate('/')
      }
    }
  }, [acceptOrgInvite, navigate, profile, reloadCurrentProfile, token])

  useEffect(() => {
    if (profile && !accepted.current) {
      accept().then()
    }
  }, [accept, profile])

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
