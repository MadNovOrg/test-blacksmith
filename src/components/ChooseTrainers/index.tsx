import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Box, FormHelperText, Stack } from '@mui/material'
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
import { CourseTrainer, CourseSchedule, SearchTrainer } from '@app/types'
import {
  getCourseAssistants,
  getCourseTrainer,
  getNumberOfAssistants,
} from '@app/util'

import { SearchTrainers } from '../SearchTrainers'

export type FormValues = UnpackNestedValue<NestedFormValues>

type NestedFormValues = {
  lead: NestedValue<SearchTrainer[]>
  assist: NestedValue<SearchTrainer[]>
}

type Props = {
  maxParticipants: number
  trainers?: CourseTrainer[]
  courseSchedule: Pick<CourseSchedule, 'start' | 'end'>
  onChange?: (data: FormValues, isValid: boolean) => void
  autoFocus?: boolean
}

const ChooseTrainers: React.FC<Props> = ({
  maxParticipants,
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

  const schema = useMemo(() => {
    return yup.object({
      lead: yup
        .array()
        .min(1, t('pages.create-course.assign-trainers.lead-error-min'))
        .max(1, t('pages.create-course.assign-trainers.lead-error-max')),
      assist: yup.array().min(
        assistMin,
        t('pages.create-course.assign-trainers.assist-hint', {
          count: assistMin,
        })
      ),
    })
  }, [t, assistMin])

  const form = useForm<NestedFormValues>({
    mode: 'all',
    defaultValues: { lead: [], assist: [] },
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
  }, [form, trainers])

  const notLead = useCallback(
    (matches: SearchTrainer[]) => {
      const lead = form.getValues('lead')
      const ids = new Set(lead.map(t => t.id))
      return matches.filter(m => !ids.has(m.id))
    },
    [form]
  )

  const notAssistant = useCallback(
    (matches: SearchTrainer[]) => {
      const assistants = form.getValues('assist')
      const ids = new Set(assistants.map(t => t.id))
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
    <Stack component="form" data-testid="AssignTrainers-form">
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
                courseSchedule={courseSchedule}
                max={1}
                autoFocus={autoFocus}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notAssistant}
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
              count: assistMin,
            })}
          </Typography>
          <Controller
            name="assist"
            control={form.control}
            render={({ field }) => (
              <SearchTrainers
                courseSchedule={courseSchedule}
                max={3}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notLead}
              />
            )}
          />
          {form.formState.errors.assist ? (
            <FormHelperText error data-testid="AssignTrainers-assist-error">
              {form.formState.errors.assist.message}
            </FormHelperText>
          ) : (
            <FormHelperText data-testid="AssignTrainers-assist-hint">
              {t('pages.create-course.assign-trainers.assist-hint', {
                count: assistMin,
              })}
            </FormHelperText>
          )}
        </Box>
      ) : null}
    </Stack>
  )
}

export default memo(ChooseTrainers)
