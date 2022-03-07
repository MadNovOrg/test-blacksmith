import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  FormHelperText,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Logo } from '@app/components/Logo'

import { useAuth } from '@app/context/auth'

type LocationState = { from: { pathname: string } }

type LoginInput = {
  email: string
  password: string
}

export const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const showResetPassMessage =
    searchParams.get('email') &&
    searchParams.get('justResetPassword') === 'true'

  const from = (location.state as LocationState)?.from?.pathname || '/'

  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup
            .string()
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

  const onSubmit = useCallback(
    async (data: LoginInput) => {
      setIsLoading(true)
      setLoginError(null)

      const { error } = await auth.login(data.email, data.password)

      if (!error) {
        return navigate(from, { replace: true })
      }

      setIsLoading(false)
      setLoginError(
        t(`pages.login.auth-errors.${error.code}`) ||
          t(`pages.login.auth-errors.UnknownError`)
      )
    },
    [auth, from, navigate, t]
  )

  return (
    <Box
      bgcolor="grey.200"
      width="100%"
      height="100%"
      p={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Logo size={80} />

      <Box
        mt={5}
        bgcolor="common.white"
        py={5}
        px={10}
        borderRadius={2}
        width={500}
        textAlign="center"
      >
        {showResetPassMessage ? (
          <Typography variant="body2">{t('pages.login.reset-pass')}</Typography>
        ) : null}

        <Typography variant="h6" fontWeight="600" color="grey.800">
          Log in to Team Teach
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
                variant="standard"
                label={t('pages.login.email-label')}
                placeholder={t('pages.login.email-placeholder')}
                title={t('pages.login.email-title')}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
                fullWidth
                inputProps={{ 'data-testid': 'input-email' }}
              />
            </Box>
            <Box mb={4}>
              <TextField
                id="password"
                type="password"
                variant="standard"
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
            >
              {t('pages.login.submit-label')}
            </LoadingButton>

            {loginError && (
              <FormHelperText sx={{ mt: 2 }} error data-testid="login-error">
                {loginError}
              </FormHelperText>
            )}

            <Button
              variant="text"
              color="primary"
              size="large"
              sx={{ mt: 4, fontWeight: '600' }}
            >
              {t('pages.login.sign-up-message')}
            </Button>
          </Box>
        </Box>

        <Box mt={8}>
          <Link
            href="/forgot-password"
            variant="subtitle1"
            fontWeight="600"
            color="primary.main"
            data-testid="forgot-password-link"
          >
            {t('pages.login.forgot-label')}
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
