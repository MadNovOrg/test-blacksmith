import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import { Auth } from 'aws-amplify'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import CodeInput from 'react18-input-otp'
import * as yup from 'yup'

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
  const [showPasswordReqs, setShowPasswordReqs] = useState(false)

  const handleResend = async () => {
    await Auth.forgotPassword(email)
  }

  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup.string(),
          password: yup
            .string()
            .trim()
            .required(t('validation-errors.new-password-required')),
          confirmPassword: yup
            .string()
            .trim()
            .required(t('validation-errors.confirm-password-required'))
            .oneOf(
              [yup.ref('password'), ''],
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
      setResetError(
        t(`pages.reset-password.auth-errors.${error.code}`) ||
          t(`pages.reset-password.auth-errors.UnknownError`, {
            email: data.email,
          })
      )
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
      <Logo width={80} height={80} />

      <Box mt={2} width={400} textAlign="center">
        <Typography variant="body2" gutterBottom>
          {t('pages.reset-password.title', { email })}
        </Typography>

        <Typography variant="body2">
          {t('pages.reset-password.not-received-email')}
          <Button
            sx={{
              display: 'inline',
            }}
            variant="text"
            size="small"
            onClick={handleResend}
            data-testid="resend-code"
          >
            {t('pages.reset-password.resend-code')}
          </Button>
          {t('pages.reset-password.resend-label')}
        </Typography>
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
              <Typography variant="body1" data-testid="email">
                {email}
              </Typography>
            </Box>
            <Box mb={1}>
              <TextField
                onFocus={() => setShowPasswordReqs(true)}
                id="password"
                data-testid="first-passsword-input"
                type="password"
                variant="filled"
                label={t('pages.login.pass-label')}
                placeholder={t('pages.login.pass-placeholder')}
                title={t('pages.login.pass-title')}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
                fullWidth
              />
            </Box>

            <div>
              {showPasswordReqs ? (
                <Box mb={2}>
                  <FormHelperText>
                    {t('validation-hints.pw-format')}
                  </FormHelperText>
                </Box>
              ) : null}
            </div>

            <Box mb={4}>
              <TextField
                id="confirmPassword"
                data-testid="second-passsword-input"
                type="password"
                variant="filled"
                label={t('pages.login.confirm-pass-label')}
                placeholder={t('pages.login.confirm-pass-placeholder')}
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
                data-testid="passcode"
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
                <FormHelperText
                  error
                  data-testid="reset-password-passcode-error"
                >
                  {errors.code.message}
                </FormHelperText>
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
              <FormHelperText sx={{ mt: 2 }} error data-testid="form-error">
                {resetError}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
