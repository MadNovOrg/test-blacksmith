import { yupResolver } from '@hookform/resolvers/yup'
import InfoIcon from '@mui/icons-material/Info'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Big from 'big.js'
import { utcToZonedTime } from 'date-fns-tz'
import { groupBy, filter } from 'lodash'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CountryDropdown } from '@app/components/CountryDropdown'
import { OrgSelector } from '@app/components/OrgSelector/ANZ'
import { isHubOrg } from '@app/components/OrgSelector/ANZ/utils'
import { ProfileSelector } from '@app/components/ProfileSelector'
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
  Currency,
  Org_Created_From_Enum,
  PaymentMethod,
} from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'
import { InvoiceForm } from '@app/modules/course/components/CourseForm/components/InvoiceForm'
import { SourceDropdown } from '@app/modules/course/components/CourseForm/components/SourceDropdown'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { NonNullish } from '@app/types'
import { formatCurrency } from '@app/util'

import { ParticipantInput, useBooking } from '../../BookingContext'
import { PromoCode } from '../../PromoCode'
import { AttendeeValidCertificate } from '../components/AttendeeValidCertificate'
import {
  isAttendeeValidCertificateMandatory,
  FormInputs,
  getSchema,
} from '../utils'

export const CourseBookingDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()

  const { acl, profile } = useAuth()
  const [bookingContactProfile, setBookingContactProfile] = useState<
    Partial<UserSelectorProfile>
  >({})
  const [participantsProfiles, setParticipantProfiles] = useState<
    Pick<NonNullish<UserSelectorProfile>, 'familyName' | 'givenName'>[]
  >([])
  const navigate = useNavigate()
  const defaultCurrency = Currency.Aud

  const hideMCM = useFeatureFlagEnabled('hide-mcm')

  const { formatGMTDateTimeByTimeZone } = useTimeZones()
  const {
    course,
    availableSeats,
    booking,
    amounts,
    addPromo,
    removePromo,
    setBooking,
    internalBooking,
  } = useBooking()

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

  const { getLabel } = useWorldCountries()

  const qtyOptions = useMemo(
    () => Array.from({ length: availableSeats }, (_, i) => i + 1),
    [availableSeats],
  )
  const hidePaymentByCCOnANZ = useFeatureFlagEnabled(
    'hide-payment-by-cc-on-anz',
  )
  const isInternalUserBooking = acl.canInviteAttendees(Course_Type_Enum.Open)
  const isAddressInfoRequired =
    course?.type === Course_Type_Enum.Open &&
    course?.level === Course_Level_Enum.Level_1 &&
    course?.deliveryType === Course_Delivery_Type_Enum.Virtual
  const schema = useMemo(() => {
    return getSchema({ isAddressInfoRequired })
  }, [isAddressInfoRequired])

  const methods = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      isInternalUserBooking,
      quantity: booking.quantity,
      participants: booking.participants,
      orgId: booking.orgId,
      orgName: booking.orgName,
      sector: booking.sector,
      source: booking.source ?? '',
      salesRepresentative: booking.salesRepresentative ?? null,
      bookingContact: booking.bookingContact ?? {
        firstName: '',
        lastName: '',
        email: '',
      },
      paymentMethod: PaymentMethod.Invoice,
      invoiceDetails: booking.invoiceDetails,
      courseLevel: course?.level,
      courseType: course?.type,
      attendeeValidCertificate: booking.attendeeValidCertificate,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    trigger,
  } = methods

  const values = watch()

  const { data: resourcePackPricing } = useResourcePackPricing({
    course_type: course?.type as Course_Type_Enum,
    course_level: course?.level as Course_Level_Enum,
    course_delivery_type: course?.deliveryType as Course_Delivery_Type_Enum,
    reaccreditation: course?.reaccreditation ?? false,
    currency: booking.currency,
  })

  const onSubmit = async (data: FormInputs) => {
    const groupedParticipantsByEmail = groupBy(
      data.participants.map(participant => ({
        ...participant,
        email: participant.email.trim().toLowerCase(),
      })),
      'email',
    )
    const duplicatesParticipantsEmail = filter(
      groupedParticipantsByEmail,
      groupedParticipantsByEmail => groupedParticipantsByEmail.length > 1,
    )

    // Restrict if there are duplicated registrants
    if (duplicatesParticipantsEmail.length) return

    setBooking(data)
    navigate('../review')
  }

  useEffect(() => {
    if (profile && !isInternalUserBooking) {
      setValue('bookingContact', {
        firstName: profile.givenName,
        lastName: profile.familyName,
        email: profile.email,
      })
      setBookingContactProfile({
        familyName: profile?.familyName,
        givenName: profile?.givenName,
      })
    }
  }, [profile, isInternalUserBooking, setValue])

  useEffect(() => {
    if (booking.quantity !== values.quantity) {
      setBooking({ quantity: values.quantity })
    }
  }, [booking, setBooking, values.quantity])

  const showAttendeeValidCertificate = isAttendeeValidCertificateMandatory(
    course?.level,
    course?.type,
    course?.residingCountry,
  )

  useEffect(() => {
    setParticipantProfiles(
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
      email: profile?.email ?? '',
      firstName: profile?.givenName ?? '',
      lastName: profile?.familyName ?? '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postCode: '',
      country: '',
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
    setParticipantProfiles([...participants])
  }

  const handleChangeBookingContact = async (profile: UserSelectorProfile) => {
    setBookingContactProfile({})
    setValue(
      'bookingContact',
      {
        email: profile?.email ?? '',
        firstName: profile?.givenName ?? '',
        lastName: profile?.familyName ?? '',
      },
      { shouldValidate: true },
    )
    setBookingContactProfile({
      familyName: profile?.familyName,
      givenName: profile?.givenName,
    })
  }

  const handleEmailChange = async (email: string, index: number) => {
    const participant = values.participants[index]
    setValue(`participants.${index}`, {
      ...participant,
      email,
    })
    const participants = participantsProfiles
    participants[index] = {}
    setParticipantProfiles([...participants])
  }

  const handleOnChangeAttendeeCertificate = (state: boolean) => {
    setValue('attendeeValidCertificate', state, { shouldValidate: true })
  }

  useEffect(() => {
    if (booking.quantity !== values.participants.length) {
      const participants = values.participants.slice(0, booking.quantity)

      for (let i = 0; i < booking.quantity - values.participants.length; i++) {
        participants.push({
          firstName: '',
          lastName: '',
          email: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          postCode: '',
          country: '',
        })
      }

      setValue(`participants`, [...participants])
      setBooking({ participants })
    }
  }, [booking.quantity, booking.participants, setBooking, values, setValue])

  const getParticipantError = useCallback(
    (index: number, field: keyof ParticipantInput) => {
      return errors.participants?.[index]?.[field]
    },
    [errors.participants],
  )

  const courseVenue = course?.schedule[0].venue
  const locationNameAddressCity = [
    courseVenue?.name,
    courseVenue?.addressLineOne,
    courseVenue?.addressLineTwo,
    courseVenue?.city,
  ]
    .filter(item => item)
    .join(', ')
  const locationPostCodeCountry = [courseVenue?.postCode, courseVenue?.country]
    .filter(item => item)
    .join(', ')

  const showRegistrantSuggestions =
    values.orgId && (acl.isAdmin() || acl.isOrgAdmin(values.orgId))

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
  const courseTimezone = useMemo(() => {
    return course?.schedule.length ? course?.schedule[0].timeZone : undefined
  }, [course?.schedule])

  const courseStartDate = useMemo(
    () => new Date(course?.dates.aggregate?.start?.date),
    [course?.dates],
  )
  const courseEndDate = useMemo(
    () => new Date(course?.dates.aggregate?.end?.date),
    [course?.dates],
  )

  const timeZoneScheduleDateTime = useMemo(() => {
    if (!courseTimezone)
      return { courseStart: courseStartDate, courseEnd: courseEndDate }

    return {
      courseStart: utcToZonedTime(courseStartDate, courseTimezone),
      courseEnd: utcToZonedTime(courseEndDate, courseTimezone),
    }
  }, [courseStartDate, courseEndDate, courseTimezone])

  const taxType = () => {
    return t('custom-gst', { amount: booking.vat })
  }
  return (
    <FormProvider {...methods}>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.book-a-course.book-a-course')}
        </title>
      </Helmet>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        data-testid="booking-form"
      >
        <Typography variant="subtitle1" fontWeight="500">
          {t('pages.book-course.order-details')}
        </Typography>

        <Box bgcolor="common.white" p={2} mb={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box>
              <Typography
                gutterBottom
                fontWeight="600"
                data-testid="course-name"
              >
                {course?.name}
              </Typography>
              <Typography>
                {`${t('dates.withTime', {
                  date: timeZoneScheduleDateTime.courseStart,
                })} ${formatGMTDateTimeByTimeZone(
                  timeZoneScheduleDateTime.courseStart,
                  courseTimezone,
                  false,
                )} - ${t('dates.withTime', {
                  date: timeZoneScheduleDateTime.courseEnd,
                })} ${formatGMTDateTimeByTimeZone(
                  timeZoneScheduleDateTime.courseEnd,
                  courseTimezone,
                  true,
                )} `}
              </Typography>
            </Box>
            <Box minWidth={100} display="flex" alignItems="center">
              <FormControl fullWidth sx={{ bgcolor: 'grey.200' }}>
                <InputLabel
                  variant="standard"
                  htmlFor="qty-select"
                  data-testid="qty-select"
                >
                  {t('qty')}
                </InputLabel>
                <NativeSelect
                  inputProps={{ id: 'qty-select' }}
                  disabled={booking.courseType === Course_Type_Enum.Closed}
                  {...register('quantity', { valueAsNumber: true })}
                >
                  {qtyOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Box>
          </Box>

          {course?.residingCountry ? (
            <Typography color="grey.700" mb={1} mt={3}>
              {getLabel(course.residingCountry)}
            </Typography>
          ) : null}

          <Typography color="grey.700" mb={1} mt={3}>
            {t('location')}
          </Typography>
          <Box flexDirection="column" mb={3}>
            <Typography color="grey.700">{locationNameAddressCity}</Typography>
            <Typography color="grey.700">{locationPostCodeCountry}</Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={1}
            data-testId="course-cost-row"
          >
            <Typography color="grey.700">{t('course-cost')}</Typography>
            <Typography color="grey.700">
              {formatCurrency(
                {
                  amount: new Big(amounts.courseCost).round(2).toNumber(),
                  currency: booking.currency,
                },
                t,
              )}
            </Typography>
          </Box>
          {!hideMCM ? (
            <Box
              display="flex"
              justifyContent="space-between"
              mb={1}
              data-testId="mandatory-course-materials-row"
            >
              <Typography color="grey.700">
                {t('mandatory-resource-packs', {
                  quantity: booking.quantity,
                })}
              </Typography>
              <Typography color="grey.700">
                {formatCurrency(
                  {
                    amount:
                      resourcePackPricing?.anz_resource_packs_pricing[0]
                        ?.price * booking.quantity,
                    currency: booking.currency,
                  },
                  t,
                )}
              </Typography>
            </Box>
          ) : null}

          {booking.trainerExpenses > 0 ? (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">
                {t('pages.book-course.trainer-expenses')}
              </Typography>
              <Typography color="grey.700">
                {formatCurrency(
                  {
                    amount: new Big(amounts.trainerExpenses)
                      .round(2)
                      .toNumber(),
                    currency: booking.currency,
                  },
                  t,
                )}
              </Typography>
            </Box>
          ) : null}

          {booking.courseType !== Course_Type_Enum.Closed ? (
            <Box>
              <PromoCode
                codes={booking.promoCodes}
                discounts={booking.discounts}
                courseId={course?.id ?? 0}
                courseCurrency={course?.priceCurrency ?? defaultCurrency}
                onAdd={addPromo}
                onRemove={removePromo}
              />
            </Box>
          ) : null}

          {booking.freeSpaces > 0 ? (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="grey.700">
                {t('pages.book-course.free-spaces')}
              </Typography>
              <Typography color="grey.700">
                {formatCurrency(
                  {
                    amount: new Big(amounts.freeSpacesDiscount)
                      .neg()
                      .round(2)
                      .toNumber(),
                    currency: booking.currency,
                  },
                  t,
                )}
              </Typography>
            </Box>
          ) : null}

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            mb={1}
            data-testId="subtotal-row"
          >
            <Typography color="grey.700">{t('subtotal')}</Typography>
            <Typography color="grey.700">
              {formatCurrency(
                {
                  amount: new Big(amounts.subtotalDiscounted)
                    .round(2)
                    .toNumber(),
                  currency: booking.currency,
                },
                t,
              )}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={1}
            data-testId="vat-row"
          >
            <Typography color="grey.700">{taxType()}</Typography>
            <Typography color="grey.700">
              {formatCurrency(
                {
                  amount: new Big(amounts.vat).round(2).toNumber(),
                  currency: booking.currency,
                },
                t,
              )}
            </Typography>
          </Box>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            data-testId="amount-due-row"
          >
            <Typography fontWeight="500" color="primary">
              {t('amount-due')} ({booking.currency})
            </Typography>
            <Typography
              fontWeight="500"
              color="primary"
              data-testId="amount-due"
            >
              {formatCurrency(
                {
                  amount: new Big(amounts.total).round(2).toNumber(),
                  currency: booking.currency,
                },
                t,
              )}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {t('org-details')}
        </Typography>
        <Box bgcolor="common.white" p={2} mb={4}>
          <Box mb={3}>
            <OrgSelector
              required
              value={
                values.orgId && values.orgName
                  ? { name: values.orgName, id: values.orgId }
                  : undefined
              }
              allowAdding
              onChange={org => {
                if (org && !isHubOrg(org)) return
                setValue('orgId', org?.id ?? '', { shouldValidate: true })
                setValue('orgName', org?.name ?? '')
              }}
              textFieldProps={{ variant: 'standard' }}
              sx={{ marginBottom: 2 }}
              error={errors.orgId?.message}
              createdFrom={Org_Created_From_Enum.BookingPage}
            />
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {isInternalUserBooking
            ? t('booking-details')
            : t('components.course-form.source-label')}
        </Typography>
        <Box bgcolor="common.white" p={2} mb={4}>
          <Box mb={3}>
            <Typography fontWeight={600}>
              {t('components.course-form.source-title')}
            </Typography>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <SourceDropdown
                  {...field}
                  data-testid="source-dropdown"
                  required
                  disabled={false}
                  error={!!errors.source?.message}
                />
              )}
            />
          </Box>
          {values.source.startsWith('SALES_') && (
            <Box mb={3}>
              <Typography fontWeight={600}>
                {t('components.course-form.sales-rep-title')}
              </Typography>

              <ProfileSelector
                value={values.salesRepresentative ?? undefined}
                onChange={profile => {
                  setValue('salesRepresentative', profile ?? null, {
                    shouldValidate: true,
                  })
                }}
                textFieldProps={{
                  variant: 'filled',
                  error: !!errors.salesRepresentative,
                  helperText: errors.salesRepresentative?.message ?? '',
                }}
                placeholder={t('components.course-form.sales-rep-placeholder')}
                testId="profile-selector-sales-representative"
              />
            </Box>
          )}

          <Box mb={3}>
            <Grid container alignItems={'center'} gap={0.5}>
              <Typography fontWeight={600}>
                {t('components.course-form.booking-contact')}
              </Typography>
              <Tooltip title={t('authorised-organisation-contact')}>
                <InfoIcon
                  color={'info'}
                  sx={{ cursor: 'pointer', zIndex: 1 }}
                />
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
            </Grid>
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {t('registration')}
        </Typography>
        <Box bgcolor="common.white" p={2} mb={4} data-testid="registrants-box">
          {booking.participants.map((_, index) => {
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
              <Box key={`participant-${index}`} display="flex" gap={1}>
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
                      disabled={Boolean(
                        participantsProfiles[index]?.familyName,
                      )}
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
                            getParticipantError(index, 'addressLine1')
                              ?.message ?? ''
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
                            getParticipantError(index, 'addressLine2')
                              ?.message ?? ''
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
                            getParticipantError(index, 'postCode')?.message ??
                            ''
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
                            shrink: Boolean(
                              values.participants[index].postCode,
                            ),
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
                              getParticipantError(index, 'country')?.message ??
                              ''
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
                              getParticipantError(index, 'country')?.message ??
                              ''
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
          <Alert variant="filled" color="info" severity="info" sx={{ mt: 2 }}>
            <b>{t('important')}:</b> {`${t('pages.book-course.notice')}`}
          </Alert>
          {isAddressInfoRequired ? (
            <Alert variant="filled" color="info" severity="info" sx={{ mt: 2 }}>
              <b>{t('important')}:</b>{' '}
              {`${t('pages.book-course.notice-participants')}`}
            </Alert>
          ) : null}
          {showAttendeeValidCertificate && (
            <AttendeeValidCertificate
              handleCheckboxValue={handleOnChangeAttendeeCertificate}
              errors={errors}
              courseLevel={course?.level}
              reaccreditation={course?.reaccreditation ?? false}
              conversion={course?.conversion ?? false}
              totalAttendees={values.quantity}
              isChecked={values.attendeeValidCertificate ?? false}
            />
          )}
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {t('pages.book-course.payment-details')}
        </Typography>
        <Box bgcolor="common.white" p={2} pt={4} mb={4}>
          <FormControl
            sx={{
              '& .MuiRadio-root': { paddingY: 0 },
              '& .MuiFormControlLabel-root': {
                alignItems: 'flex-start',
                mb: 2,
              },
            }}
          >
            <Controller
              rules={{ required: true }}
              control={control}
              name="paymentMethod"
              render={({ field }) => {
                return (
                  <RadioGroup aria-labelledby="payment-method" {...field}>
                    {(acl.canInviteAttendees(Course_Type_Enum.Open) &&
                      internalBooking) ||
                    hidePaymentByCCOnANZ ? null : (
                      <FormControlLabel
                        // Internal TT users can create booking for open courses
                        // without paying by cc
                        value={PaymentMethod.Cc}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography gutterBottom fontWeight="500">
                              {t('pages.book-course.pay-by-cc')}
                            </Typography>
                            <Typography variant="body2" color="grey.700">
                              {t('pages.book-course.pay-by-cc-info')}
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                    <FormControlLabel
                      value={PaymentMethod.Invoice}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography gutterBottom fontWeight="500">
                            {t('pages.book-course.pay-by-inv')}
                          </Typography>
                          <Typography variant="body2" color="grey.700">
                            {t('pages.book-course.pay-by-inv-info')}
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                )
              }}
            />
          </FormControl>

          {values.paymentMethod === PaymentMethod.Invoice ? (
            <Box p={2}>
              <Typography variant="body1" fontWeight="600" mb={3}>
                {t('invoice-contact')}
              </Typography>

              <InvoiceForm />
            </Box>
          ) : null}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button variant="text" color="primary" href="/">
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            data-testid="review-and-confirm"
          >
            {t('pages.book-course.step-2')}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}
