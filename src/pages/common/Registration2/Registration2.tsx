import { Typography, Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'

import { Form } from './components/Form'

export const Registration2Page: React.FC = () => {
  const { profile } = useAuth()
  const { t } = useTranslation()

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
        <Typography variant="h3" fontWeight="600" color="secondary" mb={1}>
          {t('create-free-account')}
        </Typography>
      </Box>

      <Form onSuccess={handleSuccess} token={token} />
    </AppLayoutMinimal>
  )
}
