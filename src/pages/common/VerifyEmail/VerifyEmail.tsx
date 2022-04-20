import { Box, Typography, Button } from '@mui/material'
import { Auth } from 'aws-amplify'
import { TFunction } from 'i18next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { UnverifiedLayout } from '@app/components/UnverifiedLayout'
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

export const VerifyEmailPage: React.FC<Props> = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { loadProfile } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const state = (location.state || {}) as LocationState
  const from = state.from || {}

  const handleContinue = async () => {
    const currentUser = await Auth.currentUserPoolUser()
    await currentUser.refreshSessionIfPossible()
    await loadProfile(currentUser)

    const to = `${from.pathname || '/'}${from.search || ''}`
    return navigate(to, { replace: true })
  }

  return (
    <UnverifiedLayout width={628}>
      <Typography
        variant="h3"
        sx={{ textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
      >
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
          onVerifyLater={() => navigate('/')}
          onSuccess={() => setSuccess(true)}
        />
      )}
    </UnverifiedLayout>
  )
}
