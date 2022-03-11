import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Box, InputLabel, FormHelperText, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import CodeInput from 'react-otp-input-rc-17'
import { useTranslation } from 'react-i18next'
import { Auth } from 'aws-amplify'
import { yupResolver } from '@hookform/resolvers/yup'

import { VerifyProps, VerifyInputs, getVerifySchema } from '../helpers'

import { EMAIL_VERIFY_LEN } from '@app/schemas'

export const SignUpVerify: React.FC<VerifyProps> = ({
  username,
  onVerified,
}) => {
  const { t } = useTranslation()
  const [verifyError, setVerifyError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const schema = useMemo(() => getVerifySchema(t), [t])

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VerifyInputs>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: VerifyInputs) => {
    setIsLoading(true)
    setVerifyError('')

    try {
      await Auth.confirmSignUp(username, data.code)
      onVerified()
    } catch (err: unknown) {
      const { code = 'UnknownError' } = err as Error & { code: string }
      const errors = 'pages.signup.verify-errors.'
      setVerifyError(t(`${errors}${code}`) || t(`${errors}UnknownError`))
    }

    setIsLoading(false)
  }

  const [reSending, setResending] = useState(false)
  const handleResend = async () => {
    setResending(true)
    try {
      await Auth.resendSignUp(username)
    } catch (err) {
      console.error((err as Error).message)
    }
    setResending(false)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography sx={{ mt: 4 }}>{t('pages.signup.verify-hint')}</Typography>

      <InputLabel sx={{ mt: 4, fontSize: 12 }}>
        {t('pages.signup.verify-code-label')}
      </InputLabel>

      <CodeInput
        shouldAutoFocus
        numInputs={EMAIL_VERIFY_LEN}
        isInputNum
        value={watch('code')}
        onChange={(c: string) => setValue('code', c)}
        data-testid="signup-verify-code"
        containerStyle={{ gap: '10px' }}
        inputStyle={{
          border: 0,
          outline: 'none',
          borderBottom: '1px solid navy',
          width: 30,
          fontSize: 25,
        }}
      />

      {!!errors.code || verifyError ? (
        <FormHelperText error data-testid="signup-verify-error">
          {errors?.code?.message || verifyError}
        </FormHelperText>
      ) : null}

      <LoadingButton
        loading={isLoading}
        type="submit"
        variant="contained"
        color="primary"
        data-testid="signup-verify-btn"
        size="large"
        sx={{ mt: 4 }}
      >
        {t('pages.signup.verify-btn')}
      </LoadingButton>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <LoadingButton
          size="small"
          sx={{ mt: 2 }}
          loading={reSending}
          onClick={handleResend}
          data-testid="signup-verify-resend"
        >
          {t('pages.signup.verify-resend-btn')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
