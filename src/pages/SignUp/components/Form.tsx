import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  TextField,
  FormHelperText,
  Checkbox,
  Typography,
} from '@mui/material'
import { Auth } from 'aws-amplify'
import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormProps, FormInputs, getFormSchema } from '../helpers'

export const SignUpForm: React.FC<FormProps> = ({ onSignUp }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [signUpError, setSignUpError] = useState('')

  const schema = useMemo(() => getFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true)
    setSignUpError('')

    try {
      const resp = await Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          // Attributes must be sent as strings. See https://github.com/aws-amplify/amplify-js/issues/5978#issuecomment-638000614
          email: data.email,
          given_name: data.givenName,
          family_name: data.familyName,
          'custom:accept_marketing': data.marketing ? '1' : '0',
          'custom:accept_tcs': data.tcs ? '1' : '0',
        },
      })

      onSignUp({
        username: data.email,
        userSub: resp.userSub,
        confirmed: resp.userConfirmed,
      })
    } catch (err) {
      const { code = 'UnknownError' } = err as Error & { code: string }
      const errors = 'pages.signup.form-errors.'
      setSignUpError(t(`${errors}${code}`) || t(`${errors}UnknownError`))
    }

    setIsLoading(false)
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        sx={{ mt: 4, '> * + *': { mt: 2 } }}
      >
        <Box>
          <TextField
            id="signup-email"
            variant="standard"
            label={t('pages.signup.email-label')}
            placeholder={t('pages.signup.email-placeholder')}
            error={!!errors.email}
            helperText={errors.email?.message || ''}
            {...register('email')}
            fullWidth
            autoFocus
            inputProps={{ 'data-testid': 'signup-email-input' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            id="signup-givenName"
            variant="standard"
            label={t('pages.signup.givenName-label')}
            placeholder={t('pages.signup.givenName-placeholder')}
            error={!!errors.givenName}
            helperText={errors.givenName?.message || ''}
            {...register('givenName')}
            fullWidth
            inputProps={{ 'data-testid': 'signup-givenName-input' }}
          />
          <TextField
            id="signup-familyName"
            variant="standard"
            label={t('pages.signup.familyName-label')}
            placeholder={t('pages.signup.familyName-placeholder')}
            error={!!errors.familyName}
            helperText={errors.familyName?.message || ''}
            {...register('familyName')}
            fullWidth
            inputProps={{ 'data-testid': 'signup-familyName-input' }}
          />
        </Box>

        <Box>
          <TextField
            id="signup-pass"
            variant="standard"
            type="password"
            label={t('pages.signup.pass-label')}
            placeholder={t('pages.signup.pass-placeholder')}
            error={!!errors.password}
            helperText={errors.password?.message || ''}
            {...register('password')}
            fullWidth
            inputProps={{ 'data-testid': 'signup-pass-input' }}
          />
        </Box>

        <Box>
          <TextField
            id="signup-confirmPassword"
            variant="standard"
            type="password"
            label={t('pages.signup.confirmPassword-label')}
            placeholder={t('pages.signup.confirmPassword-placeholder')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message || ''}
            {...register('confirmPassword')}
            fullWidth
            inputProps={{ 'data-testid': 'signup-passconf-input' }}
          />
        </Box>

        <Box sx={{ my: 5 }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            {t('pages.signup.marketing-title')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 'auto', transform: 'translate(-12px, -8px)' }}>
              <Checkbox {...register('marketing')} sx={{ paddingRight: 0 }} />
            </Box>
            <Box>
              <Typography variant="body2">
                {t('pages.signup.marketing-label')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.700', mt: 1 }}>
                {t('pages.signup.marketing-hint')}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ my: 5 }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            {t('pages.signup.tcs-title')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 'auto', transform: 'translate(-12px, -8px)' }}>
              <Checkbox
                {...register('tcs')}
                sx={{ paddingRight: 0 }}
                inputProps={{ 'aria-label': `T&Cs` }}
              />
            </Box>
            <Box>
              <Typography variant="body2">
                {t('pages.signup.tcs-label')}
              </Typography>
              {errors.tcs ? (
                <FormHelperText error>{errors.tcs.message}</FormHelperText>
              ) : null}
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="signup-form-btn"
            size="large"
          >
            {t('pages.signup.submit-btn')}
          </LoadingButton>

          {signUpError ? (
            <FormHelperText
              sx={{ mt: 2 }}
              error
              data-testid="signup-form-error"
            >
              {signUpError}
            </FormHelperText>
          ) : null}
        </Box>
      </Box>
    </>
  )
}
