import { yupResolver } from '@hookform/resolvers/yup'
import { Box, FormHelperText, Stack, Typography } from '@mui/material'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { Controller, Resolver, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { useAuth } from '@app/context/auth'
import {
  CourseTrainerType,
  SearchTrainer,
  SearchTrainerDetailsFragment,
} from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { CourseLevel, CourseTrainer, CourseType } from '@app/types'
import { RequiredAssistants } from '@app/util/trainerRatio'

import { SearchTrainers } from '../SearchTrainers'

export type FormValues = {
  lead: SearchTrainerDetailsFragment[]
  assist: SearchTrainerDetailsFragment[]
  moderator: SearchTrainerDetailsFragment[]
}

type Props = {
  trainers?: CourseTrainer[]
  courseType: CourseType
  courseLevel: CourseLevel
  courseSchedule: { start: Date; end: Date }
  onChange?: (data: FormValues, isValid: boolean) => void
  autoFocus?: boolean
  disabled?: boolean
  requiredAssistants: RequiredAssistants
  isReAccreditation: boolean
}

const courseTrainerToFormValues = (
  trainers: CourseTrainer[] = []
): FormValues => {
  const mappedTrainers = trainers.map(t => ({
    id: t.profile.id,
    fullName: t.profile.fullName ?? '',
    trainer_role_types: t.profile.trainer_role_types ?? [],
    avatar: t.profile.avatar,
    type: t.type,
    levels: t.levels,
  }))

  return {
    lead: mappedTrainers.filter(t => t.type === CourseTrainerType.Leader),
    assist: mappedTrainers.filter(t => t.type === CourseTrainerType.Assistant),
    moderator: mappedTrainers.filter(
      t => t.type === CourseTrainerType.Moderator
    ),
  }
}

const ChooseTrainers: React.FC<React.PropsWithChildren<Props>> = ({
  courseType,
  courseLevel,
  courseSchedule,
  requiredAssistants,
  trainers = [],
  onChange = noop,
  autoFocus = true,
  disabled = false,
  isReAccreditation = false,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const leadMin = useMemo(
    () => (courseType === CourseType.OPEN ? 0 : 1),
    [courseType]
  )

  const needsModerator = useMemo(() => {
    if (courseType === CourseType.INDIRECT) return false
    return !isReAccreditation
  }, [isReAccreditation, courseType])

  const schema = useMemo(() => {
    return yup.object({
      lead: yup
        .array()
        .min(leadMin, t('pages.create-course.assign-trainers.lead-error-min'))
        .max(1, t('pages.create-course.assign-trainers.lead-error-max')),
      assist: yup.array().min(0),
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
  }, [leadMin, t, needsModerator])

  const formTrainers = useMemo(
    () => courseTrainerToFormValues(trainers),
    [trainers]
  )

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues: formTrainers,
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
  })

  const formValues = useWatch({
    control: form.control,
  })

  useEffect(() => {
    onChange(formValues as FormValues, form.formState.isValid)
  }, [formValues, form.formState.isValid, onChange])

  const notUsedElsewhere = useCallback(
    (value: string) => (matches: SearchTrainer[]) => {
      const possibleValues = ['lead', 'assist', 'moderator'].filter(
        v => v !== value
      )
      const _trainers = possibleValues.flatMap(v =>
        form.getValues(v as keyof FormValues)
      )
      const ids = new Set(_trainers.map(t => (t as SearchTrainer).id))
      return matches.filter(m => !ids.has(m.id))
    },
    [form]
  )

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
                trainerType={CourseTrainerType.Leader}
                courseLevel={courseLevel}
                courseSchedule={courseSchedule}
                max={1}
                autoFocus={autoFocus}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notUsedElsewhere('lead')}
                disabled={disabled}
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
      <Box data-testid="AssignTrainers-assist">
        <Typography variant="subtitle1">
          {t('pages.create-course.assign-trainers.assist-title', {
            count: requiredAssistants.min,
          })}
        </Typography>
        <Controller
          name="assist"
          control={form.control}
          render={({ field }) => (
            <SearchTrainers
              trainerType={CourseTrainerType.Assistant}
              courseLevel={courseLevel}
              courseSchedule={courseSchedule}
              value={field.value}
              onChange={field.onChange}
              matchesFilter={notUsedElsewhere('assist')}
              disabled={disabled}
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
                trainerType={CourseTrainerType.Moderator}
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
