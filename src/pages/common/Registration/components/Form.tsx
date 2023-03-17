import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  styled,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Auth } from 'aws-amplify'
import { zonedTimeToUtc } from 'date-fns-tz'
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useToggle } from 'react-use'

import PhoneNumberInput from '@app/components/PhoneNumberInput'
import { gqlRequest } from '@app/lib/gql-request'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/profile/insert-profile-temp'
import { DATE_MASK, INPUT_DATE_FORMAT } from '@app/util'

import { FormInputs, getFormSchema } from './types'

const TextField = styled(MuiTextField)(() => ({
  '& .MuiInput-root': {
    height: 40,
  },
}))

type Props = {
  onSignUp: (email: string, password: string) => void
  courseId: number | null
  quantity: number | null
}

export const Form: React.FC<React.PropsWithChildren<Props>> = ({
  onSignUp,
  courseId,
  quantity,
}) => {
  const { t } = useTranslation()
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [loading, setLoading] = useState(false)
  const [signUpError, setError] = useState('')

  const schema = useMemo(() => getFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '',
      dob: null,
    },
  })

  const values = watch()

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setError('')
    try {
      const input = {
        email: data.email,
        givenName: data.firstName,
        familyName: data.surname,
        phone: data.phone,
        dob: data.dob ? zonedTimeToUtc(data.dob, 'GMT') : null,
        acceptMarketing: data.marketing,
        acceptTnc: data.tcs,
        courseId,
        quantity,
      }

      await gqlRequest<ResponseType, ParamsType>(MUTATION, { input })

      await Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          email: data.email,
          given_name: data.firstName,
          family_name: data.surname,
        },
      })

      onSignUp(data.email, data.password)
    } catch (err) {
      console.log(err)
      const { code = 'UnknownError' } = err as Error & { code: string }
      const errors = 'pages.signup.form-errors.'
      setError(t(`${errors}${code}`) || t(`${errors}UnknownError`))
      setLoading(false)
    }
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        mt={3}
        data-testid="signup-form"
      >
        <Typography variant="body1" mb={1} fontWeight="600">
          {t('personal-details')}
        </Typography>
        <Grid container spacing={3} mb={3}>
          <Grid item md={6}>
            <TextField
              id="firstName"
              label={t('first-name')}
              variant="filled"
              placeholder={t('first-name-placeholder')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
              inputProps={{ 'data-testid': 'input-first-name' }}
              sx={{ bgcolor: 'grey.100' }}
              autoFocus
              fullWidth
              required
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              id="surname"
              label={t('surname')}
              variant="filled"
              placeholder={t('surname-placeholder')}
              error={!!errors.surname}
              helperText={errors.surname?.message}
              {...register('surname')}
              inputProps={{ 'data-testid': 'input-surname' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <TextField
            id="email"
            label={t('email')}
            variant="filled"
            placeholder={t('email-placeholder')}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            inputProps={{ 'data-testid': 'input-email' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />

          <Box display="flex" mt={1}>
            <FormControlLabel
              control={<Checkbox {...register('marketing')} />}
              label={
                <Typography variant="body2">
                  {t('marketting-label-short')}
                </Typography>
              }
            />
          </Box>
        </Box>

        <Box mb={3}>
          <TextField
            id="signup-pass"
            variant="filled"
            type={showPassword ? 'text' : 'password'}
            label={t('pages.signup.pass-label')}
            placeholder={t('pages.signup.pass-placeholder')}
            error={!!errors.password}
            helperText={errors.password?.message || ''}
            {...register('password')}
            fullWidth
            required
            inputProps={{ 'data-testid': 'input-password' }}
            sx={{ bgcolor: 'grey.100' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <PhoneNumberInput
            label={t('phone')}
            variant="filled"
            sx={{ bgcolor: 'grey.100' }}
            inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            value={values.phone}
            onChange={p =>
              setValue('phone', p as string, { shouldValidate: true })
            }
            fullWidth
            required
          />
        </Box>

        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('dob')}
                  mask={DATE_MASK}
                  inputFormat={INPUT_DATE_FORMAT}
                  value={field.value}
                  onChange={(d: Date | null) => setValue('dob', d)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="filled"
                      data-testid="dob-input"
                      fullWidth
                      sx={{ bgcolor: 'grey.100' }}
                      error={!!errors.dob}
                      helperText={errors.dob?.message}
                      required
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ my: 5 }}>
          <Box sx={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('tcs')}
                  data-testid="register-checkbox"
                  inputProps={{
                    'aria-label': `T&Cs`,
                  }}
                />
              }
              label={
                <>
                  <Typography variant="body2">
                    <Trans i18nKey="pages.signup.tcs-label">
                      I accept the
                      <a
                        href="https://www.teamteach.co.uk/policies-procedures/terms-of-business/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Terms of Business
                      </a>
                      and agree to Team Teach processing my personal data in
                      accordance with our
                      <a href="">Privacy Policy</a>
                    </Trans>
                  </Typography>
                  {errors.tcs ? (
                    <FormHelperText error>{errors.tcs.message}</FormHelperText>
                  ) : null}
                </>
              }
            />
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <LoadingButton
            loading={loading}
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
