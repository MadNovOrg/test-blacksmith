import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  InputLabel,
  FormHelperText,
  Typography,
  Button,
} from '@mui/material'
import { Auth } from 'aws-amplify'
import { TFunction } from 'i18next'
import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CodeInput from 'react-otp-input-rc-17'

import { EMAIL_VERIFY_LEN, schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

export type Props = {
  onSuccess: VoidFunction
  onVerifyLater: VoidFunction
}

export type VerifyInputs = { code: string }

export const getVerifySchema = (t: TFunction) => {
  return yup.object({
    code: schemas
      .emailCode(t)
      .required(requiredMsg(t, 'pages.signup.verify-code-label')),
  })
}

export const Form: React.FC<Props> = ({ onVerifyLater, onSuccess }) => {
  const { t } = useTranslation()
  const [verifyError, setVerifyError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [reSending, setResending] = useState(false)
  const [verify, setVerify] = useState(false)

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
      await Auth.verifyCurrentUserAttributeSubmit('email', data.code)
      onSuccess()
    } catch (err: unknown) {
      const { code = 'UnknownError' } = err as Error & { code: string }
      const errors = 'pages.signup.verify-errors.'
      setVerifyError(t(`${errors}${code}`) || t(`${errors}UnknownError`))
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    setValue('code', '')
    setResending(true)
    try {
      await Auth.verifyCurrentUserAttribute('email')
      setVerify(true)
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
      {verify ? (
        <>
          <Typography sx={{ mt: 4, textAlign: 'center' }}>
            {t('pages.signup.verify-hint')}
          </Typography>

          <InputLabel sx={{ mt: 4 }}>
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
        </>
      ) : (
        <LoadingButton
          loading={reSending}
          variant="contained"
          color="primary"
          data-testid="signup-verify-now-btn"
          size="large"
          sx={{ mt: 4 }}
          onClick={handleResend}
        >
          {t('pages.signup.verify-now')}
        </LoadingButton>
      )}

      <Button
        variant="text"
        color="primary"
        data-testid="signup-verify-later-btn"
        size="large"
        sx={{ mt: 2 }}
        onClick={onVerifyLater}
      >
        {t('pages.signup.verify-later')}
      </Button>

      {verify ? (
        <Box display="flex" alignItems="center" mt={6} justifyContent="center">
          <Typography variant="body2">
            {t('pages.signup.didnt-get-mail')}
          </Typography>
          <LoadingButton
            size="small"
            loading={reSending}
            onClick={handleResend}
            data-testid="signup-verify-resend"
            sx={{ fontWeight: '600' }}
          >
            {t('pages.signup.resend')}
          </LoadingButton>
        </Box>
      ) : null}
    </Box>
  )
}
