import CheckCircle from '@mui/icons-material/CheckCircleOutlineRounded'
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useFetcher } from '@app/hooks/use-fetcher'

import {
  XeroConnectQuery,
  XeroConnectResp,
  XeroCallbackQuery,
  XeroCallbackResp,
} from './helpers'

const initialState = { loading: true, consentUrl: '', error: false }

export const XeroConnect: React.FC = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [state, setState] = useState(initialState)
  const { loading, error, consentUrl } = state

  const xeroConsent = useCallback(async () => {
    setState(s => ({ ...s, loading: true }))
    try {
      const r = await fetcher<XeroConnectResp>(XeroConnectQuery)
      const { consentUrl = '' } = r.xeroConnect
      setState({ loading: false, consentUrl, error: false })
    } catch (err) {
      console.error(err)
      setState({ loading: false, consentUrl: '', error: true })
    }
  }, [fetcher])

  const xeroCallback = useCallback(async () => {
    setState(s => ({ ...s, loading: true }))

    try {
      const { status } = await fetcher<XeroCallbackResp>(XeroCallbackQuery, {
        input: { url: window.location.href },
      })
      if (!status) throw Error('Failed to process callback')
      setState({ loading: false, consentUrl: '', error: false })
    } catch (err) {
      console.error(err)
      setState({ loading: false, consentUrl: '', error: true })
    }

    navigate('') // clear search params
  }, [fetcher, navigate])

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    sp.has('code') ? xeroCallback() : xeroConsent()
  }, [xeroConsent, xeroCallback])

  const connectToXero = useCallback(() => {
    if (consentUrl) {
      window.location.href = consentUrl
    }
  }, [consentUrl])

  const showConnect = !loading && !error && consentUrl
  const showConnected = !loading && !error && !consentUrl

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
      <Stack gap={4} alignItems="center">
        <Typography variant="h1">{t('pages.xero.connect-h1')}</Typography>

        {loading ? (
          <CircularProgress data-testid="XeroConnect-loading" />
        ) : null}

        {error ? (
          <Typography>{t('pages.xero.connect-error')}</Typography>
        ) : null}

        {showConnect ? (
          <>
            <Typography variant="body1">
              {t('pages.xero.connect-hint')}
            </Typography>
            <Button
              variant="contained"
              onClick={connectToXero}
              data-testid="XeroConnect-connect"
            >
              {t('pages.xero.connect-btn')}
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
            <Typography data-testid="XeroConnect-connected">
              {t('pages.xero.connect-done')}
            </Typography>
          </>
        ) : null}
      </Stack>
    </Container>
  )
}
