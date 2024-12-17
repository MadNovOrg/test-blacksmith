import CheckCircle from '@mui/icons-material/CheckCircleOutlineRounded'
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { LinkBehavior } from '@app/components/LinkBehavior'
import {
  ArloCallbackMutation,
  ArloCallbackMutationVariables,
} from '@app/generated/graphql'

import { ARLO_CONNECT_MUTATION } from '../utils/helpers'

export const ArloConnect: FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [{ error, fetching: loading }, getArloConnectionCallback] = useMutation<
    ArloCallbackMutation,
    ArloCallbackMutationVariables
  >(ARLO_CONNECT_MUTATION)

  const arloCallback = useCallback(async () => {
    console.log(window.location.href, '===============')
    const { data } = await getArloConnectionCallback({
      input: { url: window.location.href },
    })

    if (!data?.arloCallback?.status) throw Error('Failed to process callback')

    navigate('')
  }, [getArloConnectionCallback, navigate])

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
      'openid profile offline_access read all_claims',
    )
    url.searchParams.set(
      'redirect_uri',
      'https://web.dev.teamteachhub.com/admin/arlo/connect',
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
