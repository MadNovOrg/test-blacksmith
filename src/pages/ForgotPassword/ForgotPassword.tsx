import React, { useMemo, useState } from 'react'
import { Auth } from 'aws-amplify'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Link, Box, Button, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Logo } from '@app/components/Logo'

type ForgotPasswordInput = {
  email: string
}

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup
            .string()
            .email(t('validation-errors.email-invalid'))
            .required(t('validation-errors.email-required')),
        })
        .required(),
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)

    try {
      // tell cognito to send either email or sms with pw reset code and link to reset form
      await Auth.forgotPassword(data.email)
    } catch (err: unknown) {
      setIsLoading(false)
    }

    navigate({
      pathname: '/reset-password',
      search: `?${createSearchParams({ email: data.email })}`,
    })
  }

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
        <Typography variant="h6" fontWeight="600" color="grey.800" gutterBottom>
          Reset password
        </Typography>

        <Typography variant="body2">
          {t('pages.forgot-password.title')}
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
                label={t('pages.forgot-password.email-address')}
                placeholder={t('pages.forgot-password.email-placeholder')}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
                fullWidth
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
      </Box>
    </Box>
  )
}
