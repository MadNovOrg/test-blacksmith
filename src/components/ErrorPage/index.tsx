import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { FallbackRender } from '@sentry/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { Logo } from '../Logo'

type Props = {
  errorData?: Parameters<FallbackRender>[0]
  debug: boolean
}

export const ErrorPage: React.FC<React.PropsWithChildren<Props>> = ({
  errorData,
  debug,
}) => {
  const { t } = useScopedTranslation('components.error-page')
  const navigate = useNavigate()

  return (
    <Container sx={{ pt: 10 }}>
      <Logo width={230} height={48} variant="full" data-testid="app-logo" />
      <Typography variant="h1" color="grey.800" mt={3}>
        {t('title')}
      </Typography>
      <Typography color="dimGrey.main" mt={3}>
        {t('message')}
      </Typography>

      <Button
        onClick={() => {
          errorData?.resetError()

          navigate('/')
        }}
        variant="contained"
        sx={{ mt: 3, mb: 3 }}
      >
        {t('back-btn-text')}
      </Button>

      {debug ? (
        <>
          <pre>Error message: {errorData?.error.message}</pre>
          <pre>{errorData?.componentStack}</pre>
        </>
      ) : null}
    </Container>
  )
}
