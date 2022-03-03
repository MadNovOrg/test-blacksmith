import React, { useState, useMemo } from 'react'
import { Auth } from 'aws-amplify'
import {
  createSearchParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  TextField,
  Typography,
  FormHelperText,
  InputLabel,
  Link,
  Button,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CodeInput from 'react-otp-input-rc-17'

import { Logo } from '@app/components/Logo'

type ResetPassInput = {
  email: string
  password: string
  confirmPassword: string
  code: string
}

type E = {
  code: string
  message: string
}

const otpNumFields = 6

export const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const email = searchParams.get('email') ?? ''
  const code = searchParams.get('confirmation_code') ?? ''

  const [resetError, setResetError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setResent(true)
    await Auth.forgotPassword(email)
  }

  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup.string(),
          password: yup
            .string()
            .required(t('validation-errors.new-password-required')),
          confirmPassword: yup
            .string()
            .required(t('validation-errors.confirm-password-required'))
            .oneOf(
              [yup.ref('password'), null],
              t('validation-errors.confirm-password-invalid')
            ),
          code: yup
            .string()
            .min(6, t('validation-errors.otp-required'))
            .required(t('validation-errors.otp-required')),
        })
        .required(),
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResetPassInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      email,
      password: '',
      confirmPassword: '',
      code,
    },
  })

  const onSubmit = async (data: ResetPassInput) => {
    setIsLoading(true)

    try {
      await Auth.forgotPasswordSubmit(data.email, data.code, data.password)

      navigate({
        pathname: 'login',
        search: `?${createSearchParams({
          email: data.email,
          justResetPassword: 'true',
        })}`,
      })
    } catch (err: unknown) {
      setIsLoading(false)
      const error = err as E
      setResetError(t(`pages.reset-password.auth-errors.${error.code}`))
    }
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

      <Box mt={2} width={400} textAlign="center">
        <Typography variant="body2" gutterBottom>
          {t('pages.reset-password.title')}
        </Typography>

        {!resent ? (
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {t('pages.reset-password.not-recieved-email')}
            <Button
              variant="text"
              size="small"
              onClick={handleResend}
              data-testid="resend-code"
            >
              {t('pages.reset-password.resend-code')}
            </Button>
          </Typography>
        ) : (
          <Typography variant="body2">
            {t('pages.reset-password.not-recieved-email')}&nbsp;
            <Link
              href={`/contacted-confirmation?${createSearchParams({ email })}`}
              data-testid="contact-us-link"
            >
              {t('pages.reset-password.please-contact')}
            </Link>
          </Typography>
        )}
      </Box>

      <Box
        mt={5}
        bgcolor="common.white"
        py={5}
        px={10}
        borderRadius={2}
        width={500}
        textAlign="center"
      >
        <Typography variant="h6" fontWeight="600" color="grey.800">
          Reset password
        </Typography>

        <Box
          sx={{ mt: 4 }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          data-testid="LoginForm"
          noValidate
          autoComplete="off"
        >
          <Box component="section">
            <Box mb={4}>
              <Typography variant="body2" gutterBottom>
                Changing password for:
              </Typography>
              <Typography variant="body1">{email}</Typography>
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
              />
            </Box>

            <Box mb={4}>
              <TextField
                id="confirmPassword"
                type="password"
                variant="standard"
                label={t('pages.login.pass-label')}
                placeholder={t('pages.login.pass-placeholder')}
                title={t('pages.login.pass-title')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                fullWidth
              />
            </Box>

            <Box
              mb={4}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <InputLabel shrink>Enter passcode</InputLabel>
              <CodeInput
                numInputs={otpNumFields}
                value={watch('code')}
                onChange={(c: string) => setValue('code', c)}
                inputStyle={{
                  border: 0,
                  outline: 'none',
                  borderBottom: '1px solid navy',
                  marginRight: 10,
                  width: 30,
                  textAlign: 'center',
                  fontSize: 25,
                }}
              />
              {!!errors.code && (
                <FormHelperText error>{errors.code.message}</FormHelperText>
              )}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
              color="primary"
              data-testid="reset-password"
              size="large"
            >
              {t('pages.reset-password.reset')}
            </LoadingButton>

            {resetError && (
              <FormHelperText sx={{ mt: 2 }} error>
                {resetError}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
