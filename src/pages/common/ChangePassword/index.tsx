import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

type ChangePasswordInput = {
  email: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const ChangePasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const email = searchParams.get('email')
  const forced = Boolean(searchParams.get('forced'))

  const schema = useMemo(
    () =>
      yup.object({
        oldPassword: yup
          .string()
          .required(requiredMsg(t, 'common.old-password')),
        newPassword: schemas
          .password(t)
          .required(requiredMsg(t, 'common.new-password')),
        confirmPassword: schemas
          .password(t)
          .required(requiredMsg(t, 'common.confirm-password'))
          .oneOf([yup.ref('newPassword')], t('common.password-do-not-match')),
      }),
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true)

    if (!email) {
      navigate('login')
    } else {
      try {
        const user = await Auth.signIn(email, data.oldPassword)
        await Auth.completeNewPassword(user, data.newPassword)
        navigate({
          pathname: 'login',
          search: `?${createSearchParams({
            email,
            justResetPassword: 'true',
          })}`,
        })
      } catch (err: unknown) {
        setIsLoading(false)
        setErrorMessage((err as Error).message)
      }
    }
  }

  useEffect(() => {
    if (!email) {
      return navigate('/login')
    }
  }, [email, navigate])

  return (
    <AppLayoutMinimal>
      <Typography
        variant="h3"
        sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
      >
        {t(`pages.change-password.title.${forced ? 'forced' : 'standard'}`)}
      </Typography>

      {forced ? (
        <Typography variant="body2">
          {t('pages.change-password.subtitle.forced')}
        </Typography>
      ) : null}

      {errorMessage ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        sx={{ mt: 4 }}
      >
        <Box component="section">
          <Box mb={4}>
            <TextField
              variant="filled"
              type="password"
              label={t('common.old-password')}
              placeholder={t('common.old-password')}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
              {...register('oldPassword')}
              fullWidth
              inputProps={{ 'data-testid': 'old-password-input' }}
            />
          </Box>
          <Box mb={4}>
            <TextField
              variant="filled"
              type="password"
              label={t('common.new-password')}
              placeholder={t('common.new-password')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              {...register('newPassword')}
              fullWidth
              inputProps={{ 'data-testid': 'new-password-input' }}
            />
          </Box>
          <Box mb={4}>
            <TextField
              variant="filled"
              type="password"
              label={t('common.confirm-password')}
              placeholder={t('common.confirm-password')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              fullWidth
              inputProps={{ 'data-testid': 'confirm-password-input' }}
            />
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
              color="primary"
              data-testid="forgot-pass-submit"
              size="large"
            >
              {t('submit')}
            </LoadingButton>

            <Link
              component={Button}
              color="primary"
              size="large"
              sx={{ mt: 4 }}
              href="/login"
              data-testid="cancel-link"
            >
              {t('cancel')}
            </Link>
          </Box>
        </Box>
      </Box>
    </AppLayoutMinimal>
  )
}
