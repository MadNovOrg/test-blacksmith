import { Typography, Box, useTheme, useMediaQuery } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'

import { Form } from './components/Form'

export const AutoRegisterPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { profile } = useAuth()
  const { t } = useTranslation()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const continueUrl = searchParams.get('continue')

  const handleSuccess = () => {
    navigate(`/auto-login?token=${token}&continue=${continueUrl}`, {
      replace: true,
    })
  }

  if (profile || !token) return <SuspenseLoading />

  return (
    <AppLayoutMinimal width={628}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h3"
          fontWeight="600"
          color="secondary"
          mb={1}
          align={isMobile ? 'center' : 'left'}
        >
          {t('create-free-account')}
        </Typography>
      </Box>

      <Form onSuccess={handleSuccess} token={token} />
    </AppLayoutMinimal>
  )
}
