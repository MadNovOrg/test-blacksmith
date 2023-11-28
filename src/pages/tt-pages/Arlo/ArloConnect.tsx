import CheckCircle from '@mui/icons-material/CheckCircleOutlineRounded'
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { useFetcher } from '@app/hooks/use-fetcher'

import { ArloCallbackQuery, ArloCallbackResp } from './helpers'

const initialState = { loading: false, error: false }

export const ArloConnect: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [state, setState] = useState(initialState)
  const { loading, error } = state

  const arloCallback = useCallback(async () => {
    setState(s => ({ ...s, loading: true }))

    try {
      console.log(window.location.href, '===============')
      const { arloCallback } = await fetcher<ArloCallbackResp>(
        ArloCallbackQuery,
        { input: { url: window.location.href } }
      )

      if (!arloCallback.status) throw Error('Failed to process callback')
      setState({ loading: false, error: false })
    } catch (err) {
      console.error(err)
      setState({ loading: false, error: true })
    }

    navigate('') // clear search params
  }, [fetcher, navigate])

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.has('code')) arloCallback()
  }, [arloCallback])

  const authorizeUrl = useMemo(() => {
    const url = new URL('https://teamteach.arlo.co/oauth/connect/authorize')
    url.searchParams.set('client_id', '8NEpvtAQbljJDfxZX9V3lUsYJvqDO6F2')
    url.searchParams.set('response_type', 'code')
    url.searchParams.set(
      'scope',
      'openid profile offline_access read all_claims'
    )
    url.searchParams.set(
      'redirect_uri',
      'https://web.dev.teamteachhub.com/admin/arlo/connect'
    )
    url.searchParams.set('state', 'abc')

    return url.toString()
  }, [])

  const showConnect = !loading && !error
  const showConnected = !loading && !error

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
      <Stack gap={4} alignItems="center">
        <Typography variant="h1">{t('pages.arlo.connect-h1')}</Typography>

        {loading ? (
          <CircularProgress data-testid="ArloConnect-loading" />
        ) : null}

        {error ? (
          <Typography>{t('pages.arlo.connect-error')}</Typography>
        ) : null}

        {showConnect ? (
          <>
            <Typography variant="body1">
              {t('pages.arlo.connect-hint')}
            </Typography>
            <Button
              variant="contained"
              component={LinkBehavior}
              href={authorizeUrl}
              data-testid="ArloConnect-connect"
            >
              {t('pages.arlo.connect-btn')}
            </Button>
          </>
        ) : null}

        {showConnected ? (
          <>
            <CheckCircle
              sx={{
                fontSize: '6rem',
                color: t => t.palette.success.main,
              }}
            />
            <Typography data-testid="ArloConnect-connected">
              {t('pages.arlo.connect-done')}
            </Typography>
          </>
        ) : null}
      </Stack>
    </Container>
  )
}
