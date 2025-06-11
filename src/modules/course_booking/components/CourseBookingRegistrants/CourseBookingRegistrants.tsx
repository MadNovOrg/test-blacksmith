import InfoIcon from '@mui/icons-material/Info'
import { Box, Grid, TextField, Tooltip, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  UKsCodes,
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CountryDropdown } from '@app/components/CountryDropdown'
import {
  Profile as UserSelectorProfile,
  UserSelector,
} from '@app/components/UserSelector'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { NonNullish } from '@app/types'

import { ParticipantInput, useBooking } from '../BookingContext'
import { FormInputs } from '../CourseBookingDetails/utils'

type CourseBookingRegistrantsProps = {
  errors: FieldErrors<FormInputs>
  register: UseFormRegister<FormInputs>
  setValue: UseFormSetValue<FormInputs>
  trigger: UseFormTrigger<FormInputs>
  values: FormInputs
}

export const CourseBookingRegistrants = ({
  errors,
  register,
  setValue,
  trigger,
  values,
}: CourseBookingRegistrantsProps) => {
  const { t } = useTranslation()

  const { acl } = useAuth()

  const { getLabel, isUKCountry } = useWorldCountries()

  const [participantsProfiles, setParticipantsProfiles] = useState<
    Pick<NonNullish<UserSelectorProfile>, 'familyName' | 'givenName'>[]
  >([])

  const { course, booking } = useBooking()

  const isIntlEnabled = useMemo(
    () =>
      [
        Boolean(course),
        course?.accreditedBy === Accreditors_Enum.Icm,
        course?.type === Course_Type_Enum.Open,
        course?.deliveryType === Course_Delivery_Type_Enum.Virtual,
        course?.level === Course_Level_Enum.Level_1,
      ].every(el => el),
    [course],
  )

  const isAddressInfoRequired =
    course?.type === Course_Type_Enum.Open &&
    course?.level === Course_Level_Enum.Level_1 &&
    course?.deliveryType === Course_Delivery_Type_Enum.Virtual &&
    isUKCountry(course?.residingCountry ?? UKsCodes.GB_ENG)

  const showRegistrantSuggestions =
    values.orgId && (acl.isAdmin() || acl.isOrgAdmin(values.orgId))

  useEffect(() => {
    setParticipantsProfiles(
      Array.from(Array(values.participants.length)).fill({}),
    )
  }, [values.participants.length])

  const handleEmailSelector = async (
    profile: UserSelectorProfile,
    index: number,
  ) => {
    const participants = participantsProfiles
    participants[index] = {}
    const newParticipant = {
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      email: profile?.email ?? '',
      firstName: profile?.givenName ?? '',
      hasResidingCountry: Boolean(profile?.countryCode),
      lastName: profile?.familyName ?? '',
      postCode: '',
      residingCountry: profile?.country ?? '',
      residingCountryCode: profile?.countryCode ?? null,
    }
    setValue(
      `participants.${index}`,
      { ...newParticipant },
      { shouldValidate: false },
    )

    participants[index] = {
      familyName: newParticipant.lastName,
      givenName: newParticipant.firstName,
    }
    setParticipantsProfiles([...participants])
  }

  const handleEmailChange = async (email: string, index: number) => {
    const participant = values.participants[index]
    setValue(`participants.${index}`, {
      ...participant,
      hasResidingCountry: false,
      email,
    })
    const participants = participantsProfiles
    participants[index] = {}
    setParticipantsProfiles([...participants])
  }

  const getParticipantError = useCallback(
    (index: number, field: keyof ParticipantInput) => {
      return errors.participants?.[index]?.[field]
    },
    [errors.participants],
  )

  const onCountryChange = useCallback(
    async (index: number, countryCode: string | null) => {
      const postCode = values.participants[index].postCode

      setValue(`participants.${index}.country`, getLabel(countryCode) ?? '')
      await trigger(`participants.${index}.country`)
      if (errors.participants?.[index]?.postCode || postCode) {
        await trigger(`participants.${index}.postCode`)
      }
    },
    [errors.participants, getLabel, setValue, trigger, values.participants],
  )

  return (
    <>
      {booking.participants.map((participant, index) => {
        const emailValue = values.participants[index]?.email
        const emailDuplicated =
          !!values.participants[index] &&
          !!emailValue &&
          values.participants.filter(
            p =>
              p.email.trim().toLocaleLowerCase() ===
              emailValue.trim().toLocaleLowerCase(),
          ).length > 1
        return (
          <Box key={participant.email} display="flex" gap={1}>
            <Typography p={1}>{index + 1}</Typography>
            <Grid container spacing={3} mb={3}>
              <Grid item md={12}>
                <UserSelector
                  value={values.participants[index].email}
                  onChange={profile => handleEmailSelector(profile, index)}
                  onEmailChange={email => handleEmailChange(email, index)}
                  disableSuggestions={!showRegistrantSuggestions}
                  textFieldProps={{ variant: 'filled' }}
                  error={
                    emailDuplicated
                      ? t('pages.book-course.duplicated-email-addresses')
                      : getParticipantError(index, 'email')?.message ?? ''
                  }
                  organisationId={values.orgId}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  label={t('first-name')}
                  variant="filled"
                  placeholder={t('first-name-placeholder')}
                  {...register(`participants.${index}.firstName`)}
                  inputProps={{
                    'data-testid': `participant-${index}-input-first-name`,
                  }}
                  sx={{ bgcolor: 'grey.100' }}
                  error={!!getParticipantError(index, 'firstName')}
                  helperText={
                    getParticipantError(index, 'firstName')?.message ?? ''
                  }
                  InputLabelProps={{
                    shrink: Boolean(values.participants[index].firstName),
                  }}
                  fullWidth
                  required
                  disabled={Boolean(participantsProfiles[index]?.familyName)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  label={t('surname')}
                  variant="filled"
                  placeholder={t('surname-placeholder')}
                  {...register(`participants.${index}.lastName`)}
                  inputProps={{
                    'data-testid': `participant-${index}-input-surname`,
                  }}
                  sx={{ bgcolor: 'grey.100' }}
                  error={!!getParticipantError(index, 'lastName')}
                  helperText={
                    getParticipantError(index, 'lastName')?.message ?? ''
                  }
                  InputLabelProps={{
                    shrink: Boolean(values.participants[index].lastName),
                  }}
                  fullWidth
                  required
                  disabled={Boolean(participantsProfiles[index]?.givenName)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CountriesSelector
                  disableClearable
                  disabled={Boolean(
                    values.participants[index].hasResidingCountry &&
                      values.participants[index].residingCountryCode,
                  )}
                  error={!!errors.participants?.[index]?.residingCountryCode}
                  helperText={
                    errors.participants?.[index]?.residingCountryCode
                      ?.message ??
                    t(
                      'components.course-form.booking-contact-residing-country-helper-text',
                    )
                  }
                  label={t('residing-country')}
                  onChange={(_, code) => {
                    console.log('onChange country', code)
                    setValue(
                      `participants.${index}.residingCountryCode`,
                      code as WorldCountriesCodes,
                      {
                        shouldValidate: true,
                      },
                    )
                    setValue(
                      `participants.${index}.residingCountry`,
                      getLabel(code as WorldCountriesCodes) ?? '',
                    )
                  }}
                  required
                  value={values.participants[index].residingCountryCode}
                  variant="filled"
                  index={index}
                />
              </Grid>
              {isAddressInfoRequired ? (
                <Grid item md={12} data-testid="address-form">
                  <Typography variant="subtitle1">
                    {t('common.postal-address')}
                  </Typography>
                  <Box mb={3}>
                    <TextField
                      id="primaryAddressLine"
                      label={t('line1')}
                      variant="filled"
                      sx={{ bgcolor: 'grey.100' }}
                      {...register(`participants.${index}.addressLine1`)}
                      error={!!getParticipantError(index, 'addressLine1')}
                      InputLabelProps={{
                        shrink: Boolean(
                          values.participants[index].addressLine1,
                        ),
                      }}
                      helperText={
                        getParticipantError(index, 'addressLine1')?.message ??
                        ''
                      }
                      inputProps={{ 'data-testid': 'addr-line1' }}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mb={3}>
                    <TextField
                      id="secondaryAddressLine"
                      label={t('line2')}
                      {...register(`participants.${index}.addressLine2`)}
                      placeholder={t('common.addr.line2-placeholder')}
                      error={!!getParticipantError(index, 'addressLine2')}
                      InputLabelProps={{
                        shrink: Boolean(
                          values.participants[index].addressLine2,
                        ),
                      }}
                      sx={{ bgcolor: 'grey.100' }}
                      variant="filled"
                      helperText={
                        getParticipantError(index, 'addressLine2')?.message ??
                        ''
                      }
                      inputProps={{ 'data-testid': 'addr-line2' }}
                      fullWidth
                    />
                  </Box>
                  <Box mb={3}>
                    <TextField
                      id="city"
                      label={t('city')}
                      {...register(`participants.${index}.city`)}
                      placeholder={t('common.addr.city')}
                      error={!!getParticipantError(index, 'city')}
                      InputLabelProps={{
                        shrink: Boolean(values.participants[index].city),
                      }}
                      sx={{ bgcolor: 'grey.100' }}
                      variant="filled"
                      helperText={
                        getParticipantError(index, 'city')?.message ?? ''
                      }
                      inputProps={{ 'data-testid': 'city' }}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mb={3}>
                    <TextField
                      error={!!getParticipantError(index, 'postCode')}
                      fullWidth
                      helperText={
                        getParticipantError(index, 'postCode')?.message ?? ''
                      }
                      id="postCode"
                      inputProps={{ 'data-testid': 'postCode' }}
                      label={t(
                        'components.venue-selector.modal.fields.postCode',
                      )}
                      placeholder={t('common.addr.postCode')}
                      required
                      sx={{ bgcolor: 'grey.100' }}
                      type={'text'}
                      variant="filled"
                      {...register(`participants.${index}.postCode`)}
                      InputLabelProps={{
                        shrink: Boolean(values.participants[index].postCode),
                      }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip
                            title={t('post-code-tooltip')}
                            data-testid="post-code-tooltip"
                          >
                            <InfoIcon color={'action'} />
                          </Tooltip>
                        ),
                      }}
                    />
                  </Box>
                  <Box mb={3}>
                    {isIntlEnabled ? (
                      <CountriesSelector
                        error={Boolean(
                          getParticipantError(index, 'country')?.message,
                        )}
                        helperText={
                          getParticipantError(index, 'country')?.message ?? ''
                        }
                        onChange={async (_, code) =>
                          await onCountryChange(index, code)
                        }
                        onlyUKCountries={true}
                        value={values.participants[index].country}
                      />
                    ) : (
                      <CountryDropdown
                        required
                        register={register(`participants.${index}.country`)}
                        error={!!getParticipantError(index, 'country')}
                        value={values.participants[index].country}
                        errormessage={
                          getParticipantError(index, 'country')?.message ?? ''
                        }
                        label={t('country')}
                      />
                    )}
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        )
      })}
    </>
  )
}
