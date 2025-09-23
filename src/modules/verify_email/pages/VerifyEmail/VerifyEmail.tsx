import { Box, Typography, Button } from '@mui/material'
import { Auth } from 'aws-amplify'
import { TFunction } from 'i18next'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import {
  RemoveUnverifiedRoleMutation,
  RemoveUnverifiedRoleMutationVariables,
} from '@app/generated/graphql'
import { schemas, yup } from '@app/schemas'
import { isFullUrl, requiredMsg } from '@app/util'

import { Form } from '../../components/Form/Form'
import { REMOVE_UNVERIFIED_ROLE } from '../../queries'

type LocationState = {
  from: { pathname: string; search: string }
  send: boolean
  callbackUrl?: string
}

export type Props = unknown

export type VerifyInputs = { code: string }

export const getVerifySchema = (t: TFunction) => {
  return yup.object({
    code: schemas
      .emailCode(t)
      .required(requiredMsg(t, 'pages.signup.verify-code-label')),
  })
}

const defaultNextPath = { pathname: '/profile', search: '' }

export const VerifyEmailPage: React.FC<React.PropsWithChildren<Props>> = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { loadProfile, profile } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const locationState = (location.state || {}) as LocationState
  const from = locationState.from || defaultNextPath
  const callbackUrl = locationState.callbackUrl
  const nextUrl = callbackUrl ?? `${from.pathname || '/'}${from.search || ''}`

  const continueToNextPage = () => {
    if (isFullUrl(nextUrl)) {
      setLoading(true)
      window.location.href = nextUrl
    } else navigate(nextUrl, { replace: true })
  }

  const displayVerifyLater = nextUrl === '/booking/details'

  const handleContinue = async () => {
    const currentUser = await Auth.currentUserPoolUser()
    await currentUser.refreshSessionIfPossible()
    await loadProfile(currentUser)
    return continueToNextPage()
  }

  const [, removeUnverifiedRole] = useMutation<
    RemoveUnverifiedRoleMutation,
    RemoveUnverifiedRoleMutationVariables
  >(REMOVE_UNVERIFIED_ROLE)

  const onSuccess = useCallback(async () => {
    if (profile?.id) {
      await removeUnverifiedRole({ profileId: profile.id })
    }
    setSuccess(true)
  }, [profile, removeUnverifiedRole])

  if (loading) return <SuspenseLoading />

  return (
    <Box display="flex" justifyContent="center">
      <Box
        mt={3}
        bgcolor="common.white"
        py={5}
        px={8}
        borderRadius={2}
        width={628}
        position="relative"
      >
        <Typography variant="h3" textAlign="center" fontWeight="600" mb={2}>
          {t('pages.signup.verify-heading')}
        </Typography>

        {success ? (
          <Box alignItems={'center'} alignContent={'center'}>
            <Typography sx={{ my: 6 }}>
              {t('pages.signup.success-hint')}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleContinue}
              data-testid="btn-goto-login"
            >
              {t('pages.signup.success-btn')}
            </Button>
          </Box>
        ) : (
          <Form
            displayVerifyLater={displayVerifyLater}
            onVerifyLater={continueToNextPage}
            onSuccess={onSuccess}
          />
        )}
      </Box>
    </Box>
  )
}
