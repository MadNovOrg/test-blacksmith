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
import { subYears } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'
import { InferType } from 'yup'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { OrgSelector } from '@app/components/OrgSelector/UK'
import { CallbackOption } from '@app/components/OrgSelector/UK/utils'
import { useAuth } from '@app/context/auth'
import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateUserProfileInput,
  Organization,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { JobTitleSelector } from '@app/modules/profile/components/JobTitleSelector'
import PhoneNumberInput, {
  DEFAULT_PHONE_COUNTRY_UK,
} from '@app/modules/profile/components/PhoneNumberInput'
import { UPDATE_PROFILE_MUTATION } from '@app/modules/profile/queries/update-profile'
import { schemas, yup } from '@app/schemas'
import { INPUT_DATE_FORMAT, requiredMsg } from '@app/util'

export const Onboarding: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [isManualFormError, setIsManualFormError] = useState(false)

  const isSearchOnlyByPostCodeEnabled = useFeatureFlagEnabled(
    'search-only-by-postcode-on-registration',
  )

  const { t, _t } = useScopedTranslation('pages.onboarding')
  const { profile, reloadCurrentProfile } = useAuth()
  const navigate = useNavigate()
  const minimalAge = subYears(new Date(), 16)
  const { getLabel: getCountryLabel, isUKCountry } = useWorldCountries()

  const url = import.meta.env.VITE_BASE_WORDPRESS_API_URL
  const { origin } = useMemo(() => (url ? new URL(url) : { origin: '' }), [url])
  const schema = yup.object({
    givenName: yup.string().required(requiredMsg(_t, 'first-name')),
    familyName: yup.string().required(requiredMsg(_t, 'surname')),
    country: yup.string().required(),
    countryCode: yup.string().required(),
    phone: schemas.phone(_t),
    phoneCountryCode: yup.string().optional(),
    dob: yup
      .date()
      .nullable()
      .typeError(t('validation-errors.invalid-date-optional'))
      .required(_t('validation-errors.date-required')),
    tcs: yup.boolean().oneOf([true], t('tcs-required')),
    jobTitle: yup.string().required(requiredMsg(_t, 'job-title')),
    otherJobTitle: yup.string().when('jobTitle', ([jobTitle], schema) => {
      return jobTitle === 'Other'
        ? schema.required(_t('validation-errors.other-job-title-required'))
        : schema
    }),
    organization: yup
      .object<Partial<Organization>>()
      .shape({
        id: yup.string().required(t('organisation-required-error')),
        name: yup.string().required(t('organisation-required-error')),
        moderatorRole: yup.boolean(),
      })
      .required(t('organisation-required-error')),
  })

  const { register, handleSubmit, formState, watch, setValue, control } =
    useForm<InferType<typeof schema>>({
      resolver: yupResolver(schema),
      defaultValues: {
        givenName: profile?.givenName,
        familyName: profile?.familyName,
        ...(profile?.organizations.length
          ? {
              organization: {
                id: profile?.organizations[0].organization.id,
                name: profile?.organizations[0].organization.name,
              },
            }
          : null),
        country: getCountryLabel('GB-ENG'),
        countryCode: 'GB-ENG',
        phoneCountryCode: profile?.phoneCountryCode ?? DEFAULT_PHONE_COUNTRY_UK,
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
    if (isManualFormError) return

    await updateProfile({
      input: {
        profileId: profile?.id,
        familyName: data.familyName,
        givenName: data.givenName,
        dob: data.dob.toDateString(), // not an ISO, we are not storing timezone info
        phone: data.phone,
        phoneCountryCode: data.phoneCountryCode ?? '',
        jobTitle:
          data.jobTitle === 'Other' ? data.otherJobTitle : data.jobTitle,
        orgId: data.organization.id,
        country: data.country,
        countryCode: data.countryCode,
      } as UpdateUserProfileInput,
    })
  }

  const errors = formState.errors
  const values = watch()

  const orgSelectorOnChange = useCallback(
    (org: CallbackOption) => {
      if (org) {
        setValue('organization', org as Organization, {
          shouldValidate: true,
        })
      }
    },
    [setValue],
  )

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
        <Grid container gap={3} flexDirection={'column'}>
          <Grid container spacing={3}>
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
          <Grid item>
            <CountriesSelector
              disableClearable
              onChange={(_, code) => {
                if (code) {
                  setValue(
                    'country',
                    getCountryLabel(code as WorldCountriesCodes) ?? '',
                  )
                  setValue('countryCode', code)
                }
              }}
              value={values.countryCode}
            />
            <Typography
              variant="body1"
              sx={{ fontSize: '.75rem', color: 'grey' }}
              data-testid="residing-country-hint-message"
            >
              {_t('common.validation-hints.residing-country-hint-message')}
            </Typography>
          </Grid>

          <Grid item>
            <PhoneNumberInput
              label={_t('phone')}
              variant="filled"
              inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              handleManualError={isError => setIsManualFormError(isError)}
              value={{
                phoneNumber: values.phone ?? '',
                countryCode: values.phoneCountryCode ?? '',
              }}
              onChange={({ phoneNumber, countryCode }) => {
                setValue('phone', phoneNumber, { shouldValidate: true })
                setValue('phoneCountryCode', countryCode)
              }}
              autoFocus
              fullWidth
              required
            />
          </Grid>
          <Grid>
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
                    maxDate={minimalAge}
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
          </Grid>
          <Grid item>
            <OrgSelector
              allowAdding={!isUKCountry(values.countryCode)}
              countryCode={values.countryCode}
              required
              {...register('organization')}
              autocompleteMode={false}
              showTrainerOrgOnly={false}
              error={
                errors.organization?.id?.message ||
                errors.organization?.name?.message
              }
              value={values.organization ?? null}
              onChange={orgSelectorOnChange}
              textFieldProps={{
                variant: 'filled',
              }}
              isShallowRetrieval
              searchOnlyByPostCode={isSearchOnlyByPostCodeEnabled}
              canSearchByAddress={false}
              placeholder={
                isSearchOnlyByPostCodeEnabled
                  ? undefined
                  : _t('components.org-selector.post-code-and-name-placeholder')
              }
              label={
                isSearchOnlyByPostCodeEnabled
                  ? undefined
                  : _t('components.org-selector.residing-org')
              }
              showDfeResults={isUKCountry(values.countryCode)}
            />
          </Grid>
          <Grid item>
            <JobTitleSelector
              errors={{
                jobTitle: errors.jobTitle?.message,
                otherJobTitle: errors.otherJobTitle?.message,
              }}
              register={{
                jobTitle: { ...register('jobTitle') },
                otherJobTitle: { ...register('otherJobTitle') },
              }}
              values={{ jobTitle: values.jobTitle }}
            />
          </Grid>
        </Grid>

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
                      I accept the{' '}
                      <a
                        href={`${origin}/policies-procedures/terms-of-use/`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${_t('terms-of-use')} (${_t(
                          'opens-new-window',
                        )})`}
                      >
                        Terms of Use
                      </a>
                      and agree to Team Teach processing my personal data in{' '}
                      accordance with our
                      <a
                        href={`${origin}/policies-procedures/privacy-policy/`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${_t('privacy-policy')} (${_t(
                          'opens-new-window',
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
