import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Typography, Link } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { useAuth } from '@app/context/auth'

import { SignUpForm } from './components/Form'

type LocationState = { from: { pathname: string; search: string } }

export const SignUpPage: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const from = (location.state as LocationState)?.from || {}

  const onSignUp = (email: string, password: string) => {
    // delay auto-login just in case
    setTimeout(async () => {
      await login(email, password)
      navigate('/verify', { state: { from } })
    }, 500)
  }

  return (
    <AppLayoutMinimal width={628}>
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

      <Typography
        variant="h3"
        sx={{ textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
      >
        {t('pages.signup.heading')}
      </Typography>

      <SignUpForm onSignUp={onSignUp} />
    </AppLayoutMinimal>
  )
}
