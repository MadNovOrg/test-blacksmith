import { CircularProgress } from '@mui/material'
import { Auth } from 'aws-amplify'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useMount } from 'react-use'

import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION as VERIFY_USER_MUTATION,
  ParamsType as VerifyUserParamsType,
  ResponseType as VerifyUserResponseType,
} from '@app/queries/invites/verify-user'

export const AutoVerifyUser = () => {
  const params = useParams()
  const { loadProfile } = useAuth()
  const fetcher = useFetcher()

  const inviteId = params.id as string

  useMount(() => {
    fetcher<VerifyUserResponseType, VerifyUserParamsType>(
      VERIFY_USER_MUTATION,
      { inviteId }
    ).then(async () => {
      const currentUser = await Auth.currentUserPoolUser()
      await currentUser.refreshSessionIfPossible()
      await loadProfile(currentUser)
    })
  })

  return <CircularProgress size={50} />
}
