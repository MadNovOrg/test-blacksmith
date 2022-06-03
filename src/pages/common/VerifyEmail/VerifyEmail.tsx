import { Box, Typography, Button } from '@mui/material'
import { Auth } from 'aws-amplify'
import { TFunction } from 'i18next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

import { Form } from './components/Form'

type LocationState = {
  from: { pathname: string; search: string }
  send: boolean
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

export const VerifyEmailPage: React.FC<Props> = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { loadProfile } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const locationState = (location.state || {}) as LocationState

  const continueToNextPage = async () => {
    const from = locationState.from || defaultNextPath
    const nextUrl = `${from.pathname || '/'}${from.search || ''}`
    return navigate(nextUrl, { replace: true })
  }

  const handleContinue = async () => {
    const currentUser = await Auth.currentUserPoolUser()
    await currentUser.refreshSessionIfPossible()
    await loadProfile(currentUser)

    return continueToNextPage()
  }

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
          <Box>
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
            onVerifyLater={continueToNextPage}
            onSuccess={() => setSuccess(true)}
          />
        )}
      </Box>
    </Box>
  )
}
