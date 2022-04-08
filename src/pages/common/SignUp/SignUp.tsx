import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Typography, Link, Box, Button } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { LinkBehavior } from '@app/components/LinkBehavior'

import { SignUpForm } from './components/Form'
import { SignUpVerify } from './components/Verify'
import { SignUpResult } from './helpers'

type LocationState = { from: { pathname: string; search: string } }

export const SignUpPage: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [verified, setVerified] = useState(false)

  const onSignUp = (r: SignUpResult) => setUsername(r.username)
  const onVerified = () => setVerified(true)

  const from = (location.state as LocationState)?.from || {}

  const isSignUp = !username
  const isVerify = !!username && !verified
  const isSuccess = !!username && verified

  return (
    <AppLayoutMinimal width={628}>
      {isSignUp ? (
        <Link
          href="/login"
          data-testid="back-to-login"
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: 'grey.800',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
        >
          <ArrowBackIcon sx={{ mr: '.3em', fontSize: '1.5em' }} />
          {t('pages.signup.back-to-login')}
        </Link>
      ) : null}

      <Typography
        variant="h3"
        sx={{ textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
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
            component={LinkBehavior}
            href="/login"
            state={from ? { from } : undefined}
            replace
          >
            {t('pages.signup.success-btn')}
          </Button>
        </Box>
      ) : null}
    </AppLayoutMinimal>
  )
}
