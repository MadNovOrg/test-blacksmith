import InfoIcon from '@mui/icons-material/Info'
import { Box, Grid, TextField, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Profile as UserSelectorProfile,
  UserSelector,
} from '@app/components/UserSelector'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'

import { FormInputs } from '../../utils'

export const BookingContactDetails = ({
  errors,
  register,
  setValue,
  values,
}: {
  errors: FieldErrors<FormInputs>
  register: UseFormRegister<FormInputs>
  setValue: UseFormSetValue<FormInputs>
  values: FormInputs
}) => {
  const { acl, profile } = useAuth()

  const { t } = useTranslation()

  const { getLabel } = useWorldCountries()

  const [bookingContactProfile, setBookingContactProfile] = useState<
    Partial<UserSelectorProfile>
  >({})

  const isInternalUserBooking = acl.canInviteAttendees(Course_Type_Enum.Open)

  useEffect(() => {
    if (profile && !isInternalUserBooking) {
      setValue('bookingContact', {
        firstName: profile.givenName,
        lastName: profile.familyName,
        email: profile.email,
        residingCountryCode: profile?.countryCode ?? '',
        residingCountry: profile?.countryCode
          ? getLabel(profile.countryCode) ?? null
          : null,
      })
      setBookingContactProfile({
        countryCode: profile?.countryCode,
        familyName: profile?.familyName,
        givenName: profile?.givenName,
      })
    }
  }, [profile, isInternalUserBooking, setValue, getLabel])

  const handleChangeBookingContact = async (profile: UserSelectorProfile) => {
    setBookingContactProfile({})
    setValue(
      'bookingContact',
      {
        email: profile?.email ?? '',
        firstName: profile?.givenName ?? '',
        lastName: profile?.familyName ?? '',
        residingCountryCode: profile?.countryCode ?? '',
        residingCountry: profile?.countryCode
          ? getLabel(profile.countryCode) ?? null
          : null,
      },
      { shouldValidate: true },
    )
    setBookingContactProfile({
      countryCode: profile?.countryCode,
      familyName: profile?.familyName,
      givenName: profile?.givenName,
    })
  }

  return (
    <Box mb={3}>
      <Grid container alignItems={'center'} gap={0.5}>
        <Typography fontWeight={600}>
          {t('components.course-form.booking-contact')}
        </Typography>
        <Tooltip title={t('authorised-organisation-contact')}>
          <InfoIcon color={'info'} sx={{ cursor: 'pointer', zIndex: 1 }} />
        </Tooltip>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item md={12}>
          <UserSelector
            value={values.bookingContact.email ?? undefined}
            onChange={handleChangeBookingContact}
            onEmailChange={email => {
              setValue('bookingContact', {
                ...values.bookingContact,
                email,
              })
              setBookingContactProfile({})
            }}
            required
            error={errors.bookingContact?.email?.message}
            textFieldProps={{ variant: 'filled' }}
            organisationId={values.orgId}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            label={t('first-name')}
            variant="filled"
            placeholder={t('first-name-placeholder')}
            {...register(`bookingContact.firstName`)}
            inputProps={{
              'data-testid': `bookingContact-input-first-name`,
            }}
            sx={{ bgcolor: 'grey.100' }}
            error={!!errors.bookingContact?.firstName}
            helperText={errors.bookingContact?.firstName?.message ?? ''}
            InputLabelProps={{
              shrink: Boolean(values.bookingContact.firstName),
            }}
            fullWidth
            required
            disabled={Boolean(bookingContactProfile?.familyName)}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            label={t('surname')}
            variant="filled"
            placeholder={t('surname-placeholder')}
            {...register(`bookingContact.lastName`)}
            inputProps={{
              'data-testid': `bookingContact-input-surname`,
            }}
            sx={{ bgcolor: 'grey.100' }}
            error={!!errors.bookingContact?.lastName}
            helperText={errors.bookingContact?.lastName?.message ?? ''}
            InputLabelProps={{
              shrink: Boolean(values.bookingContact.lastName),
            }}
            fullWidth
            required
            disabled={Boolean(bookingContactProfile?.givenName)}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <CountriesSelector
            onChange={(_, code) => {
              setValue(
                'bookingContact.residingCountryCode',
                code as WorldCountriesCodes,
                {
                  shouldValidate: true,
                },
              )
              setValue(
                'bookingContact.residingCountry',
                getLabel(code as WorldCountriesCodes) ?? '',
              )
            }}
            disableClearable
            disabled={Boolean(bookingContactProfile?.countryCode)}
            error={!!errors.bookingContact?.residingCountryCode}
            helperText={
              errors.bookingContact?.residingCountryCode?.message ?? ''
            }
            label={t('residing-country')}
            required
            value={values.bookingContact.residingCountryCode}
            variant="filled"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
