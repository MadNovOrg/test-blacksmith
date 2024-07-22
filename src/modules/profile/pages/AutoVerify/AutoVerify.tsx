import { CircularProgress, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useMount } from 'react-use'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  VerifyUserMutation,
  VerifyUserMutationVariables,
} from '@app/generated/graphql'
import { VERIFY_USER_MUTATION } from '@app/modules/profile/queries/verify-user'

export const AutoVerify = () => {
  const params = useParams()
  const [error, setError] = useState<string | null>(null)
  const { loadProfile } = useAuth()
  const { t } = useTranslation()

  const inviteId = params.id as string

  const [, verifyUser] = useMutation<
    VerifyUserMutation,
    VerifyUserMutationVariables
  >(VERIFY_USER_MUTATION)

  useMount(async () => {
    const { data } = await verifyUser({ inviteId })
    if (!data?.verifyUser) {
      setError(t('errors.generic.invite-accept-error'))
      return
    }
    const currentUser = await Auth.currentUserPoolUser()
    await currentUser.refreshSessionIfPossible()
    await loadProfile(currentUser)
  })

  if (error) {
    return <Typography>{error}</Typography>
  }

  return <CircularProgress size={50} />
}
