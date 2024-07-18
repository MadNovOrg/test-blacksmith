import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import React, { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { ResendPasswordMutation } from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { gqlRequest } from '@app/lib/gql-request'
import { RESEND_PASSWORD_MUTATION } from '@app/queries/user-queries/resend-password'
import { schemas, yup } from '@app/schemas'

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const schema = useMemo(
    () =>
      yup.object({
        email: schemas.email(t).required(t('validation-errors.email-required')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = async data => {
    setIsLoading(true)
    setError(false)

    try {
      // tell cognito to send either email or sms with pw reset code and link to reset form
      await Auth.forgotPassword(data.email)
      navigate({
        pathname: '/reset-password',
        search: `?${createSearchParams({ email: data.email })}`,
      })
    } catch (err: unknown) {
      // user cannot reset password via amplify in some cases (temporary password not changed)
      // so we use backend API to do it
      const result = await gqlRequest<ResendPasswordMutation>(
        RESEND_PASSWORD_MUTATION,
        { email: data.email },
      )
      if (result?.resendPassword) {
        navigate('/login?passwordResent=true')
      } else {
        setIsLoading(false)
        setError(true)
      }
    }
  }

  return (
    <AppLayoutMinimal>
      <Typography
        variant="h3"
        sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: 'grey.800' }}
      >
        {t('pages.forgot-password.title')}
      </Typography>

      <Typography variant="body2">
        {t('pages.forgot-password.subtitle')}
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t('pages.forgot-password.generic-error', {
            email: getValues('email'),
          })}
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
              id="email"
              variant="filled"
              label={t('pages.forgot-password.email-address')}
              placeholder={t('pages.forgot-password.email-placeholder')}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
              fullWidth
              inputProps={{ 'data-testid': 'forgot-email-input' }}
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
