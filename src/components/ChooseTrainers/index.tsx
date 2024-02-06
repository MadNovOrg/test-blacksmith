import { yupResolver } from '@hookform/resolvers/yup'
import { Box, FormHelperText, Stack, Typography } from '@mui/material'
import React, {
  RefObject,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react'
import {
  Controller,
  Resolver,
  UseFormReset,
  useForm,
  useWatch,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { useAuth } from '@app/context/auth'
import {
  BildStrategy,
  CourseTrainerType,
  SearchTrainer,
  SearchTrainerDetailsFragment,
  CourseLevel,
  Course_Type_Enum,
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'
import { isModeratorMandatory, isModeratorNeeded } from '@app/rules/trainers'
import { yup } from '@app/schemas'
import { CourseTrainer } from '@app/types'
import { RequiredTrainers } from '@app/util/trainerRatio/types'

import { SearchTrainers } from '../SearchTrainers'

export type FormValues = {
  lead: SearchTrainerDetailsFragment[]
  assist: SearchTrainerDetailsFragment[]
  moderator: SearchTrainerDetailsFragment[]
}

type Props = {
  trainers?: CourseTrainer[]
  courseLevel: CourseLevel | Course_Level_Enum
  courseType: Course_Type_Enum
  bildStrategies?: BildStrategy[]
  courseSchedule: { start: Date; end: Date }
  onChange?: (data: FormValues, isValid: boolean) => void
  autoFocus?: boolean
  disabled?: boolean
  showAssistHint?: boolean
  isReAccreditation: boolean
  isConversion?: boolean
  requiredLeaders?: RequiredTrainers
  methodsRef?: RefObject<{
    reset: UseFormReset<FormValues>
  }>
}

const courseTrainerToFormValues = (
  trainers: CourseTrainer[] = []
): FormValues => {
  const mappedTrainers = trainers.map(t => {
    return {
      id: t.profile.id,
      fullName: t.profile.fullName ?? '',
      email: t.profile.email,
      trainer_role_types: t.profile.trainer_role_types ?? [],
      avatar: t.profile.avatar,
      type: t.type,
      levels: t.levels,
    }
  })

  return {
    lead: mappedTrainers.filter(
      t => t.type === Course_Trainer_Type_Enum.Leader
    ),
    assist: mappedTrainers.filter(
      t => t.type === Course_Trainer_Type_Enum.Assistant
    ),
    moderator: mappedTrainers.filter(
      t => t.type === Course_Trainer_Type_Enum.Moderator
    ),
  }
}

const ChooseTrainers: React.FC<React.PropsWithChildren<Props>> = ({
  courseType,
  courseLevel,
  courseSchedule,
  bildStrategies,
  trainers = [],
  onChange = noop,
  autoFocus = true,
  disabled = false,
  isReAccreditation = false,
  isConversion = false,
  showAssistHint = true,
  requiredLeaders = { min: 0, max: 1 },
  methodsRef,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const needsModerator = useMemo(
    () =>
      isModeratorNeeded({
        courseLevel,
        courseType,
        isReaccreditation: isReAccreditation,
        isConversion,
      }),
    [courseLevel, courseType, isReAccreditation, isConversion]
  )

  const mandatoryModerator = useMemo(
    () =>
      isModeratorMandatory({
        courseType,
        courseLevel,
        isReaccreditation: isReAccreditation,
        isConversion,
      }),
    [courseType, courseLevel, isReAccreditation, isConversion]
  )

  const schema = useMemo(() => {
    return yup.object({
      lead: yup
        .array()
        .min(
          requiredLeaders.min,
          t('pages.create-course.assign-trainers.lead-error-min')
        )
        .max(
          requiredLeaders.max,
          t('pages.create-course.assign-trainers.lead-error-max')
        ),
      assist: yup.array().min(0),
      moderator: yup
        .array()
        .min(
          mandatoryModerator ? 1 : 0,
          t('pages.create-course.assign-trainers.moderator-error-min')
        )
        .max(
          needsModerator ? 1 : 0,
          t('pages.create-course.assign-trainers.moderator-error-max')
        ),
    })
  }, [
    requiredLeaders.min,
    requiredLeaders.max,
    t,
    mandatoryModerator,
    needsModerator,
  ])

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

  const { reset } = form

  useImperativeHandle(
    methodsRef,
    () => ({
      reset,
    }),
    [reset]
  )

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
      const ids = new Set(_trainers.map(t => t.id))
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
                max={requiredLeaders.max}
                autoFocus={autoFocus}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notUsedElsewhere('lead')}
                disabled={disabled}
                bildStrategies={bildStrategies}
                courseType={courseType}
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
          {t('pages.create-course.assign-trainers.assist-title')}
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
              bildStrategies={bildStrategies}
              courseType={courseType}
            />
          )}
        />
        {form.formState.errors.assist ? (
          <FormHelperText error data-testid="AssignTrainers-assist-error">
            {form.formState.errors.assist.message}
          </FormHelperText>
        ) : null}
        {showAssistHint ? (
          <FormHelperText data-testid="AssignTrainers-assist-hint">
            {t('pages.create-course.assign-trainers.assist-hint')}
          </FormHelperText>
        ) : null}
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
                courseType={courseType}
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
