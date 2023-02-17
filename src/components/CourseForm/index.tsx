import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { isDate, isValid as isValidDate } from 'date-fns'
import React, { memo, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { FormPanel } from '@app/components/FormPanel'
import { NumericTextField } from '@app/components/NumericTextField'
import { useAuth } from '@app/context/auth'
import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import { yup } from '@app/schemas'
import theme from '@app/theme'
import {
  CourseDeliveryType,
  CourseInput,
  CourseLevel,
  CourseType,
  RoleName,
} from '@app/types'
import { LoadingStatus, extractTime } from '@app/util'

import { OrgSelector } from '../OrgSelector'
import { ProfileSelector } from '../ProfileSelector'
import { VenueSelector } from '../VenueSelector'

import { CourseAOLCountryDropdown } from './components/CourseAOLCountryDropdown'
import { CourseAOLRegionDropdown } from './components/CourseAOLRegionDropdown'
import { CourseDateTimePicker } from './components/CourseDateTimePicker'
import { CourseLevelDropdown } from './components/CourseLevelDropdown'
import {
  canBeBlended,
  canBeF2F,
  canBeMixed,
  canBeReacc,
  canBeVirtual,
  getAccountCode,
  makeDate,
} from './helpers'

export type DisabledFields = Partial<keyof CourseInput>

interface Props {
  type?: CourseType
  courseInput?: CourseInput
  disabledFields?: Set<DisabledFields>
  onChange?: (input: { data?: CourseInput; isValid?: boolean }) => void
}

const accountCodeValue = getAccountCode()

const CourseForm: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
  type: courseType = CourseType.OPEN,
  courseInput,
  disabledFields = new Set(),
}) => {
  const { t } = useTranslation()
  const { activeRole } = useAuth()

  const hasOrg = [CourseType.CLOSED, CourseType.INDIRECT].includes(courseType)
  const isClosedCourse = courseType === CourseType.CLOSED
  const hasMinParticipants = courseType === CourseType.OPEN

  const schema = useMemo(
    () =>
      yup.object({
        ...(hasOrg ? { organization: yup.object().required() } : null),
        ...(isClosedCourse
          ? {
              contactProfile: yup.object().required(),
              freeSpaces: yup
                .number()
                .typeError(t('components.course-form.free-spaces-required'))
                .min(0, t('components.course-form.free-spaces-required'))
                .required(t('components.course-form.free-spaces-required')),
              salesRepresentative: yup.object().required(),
              accountCode: yup.string().required(),
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
            is: (deliveryType: CourseDeliveryType) =>
              activeRole !== RoleName.TT_ADMIN &&
              (deliveryType === CourseDeliveryType.F2F ||
                deliveryType === CourseDeliveryType.MIXED),
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
                t('components.course-form.online-meeting-link-required')
              ),
          }),
        startDateTime: yup
          .date()
          .typeError(t('components.course-form.start-date-format'))
          .nullable()
          .required(t('components.course-form.start-date-required')),
        endDateTime: yup
          .date()
          .typeError(t('components.course-form.end-date-format'))
          .nullable()
          .required(t('components.course-form.end-date-required'))
          .min(
            yup.ref('startDateTime'),
            t('components.course-form.end-date-before-start-date')
          ),
        ...(hasMinParticipants
          ? {
              minParticipants: yup
                .number()
                .typeError(
                  t('components.course-form.min-participants-required')
                )
                .positive(t('components.course-form.min-participants-positive'))
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
        aolCountry: yup
          .string()
          .nullable()
          .when('usesAOL', {
            is: true,
            then: schema => schema.required('Provide AOL Country'),
          }),
        aolRegion: yup
          .string()
          .nullable()
          .when('usesAOL', {
            is: true,
            then: schema => schema.required('Provide AOL Region'),
          }),
        courseCost: yup
          .number()
          .nullable()
          .positive()
          .when('usesAOL', {
            is: true,
            then: schema => schema.required('Provide the price of the course'),
          }),
        notes: yup.string().nullable(),
      }),

    [t, hasOrg, isClosedCourse, hasMinParticipants, activeRole]
  )

  const defaultValues = useMemo<CourseInput>(
    () => ({
      organization: courseInput?.organization ?? null,
      salesRepresentative: courseInput?.salesRepresentative ?? null,
      contactProfile: courseInput?.contactProfile ?? null,
      courseLevel: courseInput?.courseLevel ?? CourseLevel.Level_1,
      blendedLearning: courseInput?.blendedLearning ?? false,
      reaccreditation: courseInput?.reaccreditation ?? false,
      deliveryType: courseInput?.deliveryType ?? CourseDeliveryType.F2F,
      venue: courseInput?.venue ?? null,
      zoomMeetingUrl: courseInput?.zoomMeetingUrl ?? null,
      startDateTime: courseInput?.startDateTime
        ? new Date(courseInput.startDateTime)
        : null,
      endDateTime: courseInput?.endDateTime
        ? new Date(courseInput.endDateTime)
        : null,
      minParticipants: courseInput?.minParticipants ?? null,
      maxParticipants: courseInput?.maxParticipants ?? null,
      freeSpaces: courseInput?.freeSpaces ?? null,
      usesAOL: Boolean(courseInput?.courseCost) ?? false,
      aolCountry: courseInput?.aolCountry ?? null,
      aolRegion: courseInput?.aolRegion ?? null,
      courseCost: courseInput?.courseCost ?? null,
      accountCode: courseInput?.accountCode ?? accountCodeValue,
      type: courseType,
      notes: courseInput?.notes ?? null,
    }),
    [courseInput, courseType]
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
    defaultValues,
  })

  const errors = formState.errors
  const values = watch()
  const deliveryType = values.deliveryType
  const courseLevel = values.courseLevel
  const isBlended = values.blendedLearning
  const canBlended = canBeBlended(courseType, courseLevel, deliveryType)
  const canReacc = canBeReacc(courseType, courseLevel, deliveryType, isBlended)
  const canF2F = canBeF2F(courseType, courseLevel)
  const canVirtual = canBeVirtual(courseType, courseLevel)
  const canMixed = canBeMixed(courseType, courseLevel)
  const hasVenue = [CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(
    deliveryType
  )
  const usesAOL = courseType === CourseType.INDIRECT ? values.usesAOL : false
  const aolCountry = values.aolCountry

  useEffect(() => {
    const s = watch(data => {
      onChange({
        data: data as CourseInput,
        isValid: formState.isValid,
      })
    })
    return () => s.unsubscribe()
  }, [formState.isValid, onChange, watch])

  useEffect(() => {
    onChange({
      isValid: formState.isValid,
    })
  }, [formState.isValid, onChange])

  useEffect(() => {
    const mustChange = !canBlended && values.blendedLearning
    mustChange && setValue('blendedLearning', false)
  }, [canBlended, setValue, values.blendedLearning])

  useEffect(() => {
    const mustChange = !canReacc && values.reaccreditation
    mustChange && setValue('reaccreditation', false)
  }, [canReacc, setValue, values.reaccreditation])

  useEffect(() => {
    const isVirtual = values.deliveryType === CourseDeliveryType.VIRTUAL
    const mustChange = !canVirtual && isVirtual
    mustChange && setValue('deliveryType', CourseDeliveryType.F2F)
  }, [canVirtual, setValue, values.deliveryType])

  useEffect(() => {
    const isMixed = values.deliveryType === CourseDeliveryType.MIXED
    const mustChange = !canMixed && isMixed
    mustChange && setValue('deliveryType', CourseDeliveryType.F2F)
  }, [canMixed, setValue, values.deliveryType])

  useEffect(() => {
    if (
      values.startDateTime &&
      isDate(values.startDateTime) &&
      isValidDate(values.startDateTime)
    ) {
      setValue('accountCode', getAccountCode(values.startDateTime))
    }
  }, [values.startDateTime, setValue])

  const hasZoomMeetingUrl = [
    CourseDeliveryType.VIRTUAL,
    CourseDeliveryType.MIXED,
  ].includes(deliveryType)

  const autoLoadZoomMeetingUrl = useMemo(
    () =>
      hasZoomMeetingUrl &&
      courseType !== CourseType.INDIRECT &&
      !courseInput?.zoomMeetingUrl,
    [hasZoomMeetingUrl, courseType, courseInput]
  )

  const {
    meetingUrl: zoomMeetingUrl,
    generateLink: generateZoomLink,
    status: zoomLinkStatus,
  } = useZoomMeetingLink(values.startDateTime ?? undefined)

  useEffect(() => {
    if (zoomMeetingUrl && hasZoomMeetingUrl && !courseInput?.zoomMeetingUrl) {
      setValue('zoomMeetingUrl', zoomMeetingUrl)
      trigger('zoomMeetingUrl')
    }
  }, [hasZoomMeetingUrl, zoomMeetingUrl, setValue, trigger, courseInput])

  useEffect(() => {
    if (deliveryType === CourseDeliveryType.VIRTUAL) {
      trigger('zoomMeetingUrl')
    }
  }, [deliveryType, trigger])

  useEffect(() => {
    if (autoLoadZoomMeetingUrl) {
      generateZoomLink()
    }
  }, [autoLoadZoomMeetingUrl, generateZoomLink])

  return (
    <form>
      <Typography variant="h5" fontWeight={500} gutterBottom>
        {t('components.course-form.general-details-title')}
      </Typography>
      <FormPanel mb={2}>
        {hasOrg ? (
          <>
            <Typography mb={2} fontWeight={600}>
              {t('components.course-form.organization-label')}
            </Typography>
            <OrgSelector
              allowAdding
              value={values.organization ?? undefined}
              onChange={org => {
                setValue('organization', org, { shouldValidate: true })
              }}
              textFieldProps={{
                variant: 'filled',
              }}
              sx={{ marginBottom: 2 }}
              disabled={disabledFields.has('organization')}
            />
          </>
        ) : null}

        {isClosedCourse ? (
          <>
            <Typography mb={2} fontWeight={600}>
              {t('components.course-form.contact-person-label')}
            </Typography>

            <ProfileSelector
              value={values.contactProfile ?? undefined}
              orgId={getValues('organization')?.id ?? undefined}
              onChange={profile => {
                setValue('contactProfile', profile ?? null, {
                  shouldValidate: true,
                })
              }}
              sx={{ marginBottom: 2 }}
              textFieldProps={{ variant: 'filled' }}
              disabled={
                !getValues('organization') ||
                disabledFields.has('contactProfile')
              }
              placeholder={t(
                'components.course-form.contact-person-placeholder'
              )}
            />
          </>
        ) : null}

        <Typography mb={2} fontWeight={600}>
          {t('components.course-form.course-level-section-title')}
        </Typography>
        <FormControl variant="filled" sx={{ mb: theme.spacing(2) }} fullWidth>
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
                courseType={courseType}
                disabled={disabledFields.has('courseLevel')}
              />
            )}
          />
          {values.courseLevel === CourseLevel.Level_1 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('components.course-form.course-level-one-info')}
            </Alert>
          )}
          {errors.courseLevel?.message ? (
            <FormHelperText error>{errors.courseLevel.message}</FormHelperText>
          ) : null}
        </FormControl>

        <Controller
          name="blendedLearning"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              sx={{ mr: theme.spacing(5) }}
              disabled={!canBlended || disabledFields.has('blendedLearning')}
              control={<Switch {...field} checked={values.blendedLearning} />}
              label={t('components.course-form.blended-learning-label')}
            />
          )}
        />

        <Controller
          name="reaccreditation"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              disabled={!canReacc || disabledFields.has('reaccreditation')}
              control={<Switch {...field} checked={values.reaccreditation} />}
              label={t('components.course-form.reaccreditation-label')}
            />
          )}
        />

        {isBlended && courseType === CourseType.INDIRECT ? (
          <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
            {t('components.course-form.blended-learning-price-label')}
          </Alert>
        ) : null}

        <Typography mb={2} mt={2} fontWeight={600}>
          {t('components.course-form.delivery-type-section-title')}
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={deliveryType}
            onChange={e => {
              const deliveryType = e.target.value as CourseDeliveryType
              setValue('deliveryType', deliveryType)

              if (deliveryType === CourseDeliveryType.VIRTUAL) {
                setValue('venue', null)
              }
              trigger(['venue', 'zoomMeetingUrl'])
            }}
          >
            <FormControlLabel
              value={CourseDeliveryType.F2F}
              control={
                <Radio
                  disabled={!canF2F || disabledFields.has('deliveryType')}
                />
              }
              label={t('components.course-form.f2f-option-label')}
              data-testid={`delivery-${CourseDeliveryType.F2F}`}
            />
            <FormControlLabel
              value={CourseDeliveryType.VIRTUAL}
              control={
                <Radio
                  disabled={!canVirtual || disabledFields.has('deliveryType')}
                />
              }
              label={t('components.course-form.virtual-option-label')}
              data-testid={`delivery-${CourseDeliveryType.VIRTUAL}`}
            />
            <FormControlLabel
              value={CourseDeliveryType.MIXED}
              control={
                <Radio
                  disabled={!canMixed || disabledFields.has('deliveryType')}
                />
              }
              label={t('components.course-form.mixed-option-label')}
              data-testid={`delivery-${CourseDeliveryType.MIXED}`}
            />
          </RadioGroup>
        </FormControl>

        {hasVenue ? (
          <VenueSelector
            onChange={venue => {
              return setValue('venue', venue ?? null, { shouldValidate: true })
            }}
            value={values.venue ?? undefined}
            textFieldProps={{ variant: 'filled' }}
          />
        ) : null}

        {hasZoomMeetingUrl ? (
          <TextField
            fullWidth
            variant="filled"
            {...register('zoomMeetingUrl')}
            InputLabelProps={{ shrink: values.zoomMeetingUrl !== '' }}
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
            label={t('components.course-form.online-meeting-link-label')}
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
          <Controller
            name="startDateTime"
            control={control}
            render={({ field, fieldState }) => (
              <CourseDateTimePicker
                dateValue={field.value}
                timeValue={
                  courseInput?.startDateTime
                    ? extractTime(courseInput.startDateTime)
                    : extractTime(makeDate(null, '08:00'))
                }
                minDate={new Date()}
                maxDate={values.endDateTime || undefined}
                onChange={val => {
                  field.onChange(val)
                  trigger('endDateTime')
                }}
                onBlur={field.onBlur}
                error={fieldState.error}
                timeId="start"
                dateLabel={t('components.course-form.start-date-placeholder')}
                timeLabel={t('components.course-form.start-time-placeholder')}
              />
            )}
          />

          <Typography mb={2} mt={2} fontWeight={600}>
            {t('components.course-form.end-datepicker-section-title')}
          </Typography>
          <Controller
            name="endDateTime"
            control={control}
            render={({ field, fieldState }) => (
              <CourseDateTimePicker
                dateValue={field.value}
                timeValue={
                  courseInput?.endDateTime
                    ? extractTime(courseInput.endDateTime)
                    : extractTime(makeDate(null, '08:00'))
                }
                minDate={values.startDateTime ?? new Date()}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error}
                timeId="end"
                dateLabel={t('components.course-form.end-date-placeholder')}
                timeLabel={t('components.course-form.end-time-placeholder')}
              />
            )}
          />
        </LocalizationProvider>

        {courseType === CourseType.INDIRECT ? (
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
                  disabled={disabledFields.has('usesAOL')}
                />
              }
              label={t('components.course-form.aol-label')}
            />

            {usesAOL ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl
                      variant="filled"
                      sx={{ mb: theme.spacing(2) }}
                      fullWidth
                      disabled={disabledFields.has('aolCountry')}
                    >
                      <Controller
                        name="aolCountry"
                        control={control}
                        render={({ field }) => (
                          <CourseAOLCountryDropdown
                            value={field.value}
                            onChange={field.onChange}
                            usesAOL={usesAOL}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl
                      variant="filled"
                      sx={{ mb: theme.spacing(2) }}
                      fullWidth
                    >
                      <Controller
                        name="aolRegion"
                        control={control}
                        render={({ field }) => (
                          <CourseAOLRegionDropdown
                            value={field.value}
                            onChange={field.onChange}
                            usesAOL={usesAOL}
                            aolCountry={aolCountry}
                            disabled={disabledFields.has('aolRegion')}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Typography mt={5} fontWeight={600}>
                  {t('components.course-form.course-cost')}
                </Typography>
                <Typography mb={1} variant="body2">
                  {t('components.course-form.course-cost-disclaimer')}
                </Typography>
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
                  disabled={disabledFields.has('courseCost')}
                  {...register('courseCost')}
                />
              </>
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
          {hasMinParticipants ? (
            <Grid item xs={6}>
              <NumericTextField
                label={t('components.course-form.min-attendees-placeholder')}
                variant="filled"
                fullWidth
                {...register('minParticipants', { valueAsNumber: true })}
                error={Boolean(errors.minParticipants)}
                helperText={errors.minParticipants?.message}
                inputProps={{ min: 1 }}
                data-testid="min-attendees"
                disabled={disabledFields.has('minParticipants')}
              />
            </Grid>
          ) : null}

          <Grid item xs={6}>
            <NumericTextField
              id="filled-basic"
              label={t(
                courseType === CourseType.OPEN
                  ? 'components.course-form.max-attendees-placeholder'
                  : 'components.course-form.num-attendees-placeholder'
              )}
              variant="filled"
              fullWidth
              {...register('maxParticipants', {
                deps: ['minParticipants'],
                valueAsNumber: true,
              })}
              error={Boolean(errors.maxParticipants)}
              helperText={errors.maxParticipants?.message}
              inputProps={{ min: 1 }}
              data-testid="max-attendees"
              disabled={disabledFields.has('maxParticipants')}
            />
          </Grid>
        </Grid>
      </FormPanel>

      <FormPanel mb={2} mt={2}>
        <Typography fontWeight={600}>
          {t('components.course-form.notes-title')}
        </Typography>
        <Typography variant="body2" mb={2}>
          {t('components.course-form.notes-description')}
        </Typography>

        <TextField
          label={t('components.course-form.notes-placeholder')}
          variant="filled"
          fullWidth
          {...register('notes')}
          error={Boolean(errors.notes)}
          helperText={errors.notes?.message}
          inputProps={{ min: 0 }}
          data-testid="notes"
          disabled={disabledFields.has('notes')}
        />
      </FormPanel>

      {isClosedCourse ? (
        <>
          <FormPanel mb={2}>
            <Typography fontWeight={600}>
              {t('components.course-form.free-spaces-title')}
            </Typography>
            <Typography variant="body2" mb={2}>
              {t('components.course-form.free-spaces-description')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <NumericTextField
                  label={t('components.course-form.free-spaces-placeholder')}
                  variant="filled"
                  fullWidth
                  {...register('freeSpaces', { valueAsNumber: true })}
                  error={Boolean(errors.freeSpaces)}
                  helperText={errors.freeSpaces?.message}
                  inputProps={{ min: 0 }}
                  data-testid="free-spaces"
                  disabled={disabledFields.has('freeSpaces')}
                />
              </Grid>
            </Grid>
          </FormPanel>

          <Typography variant="h5" fontWeight={500} gutterBottom>
            {t('components.course-form.finance-section-title')}
          </Typography>
          <FormPanel>
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
              sx={{ marginBottom: 2 }}
              textFieldProps={{ variant: 'filled' }}
              placeholder={t('components.course-form.sales-rep-placeholder')}
              testId="profile-selector-sales-representative"
              disabled={disabledFields.has('salesRepresentative')}
            />
          </FormPanel>

          <FormPanel>
            <Typography fontWeight={600} mb={1}>
              {t('components.course-form.account-code-title')}
            </Typography>

            <Typography color="dimGrey.main">{values.accountCode}</Typography>
          </FormPanel>
        </>
      ) : null}
    </form>
  )
}

export default memo(CourseForm)
