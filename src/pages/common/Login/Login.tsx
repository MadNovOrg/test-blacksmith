import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Alert,
  FormHelperText,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import * as yup from 'yup'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'

type LocationState = { from: { pathname: string; search: string } }

export type LoginInput = {
  email: string
  password: string
}

export const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const { t } = useTranslation()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const showResetPassMessage =
    searchParams.get('email') &&
    searchParams.get('justResetPassword') === 'true'

  const passwordResent = searchParams.get('passwordResent')
  const invitationDeclined = searchParams.get('invitationDeclined')
  const callbackUrl = searchParams.get('callbackUrl')

  const from = (location.state as LocationState)?.from || {}

  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup
            .string()
            .transform(currentValue => currentValue.trim())
            .email(t('validation-errors.email-invalid'))
            .required(t('validation-errors.email-required')),
          password: yup
            .string()
            .required(t('validation-errors.password-required')),
        })
        .required(),
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setLoginError(null)

    const { user, error } = await auth.login(data.email, data.password)

    if (!error) {
      const to = `${from.pathname || '/'}${from.search || ''}`
      // https://github.com/aws-amplify/amplify-js/issues/3733
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
        return navigate({
          pathname: '/change-password',
          search: `?${createSearchParams({
            email: data.email,
          })}`,
        })
      }
      if (callbackUrl !== null) {
        window.location.replace(callbackUrl)
        return
      }
      return navigate(to, { replace: true })
    }

    setIsLoading(false)
    setLoginError(
      t(`pages.login.auth-errors.${error.code}`) ||
        t(`pages.login.auth-errors.UnknownError`)
    )
  }

  return (
    <AppLayoutMinimal>
      {showResetPassMessage ? (
        <Alert variant="outlined" severity="info" sx={{ mb: 2 }}>
          {t('pages.login.reset-pass')}
        </Alert>
      ) : null}

      {passwordResent ? (
        <Alert variant="outlined" severity="success" sx={{ mb: 2 }}>
          {t('pages.login.password-resent')}
        </Alert>
      ) : null}

      {invitationDeclined ? (
        <Alert variant="outlined" severity="success" sx={{ mb: 2 }}>
          {t('pages.login.invitation-declined')}
        </Alert>
      ) : null}

      <Typography
        variant="h3"
        sx={{ textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
      >
        {t('pages.login.login-in-tt')}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="LoginForm"
        noValidate
        autoComplete="off"
        sx={{ mt: 4 }}
      >
        <Box component="section">
          <Box mb={4}>
            <TextField
              id="email"
              variant="filled"
              label={t('pages.login.email-label')}
              placeholder={t('pages.login.email-placeholder')}
              title={t('pages.login.email-title')}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
              autoFocus
              fullWidth
              inputProps={{ 'data-testid': 'input-email' }}
            />
          </Box>
          <Box mb={4}>
            <TextField
              id="password"
              type="password"
              variant="filled"
              label={t('pages.login.pass-label')}
              placeholder={t('pages.login.pass-placeholder')}
              title={t('pages.login.pass-title')}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
              fullWidth
              inputProps={{ 'data-testid': 'input-password' }}
            />
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="login-submit"
            size="large"
            fullWidth={isMobile}
          >
            {t('pages.login.submit-label')}
          </LoadingButton>

          {loginError && (
            <FormHelperText sx={{ mt: 2 }} error data-testid="login-error">
              {loginError}
            </FormHelperText>
          )}

          <Link
            href="/registration"
            component={LinkBehavior}
            state={from ? { from } : undefined}
            data-testid="sign-up-link"
            sx={{ mt: 4, color: 'primary.main', fontWeight: '600' }}
          >
            {t('pages.login.sign-up-message')}
          </Link>
        </Box>
      </Box>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Link
          href="/forgot-password"
          data-testid="forgot-password-link"
          sx={{ color: 'primary.main', fontWeight: '600' }}
        >
          {t('pages.login.forgot-label')}
        </Link>
      </Box>
    </AppLayoutMinimal>
  )
}
