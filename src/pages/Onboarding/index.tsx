import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import MuiPhoneNumber from 'material-ui-phone-number'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'
import { InferType } from 'yup'

import { useAuth } from '@app/context/auth'
import {
  OnboardUserMutation,
  OnboardUserMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'
import { requiredMsg, DATE_MASK, INPUT_DATE_FORMAT } from '@app/util'

import { ONBOARD_USER } from './queries'

const onlyCountries = ['au', 'gb']

export const Onboarding: React.FC = () => {
  const { t, _t } = useScopedTranslation('pages.onboarding')
  const { profile, reloadCurrentProfile } = useAuth()
  const navigate = useNavigate()

  const schema = yup.object({
    givenName: yup.string().required(requiredMsg(_t, 'first-name')),
    familyName: yup.string().required(requiredMsg(_t, 'surname')),
    phone: yup.string().required(requiredMsg(_t, 'phone')),
    dob: yup
      .date()
      .typeError(t('validation-errors.invalid-date-optional'))
      .nullable(),
    tcs: yup.boolean().oneOf([true], t('tcs-required')),
  })

  const { register, handleSubmit, formState, watch, setValue, control } =
    useForm<InferType<typeof schema>>({
      resolver: yupResolver(schema),
    })

  const [{ data: onboardedUser, fetching, error }, onboardUser] = useMutation<
    OnboardUserMutation,
    OnboardUserMutationVariables
  >(ONBOARD_USER)

  useEffect(() => {
    if (onboardedUser?.update_profile_by_pk?.id) {
      reloadCurrentProfile().then(() => {
        navigate('/')
      })
    }
  }, [onboardedUser, reloadCurrentProfile, navigate])

  const submitHandler: SubmitHandler<InferType<typeof schema>> = async data => {
    onboardUser({
      id: profile?.id,
      input: {
        familyName: data.familyName,
        givenName: data.givenName,
        dob: data.dob,
        phone: data.phone,
      },
    })
  }

  const errors = formState.errors
  const values = watch()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3" fontWeight="600" color="secondary" mb={1}>
        {t('title')}
      </Typography>

      {error ? (
        <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
          {t('error-saving')}
        </Alert>
      ) : null}

      <Box
        component="form"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        mt={3}
        data-testid="onboarding-form"
      >
        <Typography variant="body1" mb={1} fontWeight="600">
          {t('personal-details')}
        </Typography>
        <Grid container spacing={3} mb={3}>
          <Grid item md={6}>
            <TextField
              id="firstName"
              label={_t('first-name')}
              variant="standard"
              placeholder={_t('first-name-placeholder')}
              error={Boolean(errors.givenName)}
              helperText={errors.givenName?.message}
              {...register('givenName')}
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
              label={_t('surname')}
              variant="standard"
              placeholder={_t('surname-placeholder')}
              error={Boolean(errors.familyName)}
              helperText={errors.familyName?.message}
              {...register('familyName')}
              inputProps={{ 'data-testid': 'input-surname' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <MuiPhoneNumber
            label={_t('phone')}
            onlyCountries={onlyCountries}
            defaultCountry="gb"
            variant="standard"
            sx={{ bgcolor: 'grey.100' }}
            inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
            countryCodeEditable={false}
            error={Boolean(errors.phone)}
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
                  label={_t('dob-optional')}
                  mask={DATE_MASK}
                  inputFormat={INPUT_DATE_FORMAT}
                  value={field.value}
                  onChange={(d: Date | null) => setValue('dob', d)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      inputProps={{
                        ...params.inputProps,
                        'data-testid': 'input-dob',
                      }}
                      fullWidth
                      sx={{ bgcolor: 'grey.100' }}
                      error={Boolean(errors.dob)}
                      helperText={errors.dob?.message}
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
                  inputProps={{ 'aria-label': `T&Cs` }}
                />
              }
              label={
                <>
                  <Typography variant="body2">
                    <Trans i18nKey="pages.onboarding.tcs-label">
                      I accept the <a href="">Terms of Business</a> and agree to
                      Team Teach processing my personal data in accordance with
                      our
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
            loading={fetching}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="onboarding-form-btn"
            size="large"
          >
            {t('submit-btn-text')}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
