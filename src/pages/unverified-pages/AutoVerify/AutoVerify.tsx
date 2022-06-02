import { CircularProgress, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useMount } from 'react-use'

import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION as VERIFY_USER_MUTATION,
  ParamsType as VerifyUserParamsType,
  ResponseType as VerifyUserResponseType,
} from '@app/queries/invites/verify-user'

export const AutoVerify = () => {
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const { loadProfile } = useAuth()
  const fetcher = useFetcher()
  const { t } = useTranslation()

  const inviteId = params.id as string

  useMount(() => {
    fetcher<VerifyUserResponseType, VerifyUserParamsType>(
      VERIFY_USER_MUTATION,
      { inviteId }
    ).then(async resp => {
      if (!resp.verifyUser) {
        setError(t('errors.generic.invite-accept-error'))
        return
      }
      const currentUser = await Auth.currentUserPoolUser()
      await currentUser.refreshSessionIfPossible()
      await loadProfile(currentUser)
    })
  })

  if (error) {
    return <Typography>{error}</Typography>
  }

  return <CircularProgress size={50} />
}
