import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Box, FormHelperText, Stack } from '@mui/material'
import { differenceInDays } from 'date-fns'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import {
  useForm,
  Controller,
  NestedValue,
  Resolver,
  UnpackNestedValue,
  useWatch,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { useAuth } from '@app/context/auth'
import { yup } from '@app/schemas'
import {
  CourseTrainer,
  CourseSchedule,
  SearchTrainer,
  CourseTrainerType,
  CourseLevel,
} from '@app/types'
import {
  getCourseAssistants,
  getCourseModerator,
  getCourseTrainer,
  getNumberOfAssistants,
} from '@app/util'

import { SearchTrainers } from '../SearchTrainers'

export type FormValues = UnpackNestedValue<NestedFormValues>

type NestedFormValues = {
  lead: NestedValue<SearchTrainer[]>
  assist: NestedValue<SearchTrainer[]>
  moderator: NestedValue<SearchTrainer[]>
}

type Props = {
  maxParticipants: number
  trainers?: CourseTrainer[]
  courseLevel: CourseLevel
  courseSchedule: Pick<CourseSchedule, 'start' | 'end'>
  onChange?: (data: FormValues, isValid: boolean) => void
  autoFocus?: boolean
}

const ChooseTrainers: React.FC<Props> = ({
  maxParticipants,
  courseLevel,
  courseSchedule,
  trainers = [],
  onChange = noop,
  autoFocus = true,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const assistMin = useMemo(() => {
    return getNumberOfAssistants(maxParticipants)
  }, [maxParticipants])

  const adminBypassAssistMin = useMemo(
    () => (acl.isAdmin() ? 0 : assistMin),
    [acl, assistMin]
  )

  const needsModerator = useMemo(() => {
    const duration = differenceInDays(courseSchedule.end, courseSchedule.start)

    switch (courseLevel) {
      case CourseLevel.ADVANCED:
      case CourseLevel.ADVANCED_TRAINER:
        return duration >= 4

      case CourseLevel.INTERMEDIATE_TRAINER:
        return duration >= 5

      default:
        return false
    }
  }, [courseSchedule, courseLevel])

  const schema = useMemo(() => {
    return yup.object({
      lead: yup
        .array()
        .min(1, t('pages.create-course.assign-trainers.lead-error-min'))
        .max(1, t('pages.create-course.assign-trainers.lead-error-max')),
      assist: yup.array().min(
        adminBypassAssistMin,
        t('pages.create-course.assign-trainers.assist-hint', {
          count: adminBypassAssistMin,
        })
      ),
      moderator: yup
        .array()
        .min(
          needsModerator ? 1 : 0,
          t('pages.create-course.assign-trainers.moderator-error-min')
        )
        .max(
          needsModerator ? 1 : 0,
          t('pages.create-course.assign-trainers.moderator-error-max')
        ),
    })
  }, [t, adminBypassAssistMin, needsModerator])

  const form = useForm<NestedFormValues>({
    mode: 'all',
    defaultValues: { lead: [], assist: [], moderator: [] },
    resolver: yupResolver(schema) as unknown as Resolver<NestedFormValues>, // fixed in v8. See https://github.com/react-hook-form/react-hook-form/issues/7888
  })

  const formValues = useWatch({
    control: form.control,
  })

  useEffect(() => {
    onChange(formValues as FormValues, form.formState.isValid)
  }, [formValues, form.formState, onChange])

  useEffect(() => {
    const lead = getCourseTrainer(trainers)
    if (lead?.profile) {
      form.setValue('lead', [lead.profile], { shouldValidate: true })
    }

    const assistants = getCourseAssistants(trainers).map(t => t.profile)
    if (assistants.length) {
      form.setValue('assist', assistants, { shouldValidate: true })
    }

    const moderator = getCourseModerator(trainers)
    if (moderator?.profile) {
      form.setValue('moderator', [moderator.profile], { shouldValidate: true })
    }
  }, [form, trainers])

  const notUsedElsewhere = useCallback(
    (value: string) => (matches: SearchTrainer[]) => {
      const possibleValues = ['lead', 'assist', 'moderator'].filter(
        v => v !== value
      )
      const trainers = possibleValues.flatMap(v =>
        form.getValues(v as keyof NestedFormValues)
      )
      const ids = new Set(trainers.map(t => (t as SearchTrainer).id))
      return matches.filter(m => !ids.has(m.id))
    },
    [form]
  )

  useEffect(() => {
    const minAssistants = getNumberOfAssistants(maxParticipants)

    if (minAssistants === 0) {
      form.setValue('assist', [], { shouldValidate: true })
    }
  }, [maxParticipants, form])

  return (
    <Stack component="form" spacing={5} data-testid="AssignTrainers-form">
      {acl.canAssignLeadTrainer() ? (
        <Box data-testid="AssignTrainers-lead">
          <Typography variant="subtitle1">
            {t('pages.create-course.assign-trainers.lead-title')}
          </Typography>
          <Controller
            name="lead"
            control={form.control}
            render={({ field }) => (
              <SearchTrainers
                trainerType={CourseTrainerType.LEADER}
                courseLevel={courseLevel}
                courseSchedule={courseSchedule}
                max={1}
                autoFocus={autoFocus}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notUsedElsewhere('lead')}
              />
            )}
          />
          {form.formState.errors.lead ? (
            <FormHelperText error>
              {form.formState.errors.lead.message}
            </FormHelperText>
          ) : null}
        </Box>
      ) : null}

      {assistMin > 0 ? (
        <Box data-testid="AssignTrainers-assist">
          <Typography variant="subtitle1">
            {t('pages.create-course.assign-trainers.assist-title', {
              count: adminBypassAssistMin,
            })}
          </Typography>
          <Controller
            name="assist"
            control={form.control}
            render={({ field }) => (
              <SearchTrainers
                trainerType={CourseTrainerType.ASSISTANT}
                courseLevel={courseLevel}
                courseSchedule={courseSchedule}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notUsedElsewhere('assist')}
              />
            )}
          />
          {form.formState.errors.assist ? (
            <FormHelperText error data-testid="AssignTrainers-assist-error">
              {form.formState.errors.assist.message}
            </FormHelperText>
          ) : (
            <FormHelperText data-testid="AssignTrainers-assist-hint">
              {t('pages.create-course.assign-trainers.assist-hint')}
            </FormHelperText>
          )}
        </Box>
      ) : null}

      {needsModerator ? (
        <Box data-testid="AssignTrainers-moderator">
          <Typography variant="subtitle1">
            {t('pages.create-course.assign-trainers.moderator-title')}
          </Typography>
          <Controller
            name="moderator"
            control={form.control}
            render={({ field }) => (
              <SearchTrainers
                trainerType={CourseTrainerType.MODERATOR}
                courseLevel={courseLevel}
                courseSchedule={courseSchedule}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notUsedElsewhere('moderator')}
              />
            )}
          />
          {form.formState.errors.moderator ? (
            <FormHelperText error data-testid="AssignTrainers-moderator-error">
              {form.formState.errors.moderator.message}
            </FormHelperText>
          ) : null}
        </Box>
      ) : null}
    </Stack>
  )
}

export default memo(ChooseTrainers)
