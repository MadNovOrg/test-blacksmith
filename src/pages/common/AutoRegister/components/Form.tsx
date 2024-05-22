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
import { subYears, format } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useToggle, useUpdateEffect } from 'react-use'
import { useMutation } from 'urql'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { JobTitleSelector } from '@app/components/JobTitleSelector'
import { CallbackOption, OrgSelector } from '@app/components/OrgSelector'
import { isHubOrg } from '@app/components/OrgSelector/utils'
import PhoneNumberInput, {
  DEFAULT_PHONE_COUNTRY,
} from '@app/components/PhoneNumberInput'
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  Organization,
} from '@app/generated/graphql'
import { MUTATION as CREATE_USER_MUTATION } from '@app/queries/invites/create-user'
import { INPUT_DATE_FORMAT } from '@app/util'

import { FormInputs, getFormSchema } from './types'

const TextField = styled(MuiTextField)(() => ({
  '& .MuiInput-root': {
    height: 40,
  },
}))

type Props = {
  onSuccess: () => void
  token: string
  organizationData?: {
    id: string
    name: string
    address: {
      city: string
      country: string
      line1: string
      line2: string
      postCode: string
    }
  }
}

export const Form: React.FC<React.PropsWithChildren<Props>> = ({
  token,
  onSuccess,
  organizationData,
}) => {
  const isSearchOnlyByPostCodeEnabled = useFeatureFlagEnabled(
    'search-only-by-postcode-on-registration'
  )

  const { t } = useTranslation()
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [{ data: userData, error, fetching: loading }, createUser] =
    useMutation<CreateUserMutation, CreateUserMutationVariables>(
      CREATE_USER_MUTATION
    )
  const { getLabel: getCountryLabel } = useWorldCountries()

  const schema = useMemo(() => getFormSchema(t), [t])
  const url = import.meta.env.VITE_BASE_WORDPRESS_API_URL
  const { origin } = useMemo(() => (url ? new URL(url) : { origin: '' }), [url])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '',
      phoneCountryCode: DEFAULT_PHONE_COUNTRY,
    },
  })

  const values = watch()
  const minimalAge = subYears(new Date(), 16)

  const onSubmit = async (data: FormInputs) => {
    const {
      country,
      countryCode,
      firstName,
      jobTitle,
      otherJobTitle,
      password,
      phone,
      phoneCountryCode,
      surname,
      tcs,
    } = data

    const input: CreateUserMutationVariables['input'] = {
      acceptTnc: tcs,
      country,
      countryCode,
      dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
      firstName,
      jobTitle: jobTitle === 'Other' ? otherJobTitle : jobTitle,
      lastName: surname,
      orgId: data.organization?.id,
      password,
      phone,
      phoneCountryCode,
    }

    await createUser(
      { input },
      { fetchOptions: { headers: { 'x-auth': `Bearer ${token}` } } }
    )
  }

  const handleOrganizationSelection = useCallback(
    (org: CallbackOption) => {
      if (!org) {
        setValue('organization', undefined, {
          shouldValidate: true,
        })
        return
      }
      if (isHubOrg(org)) {
        setValue(
          'organization',
          org as Pick<Organization, 'id' | 'name' | 'address'>,
          {
            shouldValidate: true,
          }
        )
        return
      }
    },
    [setValue]
  )

  useEffect(() => {
    if (organizationData) {
      setValue('organization', {
        id: organizationData.id,
        name: organizationData.name,
        address: organizationData.address,
      })
    }
  }, [organizationData, setValue])

  useUpdateEffect(() => {
    if (userData?.createUser.email) onSuccess()
  }, [onSuccess, userData?.createUser.email])

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      aria-autocomplete="none"
      mt={3}
      data-testid="auto-register-form"
    >
      <Typography variant="body1" mb={1} fontWeight="600">
        {t('personal-details')}
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item md={6} xs={12}>
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
        <Grid item md={6} xs={12}>
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

      <Grid flexDirection={'column'} container gap={3}>
        <Grid item>
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
            inputProps={{ 'data-testid': 'input-pass' }}
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
          <Typography
            variant="body1"
            sx={{ fontSize: '.75rem', color: 'grey' }}
            data-testid="password-hint-message"
          >
            {t('common.validation-hints.password-hint-message')}
          </Typography>
        </Grid>
        <Grid item>
          <CountriesSelector
            onChange={(_, code) => {
              setValue(
                'country',
                getCountryLabel(code as WorldCountriesCodes) ?? '',
                { shouldValidate: true }
              )
              setValue('countryCode', code as WorldCountriesCodes, {
                shouldValidate: true,
              })
            }}
            value={values.countryCode}
            required={true}
            error={!!errors.country}
            helperText={errors.country?.message || ''}
          />
        </Grid>

        <Grid item>
          <PhoneNumberInput
            label={t('phone')}
            variant="filled"
            sx={{ bgcolor: 'grey.100' }}
            inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            value={{
              phoneNumber: values.phone ?? '',
              countryCode: values.phoneCountryCode ?? '',
            }}
            onChange={({ phoneNumber, countryCode }) => {
              setValue('phone', phoneNumber, { shouldValidate: true })
              setValue('phoneCountryCode', countryCode)
            }}
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
                  label={t('dob')}
                  format={INPUT_DATE_FORMAT}
                  value={field.value}
                  onChange={(d: Date | null) =>
                    setValue('dob', d, { shouldValidate: true })
                  }
                  maxDate={minimalAge}
                  slotProps={{
                    textField: {
                      variant: 'filled',
                      fullWidth: true,
                      sx: { bgcolor: 'grey.100' },
                      error: !!errors.dob,
                      helperText: errors.dob?.message,
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
            {...register('organization')}
            allowAdding={false}
            showTrainerOrgOnly={false}
            error={errors.organization?.message}
            value={values.organization ?? undefined}
            onChange={handleOrganizationSelection}
            textFieldProps={{
              variant: 'filled',
            }}
            isShallowRetrieval
            required
            searchOnlyByPostCode={isSearchOnlyByPostCodeEnabled}
            canSearchByAddress={false}
            placeholder={
              isSearchOnlyByPostCodeEnabled
                ? undefined
                : t('components.org-selector.post-code-and-name-placeholder')
            }
            label={
              isSearchOnlyByPostCodeEnabled
                ? undefined
                : t('components.org-selector.residing-org')
            }
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
                  <Trans i18nKey="pages.signup.tcs-label">
                    I accept the
                    <a
                      href={`${origin}/policies-procedures/terms-of-business/`}
                      target="_blank"
                      rel="noreferrer"
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
          loading={loading}
          type="submit"
          variant="contained"
          color="primary"
          data-testid="signup-form-btn"
          size="large"
        >
          {t('pages.signup.submit-btn')}
        </LoadingButton>

        {error ? (
          <FormHelperText sx={{ mt: 2 }} error data-testid="signup-form-error">
            {error.message ?? t(`pages.signup.form-errors.UnknownError`)}
          </FormHelperText>
        ) : null}
      </Box>
    </Box>
  )
}
