import { Box, Grid, TextField, Typography, Alert, Link } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { subYears } from 'date-fns'
import { t } from 'i18next'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { JobTitleSelector } from '@app/components/JobTitleSelector'
import PhoneNumberInput from '@app/components/PhoneNumberInput'
import { useAuth } from '@app/context/auth'
import { GetProfileDetailsQuery } from '@app/generated/graphql'
import { INPUT_DATE_FORMAT } from '@app/util'

import { EditProfileInputs } from '../../pages/EditProfile/utils'
import { DietaryRestrictionsSection } from '../DietaryRestrictionsSection'
import { DisabilitiesSection } from '../DisabilitiesSection'

const minimalAge = subYears(new Date(), 16)

type Props = {
  setIsManualFormError?: (isError: boolean) => void
  profile: GetProfileDetailsQuery['profile']
}

export const PersonalDetailsSection: FC<Props> = ({
  setIsManualFormError,
  profile,
}) => {
  const {
    acl: { canEditNamesAndDOB },
  } = useAuth()
  const { getLabel: getCountryLabel } = useWorldCountries()
  const { id } = useParams()
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<EditProfileInputs>()

  const values = watch()

  if (!profile) return

  return (
    <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
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
            inputProps={{ 'data-testid': 'first-name' }}
            autoFocus
            fullWidth
            disabled={!canEditNamesAndDOB()}
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
            inputProps={{ 'data-testid': 'surname' }}
            fullWidth
            disabled={!canEditNamesAndDOB()}
          />
        </Grid>
      </Grid>

      <Box mb={3}>
        <TextField
          id="email"
          label={t('email')}
          variant="filled"
          value={profile.email}
          inputProps={{ 'data-testid': 'email' }}
          disabled
          fullWidth
        />
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CountriesSelector
            label={t('residing-country')}
            variant="filled"
            required
            disableClearable
            onChange={(_, code) => {
              if (code) {
                setValue(
                  'country',
                  getCountryLabel(code as WorldCountriesCodes) ?? '',
                  { shouldValidate: true },
                )
                setValue('countryCode', code)
                profile.countryCode = code
              }
            }}
            error={!!errors.country}
            helperText={errors.country?.message ?? ''}
            value={profile.countryCode}
          />
          <Typography
            variant="body1"
            sx={{ fontSize: '.75rem', color: 'grey' }}
            data-testid="residing-country-hint-message"
          >
            {t(
              id
                ? 'common.validation-hints.residing-country-user-hint-message'
                : 'common.validation-hints.residing-country-hint-message',
            )}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <PhoneNumberInput
            label={t('phone')}
            variant="filled"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            handleManualError={isError => setIsManualFormError?.(isError)}
            value={{
              phoneNumber: values.phone ?? '',
              countryCode: values.phoneCountryCode ?? '',
            }}
            onChange={({ phoneNumber, countryCode }) => {
              setValue('phone', phoneNumber, {
                shouldValidate: true,
              })
              setValue('phoneCountryCode', countryCode)
            }}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item md={6} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              format={INPUT_DATE_FORMAT}
              value={values.dob}
              disabled={!canEditNamesAndDOB()}
              maxDate={minimalAge}
              onChange={(d: Date | null) => setValue('dob', d)}
              slotProps={{
                textField: {
                  // @ts-expect-error no arbitrary props are allowed by types, which is wrong
                  'data-testid': 'dob-input',
                  label: t('dob'),
                  variant: 'filled',
                  fullWidth: true,
                  error: !!errors.dob,
                  helperText: errors.dob?.message,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item md={6} xs={12}>
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
      {!canEditNamesAndDOB() ? (
        <Alert severity="info" variant="outlined">
          {t('cant-update-personal-info-warning')}{' '}
          <Link
            underline="always"
            href={`mailto:${import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS}`}
            component="a"
          >
            {import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS}
          </Link>
        </Alert>
      ) : null}
      <Grid item md={12} pt={2}>
        <DietaryRestrictionsSection
          setValue={setValue}
          values={values}
          error={errors.dietaryRestrictions?.message}
          profileDietaryRestrictions={profile.dietaryRestrictions ?? ''}
        />
      </Grid>

      <Grid item md={12} pt={2}>
        <DisabilitiesSection
          setValue={setValue}
          values={values}
          error={errors.disabilities?.message}
          profileDisabilities={profile.disabilities ?? ''}
        />
      </Grid>
    </Box>
  )
}
