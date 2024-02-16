import { Alert, CircularProgress, Container } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  AcceptOrgInviteMutation,
  AcceptOrgInviteMutationVariables,
} from '@app/generated/graphql'
import { MUTATION as ACCEPT_ORG_INVITE_MUTATION } from '@app/queries/invites/accept-org-invite'

export const AcceptOrgInvite = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile, reloadCurrentProfile } = useAuth()
  const [inviteAccepted, setInviteAccepted] = useState<boolean>(false)

  const token = searchParams.get('token') || ''

  const [{ error }, acceptOrgInvite] = useMutation<
    AcceptOrgInviteMutation,
    AcceptOrgInviteMutationVariables
  >(ACCEPT_ORG_INVITE_MUTATION)

  const accept = useCallback(async () => {
    if (profile && !inviteAccepted) {
      const resp = await acceptOrgInvite(
        { profileId: profile.id },
        {
          fetchOptions: {
            headers: { 'x-auth': `Bearer ${token}` },
          },
        }
      )

      if (resp.data?.invite?.id) {
        setInviteAccepted(() => true)

        await reloadCurrentProfile()

        return navigate('/')
      }
    }
  }, [
    acceptOrgInvite,
    inviteAccepted,
    navigate,
    profile,
    reloadCurrentProfile,
    token,
  ])

  useEffect(() => {
    if (profile && !inviteAccepted) accept().then()
  }, [accept, inviteAccepted, profile])

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
