import CheckCircle from '@mui/icons-material/CheckCircleOutlineRounded'
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import {
  XeroCallbackMutation,
  XeroCallbackMutationVariables,
  XeroConnectQuery,
} from '@app/generated/graphql'

import { XERO_CONNECT_QUERY, XERO_CONNECT_MUTATION } from './helpers'

export const XeroConnect: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [
    {
      data: xeroConnectionStatus,
      fetching: xeroConnectionStatusLoading,
      error: xeroConnectionStatusError,
    },
    refetchXeroConnection,
  ] = useQuery<XeroConnectQuery>({
    query: XERO_CONNECT_QUERY,
    requestPolicy: 'network-only',
  })
  const [{ error: xeroConnectError }, xeroConnect] = useMutation<
    XeroCallbackMutation,
    XeroCallbackMutationVariables
  >(XERO_CONNECT_MUTATION)

  const consentUrl = useMemo(
    () => xeroConnectionStatus?.xeroConnect?.consentUrl,
    [xeroConnectionStatus?.xeroConnect?.consentUrl]
  )
  const xeroCallback = useCallback(async () => {
    const { data: xeroCallback } = await xeroConnect({
      input: { url: window.location.href },
    })

    if (!xeroCallback?.xeroCallback?.status)
      throw Error('Failed to process callback')

    navigate('') // clear search params
  }, [xeroConnect, navigate])

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    sp.has('code') ? xeroCallback() : refetchXeroConnection()
  }, [refetchXeroConnection, xeroCallback])

  const connectToXero = useCallback(() => {
    if (consentUrl) {
      window.location.href = consentUrl
    }
  }, [consentUrl])

  const showConnect =
    !xeroConnectionStatusLoading && !xeroConnectionStatusError && consentUrl
  const showConnected =
    !xeroConnectionStatusLoading && !xeroConnectionStatusError && !consentUrl

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
      <Stack gap={4} alignItems="center">
        <Typography variant="h1">{t('pages.xero.connect-h1')}</Typography>

        {xeroConnectionStatusLoading ? (
          <CircularProgress data-testid="XeroConnect-loading" />
        ) : null}

        {xeroConnectError ? (
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
