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
import React, { useEffect, useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'
import { InferType } from 'yup'

import PhoneNumberInput from '@app/components/PhoneNumberInput'
import { useAuth } from '@app/context/auth'
import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { MUTATION as UPDATE_PROFILE_MUTATION } from '@app/queries/profile/update-profile'
import { schemas, yup } from '@app/schemas'
import { INPUT_DATE_FORMAT, requiredMsg } from '@app/util'

export const Onboarding: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t, _t } = useScopedTranslation('pages.onboarding')
  const { profile, reloadCurrentProfile } = useAuth()
  const navigate = useNavigate()

  const url = import.meta.env.VITE_BASE_WORDPRESS_URL
  const { origin } = useMemo(() => (url ? new URL(url) : { origin: '' }), [url])

  const schema = yup.object({
    givenName: yup.string().required(requiredMsg(_t, 'first-name')),
    familyName: yup.string().required(requiredMsg(_t, 'surname')),
    phone: schemas.phone(_t),
    dob: yup
      .date()
      .nullable()
      .typeError(t('validation-errors.invalid-date-optional'))
      .required(_t('validation-errors.date-required')),
    tcs: yup.boolean().oneOf([true], t('tcs-required')),
  })

  const { register, handleSubmit, formState, watch, setValue, control } =
    useForm<InferType<typeof schema>>({
      resolver: yupResolver(schema),
      defaultValues: {
        givenName: profile?.givenName,
        familyName: profile?.familyName,
      },
    })

  const [{ data: updateResult, fetching, error }, updateProfile] = useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(UPDATE_PROFILE_MUTATION)

  useEffect(() => {
    if (updateResult?.updateUserProfile) {
      reloadCurrentProfile().then(() => {
        navigate('/')
      })
    }
  }, [updateResult, reloadCurrentProfile, navigate])

  const submitHandler: SubmitHandler<InferType<typeof schema>> = async data => {
    await updateProfile({
      input: {
        profileId: profile?.id,
        familyName: data.familyName,
        givenName: data.givenName,
        dob: data.dob.toDateString(), // not an ISO, we are not storing timezone info
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
              variant="filled"
              placeholder={_t('first-name-placeholder')}
              error={Boolean(errors.givenName)}
              helperText={errors.givenName?.message}
              {...register('givenName')}
              inputProps={{ 'data-testid': 'input-first-name' }}
              fullWidth
              required
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              id="surname"
              label={_t('surname')}
              variant="filled"
              placeholder={_t('surname-placeholder')}
              error={Boolean(errors.familyName)}
              helperText={errors.familyName?.message}
              {...register('familyName')}
              inputProps={{ 'data-testid': 'input-surname' }}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <PhoneNumberInput
            label={_t('phone')}
            variant="filled"
            inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
            value={values.phone ?? ''}
            onChange={p =>
              setValue('phone', p as string, { shouldValidate: true })
            }
            autoFocus
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
                  label={_t('dob')}
                  format={INPUT_DATE_FORMAT}
                  value={field.value ?? null}
                  onChange={(d: Date | null) => {
                    if (d) {
                      setValue('dob', d, { shouldValidate: true })
                    }
                  }}
                  slotProps={{
                    textField: {
                      variant: 'filled',
                      fullWidth: true,
                      error: Boolean(errors.dob),
                      helperText: errors.dob?.message as string,
                      required: true,
                    },
                  }}
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
                      I accept the
                      <a
                        href={`${origin}/terms-of-business/`}
                        aria-label={`${t('terms-of-business')} (${t(
                          'opens-new-window'
                        )})`}
                      >
                        Terms of Business
                      </a>
                      and agree to Team Teach processing my personal data in
                      accordance with our
                      <a
                        href={`${origin}/privacy-policy`}
                        aria-label={`${t('privacy-policy')} (${t(
                          'opens-new-window'
                        )})`}
                      >
                        Privacy Policy
                      </a>
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
