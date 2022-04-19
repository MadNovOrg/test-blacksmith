import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  TextField as MuiTextField,
  FormHelperText,
  Checkbox,
  Typography,
  Grid,
  styled,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Auth } from 'aws-amplify'
import { format } from 'date-fns'
import { map } from 'lodash-es'
import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useToggle } from 'react-use'

import { OrgSelector } from '@app/components/OrgSelector'
import { gqlRequest } from '@app/lib/gql-request'
import {
  MUTATION,
  ResponseType,
  ParamsType,
} from '@app/queries/profile/insert-profile-temp'

import { FormProps, FormInputs, getFormSchema } from '../helpers'

import { positions, sectors } from './org-data'

const TextField = styled(MuiTextField)(() => ({
  '& .MuiInput-root': {
    height: 40,
  },
}))

export const Form: React.FC<FormProps> = ({ onSignUp, courseId }) => {
  const { t } = useTranslation()
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [isLoading, setLoading] = useState(false)
  const [signUpError, setError] = useState('')

  const schema = useMemo(() => getFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: '+44',
      orgId: '',
      sector: '',
      position: '',
      otherPosition: '',
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
        dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
        acceptMarketing: data.marketing,
        acceptTnc: data.tcs,
        sector: data.sector,
        jobTitle: `${data.position}-${data.otherPosition}`,
        courseId,
        organizationId: data.orgId,
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
    }

    setLoading(false)
  }

  const sectorOptions = useMemo(
    () =>
      map(sectors, (label, value) => ({
        label,
        value,
      })),
    []
  )

  const positionOptions = values.sector ? positions[values.sector] : []

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        mt={3}
      >
        <Typography variant="body1" mb={1} fontWeight="600">
          {t('personal-details')}
        </Typography>
        <Grid container spacing={3} mb={3}>
          <Grid item md={6}>
            <TextField
              id="firstName"
              label={t('first-name')}
              variant="standard"
              placeholder={t('first-name-placeholder')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
              inputProps={{ 'data-testid': 'input-first-name' }}
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              id="surname"
              label={t('surname')}
              variant="standard"
              placeholder={t('surname-placeholder')}
              error={!!errors.surname}
              helperText={errors.surname?.message}
              {...register('surname')}
              inputProps={{ 'data-testid': 'input-surname' }}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <TextField
            id="email"
            label={t('email')}
            variant="standard"
            placeholder={t('email-placeholder')}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            inputProps={{ 'data-testid': 'input-email' }}
            fullWidth
          />

          <Box display="flex" mt={1}>
            <Box sx={{ flex: 'auto', transform: 'translate(-12px, -8px)' }}>
              <Checkbox {...register('marketing')} sx={{ pr: 0 }} />
            </Box>
            <Typography variant="body2">
              {t('marketting-label-short')}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item md={3}>
            <TextField
              id="country-code"
              label={t('country-code')}
              variant="standard"
              placeholder={t('country-code-placeholder')}
              {...register('countryCode')}
              inputProps={{ 'data-testid': 'input-country-code' }}
              sx={{ minWidth: 100 }}
              fullWidth
            />
          </Grid>
          <Grid item md={9}>
            <TextField
              id="phone"
              label={t('phone')}
              variant="standard"
              placeholder={t('phone-placeholder')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone')}
              inputProps={{ 'data-testid': 'input-phone' }}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <TextField
            id="signup-pass"
            variant="standard"
            type={showPassword ? 'text' : 'password'}
            label={t('pages.signup.pass-label')}
            placeholder={t('pages.signup.pass-placeholder')}
            error={!!errors.password}
            helperText={errors.password?.message || ''}
            {...register('password')}
            fullWidth
            inputProps={{ 'data-testid': 'input-pass' }}
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

        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="dd/MM/yyyy"
              value={values.dob}
              onChange={(d: Date | null) => setValue('dob', d)}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('dob-optional')}
                  variant="standard"
                  inputProps={{ 'data-testid': 'input-dob' }}
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Typography variant="body1" mt={3} mb={1} fontWeight="600">
          {t('org-details')}
        </Typography>

        <Box mb={3}>
          <OrgSelector
            allowAdding
            onChange={value => {
              setValue('orgId', value, { shouldValidate: true })
            }}
            textFieldProps={{ variant: 'standard' }}
            sx={{ marginBottom: 2 }}
            error={errors.orgId?.message}
          />
        </Box>

        <Box mb={3}>
          <TextField
            select
            value={values.sector}
            {...register('sector')}
            variant="standard"
            fullWidth
            label={t('sector')}
            error={!!errors.sector}
          >
            <MenuItem value="" disabled>
              {t('sector')}
            </MenuItem>
            {sectorOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {errors.sector ? (
            <FormHelperText>{errors.sector?.message}</FormHelperText>
          ) : null}
        </Box>

        <Box mb={3}>
          <TextField
            select
            value={values.position}
            {...register('position')}
            variant="standard"
            fullWidth
            label={t('position')}
            error={!!errors.position}
          >
            <MenuItem value="" disabled>
              {positionOptions.length ? t('position') : t('select-sector')}
            </MenuItem>
            {positionOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            {positionOptions.length ? (
              <MenuItem value="other">{t('other')}</MenuItem>
            ) : null}
          </TextField>
          {errors.sector ? (
            <FormHelperText>{errors.sector?.message}</FormHelperText>
          ) : null}

          <Box mt={1}>
            {values.position === 'other' ? (
              <TextField
                id="other-position"
                variant="standard"
                label={t('position')}
                placeholder={t('position-placeholder')}
                error={!!errors.otherPosition}
                helperText={errors.otherPosition?.message || ''}
                {...register('otherPosition')}
                fullWidth
                inputProps={{ 'data-testid': 'other-position-input' }}
              />
            ) : null}
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
