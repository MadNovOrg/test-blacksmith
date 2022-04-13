import { yupResolver } from '@hookform/resolvers/yup'
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import { Box, styled } from '@mui/system'
import { setHours, setMinutes } from 'date-fns'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DeepNonNullable, noop } from 'ts-essentials'

import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import { yup } from '@app/schemas'
import theme from '@app/theme'
import {
  Course,
  CourseDeliveryType,
  CourseLevel,
  CourseType,
  Organization,
  Profile,
  Venue,
} from '@app/types'
import { INPUT_DATE_FORMAT, DATE_MASK } from '@app/util'

import OrgSelector from '../OrgSelector'
import ProfileSelector from '../ProfileSelector'
import VenueSelector from '../VenueSelector'

import { CourseLevelDropdown } from './components/CourseLevelDropdown'

const FormPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.common.white,
}))

export type FormValues = {
  organizationId: string | null
  contactProfileId: string | null
  courseLevel: CourseLevel | ''
  blendedLearning: boolean
  reaccreditation: boolean
  deliveryType: CourseDeliveryType
  startDateTime: Date | null
  endDateTime: Date | null
  minParticipants: number | null
  maxParticipants: number | null
  venueId: string | null
  zoomMeetingUrl: string | null
  usesAOL: boolean
  courseCost: number | null
}

export type ValidFormFields = DeepNonNullable<
  Omit<FormValues, 'courseLevel'> & { courseLevel: CourseLevel }
>

interface Props {
  type?: CourseType
  course?: Course
  onChange?: (values: FormValues, isValid: boolean) => void
}

