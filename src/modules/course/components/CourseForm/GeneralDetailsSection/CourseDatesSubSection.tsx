import { Alert, Grid, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { addDays, isValid as isValidDate } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useCallback } from 'react'
import { useFormContext, Controller, useWatch } from 'react-hook-form'

import TimeZoneSelector from '@app/components/TimeZoneSelector'
import { Course_Delivery_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { TimeZoneDataType } from '@app/hooks/useTimeZones'
import { type CourseInput } from '@app/types'

import { CourseDatePicker } from '../components/CourseDatePicker'
import { CourseTimePicker } from '../components/CourseTimePicker'
import { makeDate } from '../helpers'

type Props = {
  isCreation?: boolean
}

export const CourseDatesSubSection = ({ isCreation }: Props) => {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<CourseInput>()
  const { t } = useScopedTranslation('components.course-form')
  const isResidingCountryEnabled = !!useFeatureFlagEnabled(
    'course-residing-country',
  )

  const deliveryType = useWatch({ control, name: 'deliveryType' })
  const venue = useWatch({ control, name: 'venue' })
  const residingCountry = useWatch({ control, name: 'residingCountry' })
  const timeZone = useWatch({ control, name: 'timeZone' })
  const [startDate, startTime, startDateTime] = useWatch({
    control,
    name: ['startDate', 'startTime', 'startDateTime'],
  })
  const [endDate, endTime] = useWatch({
    control,
    name: ['endDate', 'endTime'],
  })

  const minCourseStartDate = addDays(new Date(), 1)
  const isStartDateTimeSet = !!startDateTime && isValidDate(startDateTime)

  const displayTimeZoneSelector =
    isResidingCountryEnabled &&
    isStartDateTimeSet &&
    ((deliveryType !== Course_Delivery_Type_Enum.Virtual && venue) ||
      (deliveryType === Course_Delivery_Type_Enum.Virtual && residingCountry))

  const handleChangeTimeZoneSelector = useCallback(
    (zone: TimeZoneDataType | null) => {
      setValue('timeZone', zone ?? undefined, { shouldValidate: true })
    },
    [setValue],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography mb={2} mt={2} fontWeight={600}>
        {t('start-datepicker-section-title')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => (
              <CourseDatePicker
                required
                name={field.name}
                label={t('start-date-placeholder')}
                value={field.value}
                minDate={minCourseStartDate}
                maxDate={endDate || undefined}
                onChange={newStartDate => {
                  field.onChange(newStartDate)
                  setValue('startDateTime', makeDate(newStartDate, startTime))
                  trigger('endDate')
                }}
                onBlur={field.onBlur}
                error={fieldState.error}
              />
            )}
          />
        </Grid>
        <Grid item md={6} sm={12}>
          <Controller
            name="startTime"
            control={control}
            render={({ field, fieldState }) => (
              <CourseTimePicker
                required
                name={field.name}
                id="start"
                label={t('start-time-placeholder')}
                value={field.value}
                onChange={newStartTime => {
                  field.onChange(newStartTime)
                  setValue('startDateTime', makeDate(startDate, newStartTime))
                }}
                error={fieldState.error}
              />
            )}
          />
        </Grid>
      </Grid>

      <Typography mb={2} mt={2} fontWeight={600}>
        {t('end-datepicker-section-title')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState }) => (
              <CourseDatePicker
                required
                name={field.name}
                label={t('end-date-placeholder')}
                value={field.value}
                minDate={startDate ?? minCourseStartDate}
                onChange={newEndDate => {
                  field.onChange(newEndDate)
                  setValue('endDateTime', makeDate(newEndDate, endTime))
                }}
                onBlur={field.onBlur}
                error={
                  fieldState.error || errors.endDateTime
                    ? { ...fieldState.error, ...errors.endDateTime }
                    : undefined
                }
              />
            )}
          />
        </Grid>
        <Grid item md={6} sm={12}>
          <Controller
            name="endTime"
            control={control}
            render={({ field, fieldState }) => (
              <CourseTimePicker
                required
                name={field.name}
                id="end"
                label={t('end-time-placeholder')}
                value={field.value}
                onChange={newEndTime => {
                  field.onChange(newEndTime)
                  setValue('endDateTime', makeDate(endDate, newEndTime))
                }}
                error={fieldState.error}
              />
            )}
          />
        </Grid>
        {displayTimeZoneSelector ? (
          <>
            <Grid item md={12}>
              <Typography fontWeight={600}>Time Zone</Typography>
            </Grid>
            <Grid item md={6} sm={12}>
              <Controller
                name="timeZone"
                control={control}
                render={({ fieldState }) => (
                  <TimeZoneSelector
                    code={residingCountry as string}
                    date={startDateTime as Date}
                    editCourse={!isCreation}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    ignoreVenue={
                      deliveryType === Course_Delivery_Type_Enum.Virtual
                    }
                    onChange={handleChangeTimeZoneSelector}
                    value={timeZone ?? null}
                    venue={venue}
                  />
                )}
              />
            </Grid>
          </>
        ) : null}
        {isResidingCountryEnabled ? (
          <Grid item>
            {/* timezone final wording::::This is a placeholder and is to be updated with the final wording provided by the client
                see https://behaviourhub.atlassian.net/browse/TTHP-2915
            */}
            <Alert severity="info" sx={{ mt: 1 }}>
              {t('timezone-info')}
            </Alert>
          </Grid>
        ) : null}
      </Grid>
    </LocalizationProvider>
  )
}
