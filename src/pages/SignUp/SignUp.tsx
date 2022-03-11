import React, { useState } from 'react'
import { Typography, Link, Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'

import { SignUpForm } from './components/Form'
import { SignUpVerify } from './components/Verify'
import { SignUpResult } from './helpers'

export const SignUpPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [verified, setVerified] = useState(false)

  const onSignUp = (r: SignUpResult) => setUsername(r.username)
  const onVerified = () => setVerified(true)

  const isSignUp = !username
  const isVerify = !!username && !verified
  const isSuccess = !!username && verified

  const goToLogin = () => {
    // TODO: do we need adjustments when signing up from Invite??
    navigate({ pathname: 'login' }, { replace: true })
  }

  return (
    <AppLayoutMinimal width={628}>
      {isSignUp ? (
        <Link
          href="/login"
          data-testid="back-to-login"
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: 'grey.800',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: 20,
            top: 20,
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          {t('pages.signup.back-to-login')}
        </Link>
      ) : null}

      <Typography
        variant="h3"
        sx={{ mt: 3, textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
      >
        {t('pages.signup.heading')}
      </Typography>

      {isSignUp ? <SignUpForm onSignUp={onSignUp} /> : null}

      {isVerify ? (
        <SignUpVerify username={username} onVerified={onVerified} />
      ) : null}

      {isSuccess ? (
        <Box>
          <Typography sx={{ my: 6 }}>
            {t('pages.signup.success-hint')}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={goToLogin}
          >
            {t('pages.signup.success-btn')}
          </Button>
        </Box>
      ) : null}
    </AppLayoutMinimal>
  )
}