const CourseForm: React.FC<Props> = ({
  onChange = noop,
  type = CourseType.OPEN,
}) => {
  const { t } = useTranslation()
  const zoomMeetingUrl = useZoomMeetingLink()

  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [venue, setVenue] = useState<Venue>()
  const [organization, setOrganization] = useState<Organization>()
  const [contactProfile, setContactProfile] = useState<Profile>()

  const hasOrganizationField = [
    CourseType.CLOSED,
    CourseType.INDIRECT,
  ].includes(type)
  const hasContactProfileField = type === CourseType.CLOSED
  const hasMinParticipantField = type === CourseType.OPEN

  const schema = useMemo(
    () =>
      yup.object({
        ...(hasOrganizationField
          ? {
              organizationId: yup.string().required(),
            }
          : null),
        ...(hasContactProfileField
          ? {
              contactProfileId: yup.string().required(),
            }
          : null),
        courseLevel: yup
          .string()
          .required(t('components.course-form.course-level-required')),
        blendedLearning: yup.bool(),
        reaccreditation: yup.bool(),
        deliveryType: yup
          .mixed()
          .oneOf([
            CourseDeliveryType.F2F,
            CourseDeliveryType.VIRTUAL,
            CourseDeliveryType.MIXED,
          ]),
        venueId: yup
          .string()
          .nullable()
          .when('deliveryType', {
            is: CourseDeliveryType.F2F || CourseDeliveryType.MIXED,
            then: schema =>
              schema.required(t('components.course-form.venue-required')),
          }),
        zoomMeetingUrl: yup
          .string()
          .nullable()
          .when('deliveryType', {
            is: (val: CourseDeliveryType) =>
              val === CourseDeliveryType.VIRTUAL ||
              val === CourseDeliveryType.MIXED,
            then: schema =>
              schema.required(
                t('components.course-form.zoom-meeting-url-required')
              ),
          }),
        startDateTime: yup
          .date()
          .nullable()
          .required(t('components.course-form.start-date-required')),
        endDateTime: yup
          .date()
          .nullable()
          .required(t('components.course-form.end-date-required'))
          .min(
            yup.ref('startDateTime'),
            t('components.course-form.end-date-before-start-date')
          ),
        ...(hasMinParticipantField
          ? {
              minParticipants: yup
                .number()
                .typeError(
                  t('components.course-form.min-participants-required')
                )
                .positive()
                .required(t('components.course-form.min-participants-required'))
                .lessThan(
                  yup.ref('maxParticipants', {}),
                  t('components.course-form.min-participants-less-than')
                ),
            }
          : null),
        maxParticipants: yup
          .number()
          .typeError(t('components.course-form.min-participants-required'))
          .positive()
          .required(t('components.course-form.min-participants-required')),
        usesAOL: yup.boolean(),
        courseCost: yup
          .number()
          .nullable()
          .positive()
          .when('usesAOL', {
            is: true,
            then: schema => schema.required('Provide the price of the course'),
          }),
      }),

    [t, hasOrganizationField, hasContactProfileField, hasMinParticipantField]
  )

  const {
    register,
    setValue,
    watch,
    getValues,
    formState,
    control,
    trigger,
    resetField,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      organizationId: null,
      contactProfileId: null,
      courseLevel: '',
      blendedLearning: false,
      reaccreditation: false,
      deliveryType: CourseDeliveryType.F2F,
      venueId: null,
      zoomMeetingUrl: null,
      startDateTime: null,
      endDateTime: null,
      minParticipants: null,
      maxParticipants: null,
      usesAOL: false,
      courseCost: null,
    },
  })

  const formValues = watch()

  const deliveryType = formValues.deliveryType
  const courseLevel = formValues.courseLevel
  const usesAOL = type === CourseType.INDIRECT ? formValues.usesAOL : false

  useEffect(() => {
    onChange(formValues, formState.isValid)
  }, [formState, getValues, onChange, formValues])

  useEffect(() => {
    register('courseLevel')
  }, [register])

  useEffect(() => {
    setValue('zoomMeetingUrl', zoomMeetingUrl)
  }, [zoomMeetingUrl, setValue])

  useEffect(() => {
    const startDate = getValues('startDateTime')
    const endDate = getValues('endDateTime')
    if (startTime && startDate) {
      const startDateWithTime = setMinutes(
        setHours(startDate, startTime.getHours()),
        startTime.getMinutes()
      )

      setValue('startDateTime', startDateWithTime)

      if (endDate) {
        trigger('endDateTime')
      }
    }
  }, [startTime, getValues, setValue, trigger])

  useEffect(() => {
    const endDate = getValues('endDateTime')
    if (endTime && endDate) {
      const endDateWithTime = setMinutes(
        setHours(endDate, endTime.getHours()),
        endTime.getMinutes()
      )

      setValue('endDateTime', endDateWithTime)
      trigger('endDateTime')
    }
  }, [endTime, getValues, setValue, trigger])

  const handleStartDateTimeChange = (date: Date | null) => {
    let dateToSet = date
    const endDate = getValues('endDateTime')

    if (startTime && date) {
      dateToSet = setMinutes(
        setHours(date, startTime.getHours()),
        startTime.getMinutes()
      )
    }

    setValue('startDateTime', dateToSet, { shouldValidate: true })

    if (endDate) {
      trigger('endDateTime')
    }
  }

  const handleEndDateTimeChange = (date: Date | null) => {
    let dateToSet = date

    if (endTime && date) {
      dateToSet = setMinutes(
        setHours(date, endTime.getHours()),
        endTime.getMinutes()
      )
    }

    setValue('endDateTime', dateToSet, { shouldValidate: true })
  }

  useEffect(() => {
    if (deliveryType === CourseDeliveryType.VIRTUAL) {
      trigger('zoomMeetingUrl')
    }
  }, [deliveryType, trigger])

  const errors = formState.errors

  return (
    <form>
      <Typography variant="h5" fontWeight={500} gutterBottom>
        {t('components.course-form.general-details-title')}
      </Typography>
      <FormPanel mb={2}>
        {hasOrganizationField ? (
          <>
            <Typography mb={2} fontWeight={600}>
              {t('components.course-form.organization-label')}
            </Typography>
            <OrgSelector
              value={organization}
              onChange={value => {
                setValue('organizationId', value?.id ?? '', {
                  shouldValidate: true,
                })

                setOrganization(value)
              }}
              textFieldProps={{ variant: 'filled' }}
              sx={{ marginBottom: 2 }}
            />
          </>
        ) : null}
        {hasContactProfileField ? (
          <>
            <Typography mb={2} fontWeight={600}>
              {t('components.course-form.contact-person-label')}
            </Typography>

            <ProfileSelector
              value={contactProfile}
              orgId={getValues('organizationId') ?? undefined}
              onChange={profile => {
                setValue('contactProfileId', profile?.id ?? '', {
                  shouldValidate: true,
                })

                setContactProfile(profile)
              }}
              sx={{ marginBottom: 2 }}
              textFieldProps={{
                variant: 'filled',
              }}
              disabled={!getValues('organizationId')}
              placeholder={t(
                'components.course-form.contact-person-placeholder'
              )}
            />
          </>
        ) : null}

        <Typography mb={2} fontWeight={600}>
          {t('components.course-form.course-level-section-title')}
        </Typography>
        <FormControl
          variant="filled"
          sx={{
            marginBottom: theme.spacing(2),
          }}
          fullWidth
        >
          <InputLabel>
            {t('components.course-form.course-level-placeholder')}
          </InputLabel>
          <Controller
            name="courseLevel"
            control={control}
            render={({ field }) => (
              <CourseLevelDropdown
                value={field.value}
                onChange={field.onChange}
                deliveryType={deliveryType}
                courseType={CourseType.CLOSED}
              />
            )}
          />
          {errors.courseLevel?.message ? (
            <FormHelperText error>{errors.courseLevel.message}</FormHelperText>
          ) : null}
        </FormControl>
        <Controller
          name="blendedLearning"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              sx={{ marginRight: theme.spacing(5) }}
              control={
                <Switch
                  {...field}
                  disabled={courseLevel === CourseLevel.ADVANCED}
                />
              }
              label={
                t('components.course-form.blended-learning-label') as string
              }
            />
          )}
        />

        <Controller
          name="reaccreditation"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} />}
              label={
                t('components.course-form.reaccreditation-label') as string
              }
            />
          )}
        />

        <Typography mb={2} mt={2} fontWeight={600}>
          {t('components.course-form.location-section-title')}
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={deliveryType}
            onChange={e => {
              setValue('deliveryType', e.target.value as CourseDeliveryType)

              resetField('venueId')
              resetField('zoomMeetingUrl')
            }}
          >
            <FormControlLabel
              value={CourseDeliveryType.F2F}
              control={<Radio />}
              label={t('components.course-form.f2f-option-label') as string}
            />
            <FormControlLabel
              value={CourseDeliveryType.VIRTUAL}
              control={
                <Radio
                  disabled={
                    courseLevel === CourseLevel.ADVANCED ||
                    courseLevel === CourseLevel.LEVEL_2
                  }
                />
              }
              label={t('components.course-form.virtual-option-label') as string}
            />
            <FormControlLabel
              value={CourseDeliveryType.MIXED}
              control={
                <Radio disabled={courseLevel === CourseLevel.ADVANCED} />
              }
              label={t('components.course-form.mixed-option-label') as string}
            />
          </RadioGroup>
        </FormControl>

        {[CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(
          deliveryType
        ) ? (
          <>
            <VenueSelector
              onChange={venue => {
                setValue('venueId', venue?.id ?? '')
                setVenue(venue)
                trigger('venueId')
              }}
              value={venue}
              textFieldProps={{ variant: 'filled' }}
            />
            {errors.venueId?.message ? (
              <FormHelperText error>{errors.venueId?.message}</FormHelperText>
            ) : null}
          </>
        ) : null}

        {[CourseDeliveryType.VIRTUAL, CourseDeliveryType.MIXED].includes(
          deliveryType
        ) ? (
          <TextField
            fullWidth
            variant="filled"
            value={zoomMeetingUrl}
            disabled
            helperText={errors.zoomMeetingUrl?.message}
            error={Boolean(errors.zoomMeetingUrl?.message)}
            sx={{ marginTop: 2 }}
          />
        ) : null}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Typography mb={2} mt={2} fontWeight={600}>
            {t('components.course-form.start-datepicker-section-title')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="startDateTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    mask={DATE_MASK}
                    label={t('components.course-form.start-date-placeholder')}
                    inputFormat={INPUT_DATE_FORMAT}
                    value={field.value}
                    onChange={handleStartDateTimeChange}
                    renderInput={params => (
                      <TextField
                        variant="filled"
                        {...params}
                        fullWidth
                        error={Boolean(errors.startDateTime)}
                        helperText={errors.startDateTime?.message}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label={t('components.course-form.start-time-placeholder')}
                value={startTime}
                onChange={value => setStartTime(value)}
                renderInput={params => (
                  <TextField
                    variant="filled"
                    {...params}
                    fullWidth
                    error={Boolean(errors.startDateTime)}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography mb={2} mt={2} fontWeight={600}>
            {t('components.course-form.end-datepicker-section-title')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="endDateTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={t('components.course-form.end-date-placeholder')}
                    mask={DATE_MASK}
                    inputFormat={INPUT_DATE_FORMAT}
                    value={field.value}
                    onChange={handleEndDateTimeChange}
                    renderInput={params => (
                      <TextField
                        variant="filled"
                        {...params}
                        fullWidth
                        error={Boolean(errors.endDateTime)}
                        helperText={errors.endDateTime?.message}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label={t('components.course-form.end-time-placeholder')}
                value={endTime}
                onChange={value => setEndTime(value)}
                renderInput={params => (
                  <TextField
                    variant="filled"
                    {...params}
                    fullWidth
                    error={Boolean(errors.endDateTime)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        {type === CourseType.INDIRECT ? (
          <>
            <Typography mt={2} fontWeight={600}>
              {t('components.course-form.aol-title')}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => {
                    setValue('usesAOL', e.target.checked, {
                      shouldValidate: true,
                    })
                    if (!e.target.checked) {
                      resetField('courseCost')
                    }
                  }}
                />
              }
              label={t('components.course-form.aol-label') as string}
            />

            {usesAOL ? (
              <TextField
                variant="filled"
                placeholder={t(
                  'components.course-form.course-cost-placeholder'
                )}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">£</InputAdornment>
                  ),
                }}
                {...register('courseCost')}
              />
            ) : null}
          </>
        ) : null}
      </FormPanel>
      <Typography variant="h5" fontWeight={500} gutterBottom>
        {t('components.course-form.attendees-section-title')}
      </Typography>
      <FormPanel>
        <Typography fontWeight={600}>
          {t('components.course-form.attendees-number-title')}
        </Typography>
        <Typography variant="body2" mb={2}>
          {t('components.course-form.attendees-description')}
        </Typography>

        <Grid container spacing={2}>
          {hasMinParticipantField ? (
            <Grid item xs={6}>
              <TextField
                label={t('components.course-form.min-attendees-placeholder')}
                variant="filled"
                fullWidth
                type="number"
                {...register('minParticipants')}
                error={Boolean(errors.minParticipants)}
                helperText={errors.minParticipants?.message}
                inputProps={{ min: 1 }}
              />
            </Grid>
          ) : null}

          <Grid item xs={6}>
            <TextField
              id="filled-basic"
              label={t(
                type === CourseType.OPEN
                  ? 'components.course-form.max-attendees-placeholder'
                  : 'components.course-form.num-attendees-placeholder'
              )}
              variant="filled"
              fullWidth
              type="number"
              {...register('maxParticipants')}
              error={Boolean(errors.maxParticipants)}
              helperText={errors.maxParticipants?.message}
              inputProps={{ min: 1 }}
              onBlur={e => {
                register('maxParticipants').onBlur(e)
                if (hasMinParticipantField) {
                  trigger('minParticipants')
                }
              }}
            />
          </Grid>
        </Grid>
      </FormPanel>
    </form>
  )
}

export default memo(CourseForm)
