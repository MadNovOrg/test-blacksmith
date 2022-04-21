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
  CircularProgress,
} from '@mui/material'
import { Box, styled } from '@mui/system'
import { formatISO, setHours, setMinutes } from 'date-fns'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import { yup } from '@app/schemas'
import theme from '@app/theme'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseType,
  CourseInput,
} from '@app/types'
import { INPUT_DATE_FORMAT, DATE_MASK, LoadingStatus } from '@app/util'

import { OrgSelector } from '../OrgSelector'
import { ProfileSelector } from '../ProfileSelector'
import { VenueSelector } from '../VenueSelector'

import { CourseLevelDropdown } from './components/CourseLevelDropdown'

const FormPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.common.white,
}))

interface Props {
  type?: CourseType
  course?: CourseInput
  onChange?: (values: CourseInput, isValid: boolean) => void
}

const CourseForm: React.FC<Props> = ({
  onChange = noop,
  type = CourseType.OPEN,
  course,
}) => {
  const { t } = useTranslation()

  const [startTime, setStartTime] = useState<Date | null>(
    course?.startDateTime ? new Date(course.startDateTime) : null
  )
  const [endTime, setEndTime] = useState<Date | null>(
    course?.endDateTime ? new Date(course.endDateTime) : null
  )

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
              contactProfile: yup.object().required(),
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
        venue: yup
          .object()
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
  } = useForm<CourseInput>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      organizationId: course?.organizationId ?? null,
      contactProfile: course?.contactProfile ?? null,
      courseLevel: course?.courseLevel ?? '',
      blendedLearning: course?.blendedLearning ?? false,
      reaccreditation: course?.reaccreditation ?? false,
      deliveryType: course?.deliveryType ?? CourseDeliveryType.F2F,
      venue: course?.venue ?? null,
      zoomMeetingUrl: course?.zoomMeetingUrl ?? null,
      startDateTime: course?.startDateTime
        ? new Date(course.startDateTime)
        : null,
      endDateTime: course?.endDateTime ? new Date(course.endDateTime) : null,
      minParticipants: course?.minParticipants ?? null,
      maxParticipants: course?.maxParticipants ?? null,
      usesAOL: Boolean(course?.courseCost) ?? false,
      courseCost: course?.courseCost ?? null,
    },
  })

  const formValues = watch()

  const {
    meetingUrl: zoomMeetingUrl,
    generateLink: generateZoomLink,
    status: zoomLinkStatus,
  } = useZoomMeetingLink(
    formValues.startDateTime ? formatISO(formValues.startDateTime) : undefined
  )

  const deliveryType = formValues.deliveryType
  const courseLevel = formValues.courseLevel
  const usesAOL = type === CourseType.INDIRECT ? formValues.usesAOL : false

  const hasZoomMeetingUrl = [
    CourseDeliveryType.VIRTUAL,
    CourseDeliveryType.MIXED,
  ].includes(deliveryType)

  useEffect(() => {
    onChange(formValues, formState.isValid)
  }, [formState, getValues, onChange, formValues])

  useEffect(() => {
    if (!course?.zoomMeetingUrl) {
      setValue('zoomMeetingUrl', zoomMeetingUrl)
      trigger('zoomMeetingUrl')
    }
  }, [zoomMeetingUrl, setValue, trigger, course])

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

  useEffect(() => {
    if (hasZoomMeetingUrl && !course?.zoomMeetingUrl) {
      generateZoomLink()
    }
  }, [hasZoomMeetingUrl, generateZoomLink, course])

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
              onChange={value => {
                setValue('organizationId', value, { shouldValidate: true })
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
              value={formValues.contactProfile ?? undefined}
              orgId={getValues('organizationId') ?? undefined}
              onChange={profile => {
                setValue('contactProfile', profile ?? null, {
                  shouldValidate: true,
                })
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
                  checked={formValues.blendedLearning}
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
              control={
                <Switch {...field} checked={formValues.reaccreditation} />
              }
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

              resetField('venue')
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
                setValue('venue', venue ?? null)
              }}
              value={formValues.venue ?? undefined}
              textFieldProps={{ variant: 'filled' }}
            />
          </>
        ) : null}

        {hasZoomMeetingUrl ? (
          <TextField
            fullWidth
            variant="filled"
            {...register('zoomMeetingUrl')}
            disabled
            helperText={
              zoomLinkStatus === LoadingStatus.ERROR
                ? errors.zoomMeetingUrl?.message
                : null
            }
            error={Boolean(
              errors.zoomMeetingUrl?.message &&
                zoomLinkStatus === LoadingStatus.ERROR
            )}
            sx={{ marginTop: 2 }}
            label={t('components.course-form.zoom-meeting-url-label') as string}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {zoomLinkStatus === LoadingStatus.FETCHING ? (
                    <CircularProgress size={20} />
                  ) : null}
                </InputAdornment>
              ),
            }}
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
                        data-testid="start-date"
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
                    data-testid="start-time"
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
                        data-testid="end-date"
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
                    data-testid="end-time"
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
                  checked={usesAOL}
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
                data-testid="min-attendees"
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
              {...register('maxParticipants', {
                deps: ['minParticipants'],
              })}
              error={Boolean(errors.maxParticipants)}
              helperText={errors.maxParticipants?.message}
              inputProps={{ min: 1 }}
              data-testid="max-attendees"
            />
          </Grid>
        </Grid>
      </FormPanel>
    </form>
  )
}

export default memo(CourseForm)
