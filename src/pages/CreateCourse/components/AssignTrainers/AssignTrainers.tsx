import { yupResolver } from '@hookform/resolvers/yup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Typography,
  Box,
  FormHelperText,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useForm,
  Controller,
  NestedValue,
  Resolver,
  UnpackNestedValue,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { SetCourseTrainer } from '@app/queries/courses/set-course-trainers'
import { yup } from '@app/schemas'
import {
  Course,
  CourseTrainerType,
  SetCourseTrainerVars,
  SetCourseTrainerInput,
} from '@app/types'
import {
  getCourseAssistants,
  getCourseTrainer,
  getNumberOfAssistants,
  LoadingStatus,
} from '@app/util'

import { SearchTrainers } from './SearchTrainers'
import { SearchTrainer } from './SearchTrainers/types'

type FormValues = {
  lead: NestedValue<SearchTrainer[]>
  assist: NestedValue<SearchTrainer[]>
}

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const [saving, setSaving] = useState(false)

  const { courseId = '' } = useParams()
  const { data: course, status: courseStatus } = useCourse(courseId)

  const assistMin = useMemo(() => {
    const { max_participants = 0 } = course ?? {}
    return getNumberOfAssistants(max_participants)
  }, [course])

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

  const form = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { lead: [], assist: [] },
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>, // fixed in v8. See https://github.com/react-hook-form/react-hook-form/issues/7888
  })

  useEffect(() => {
    if (!course) return

    const lead = getCourseTrainer(course)
    if (lead?.profile) {
      form.setValue('lead', [lead.profile], { shouldValidate: true })
    }

    const assistants = getCourseAssistants(course).map(t => t.profile)
    if (assistants.length) {
      form.setValue('assist', assistants, { shouldValidate: true })
    }
  }, [course, form])

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

  const onSubmit = useCallback(
    async ({ lead, assist }: UnpackNestedValue<FormValues>) => {
      if (!course || !form.formState.isValid) return

      setSaving(true)
      const vars: SetCourseTrainerVars = {
        courseId: course.id,
        trainers: [
          ...lead.map(profileToInput(course, CourseTrainerType.LEADER)),
          ...assist.map(profileToInput(course, CourseTrainerType.ASSISTANT)),
        ],
      }

      try {
        await fetcher(SetCourseTrainer, vars)
        setSaving(false)
        navigate('/courses')
      } catch (error) {
        console.error(error)
        setSaving(false)
      }
    },
    [fetcher, course, navigate, form]
  )

  if (courseStatus === LoadingStatus.FETCHING) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        data-testid="AssignTrainers-loading"
      >
        <CircularProgress size={40} />
      </Stack>
    )
  }

  if (!course || courseStatus === LoadingStatus.ERROR) {
    return (
      <Alert
        severity="error"
        variant="filled"
        data-testid="AssignTrainers-alert"
      >
        {t('pages.create-course.assign-trainers.course-not-found')}
      </Alert>
    )
  }

  return (
    <Stack
      component="form"
      spacing={5}
      onSubmit={form.handleSubmit(onSubmit)}
      data-testid="AssignTrainers-form"
    >
      <Box data-testid="AssignTrainers-lead">
        <Typography variant="subtitle1">
          {t('pages.create-course.assign-trainers.lead-title')}
        </Typography>
        <Controller
          name="lead"
          control={form.control}
          render={({ field }) => (
            <SearchTrainers
              courseSchedule={course.schedule[0]}
              max={1}
              autoFocus={true}
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
                courseSchedule={course.schedule[0]}
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

      <Box display="flex" justifyContent="space-between">
        <Button
          sx={{ marginTop: 4 }}
          onClick={() => navigate(`../../new?type=${course?.type}`)}
          startIcon={<ArrowBackIcon />}
        >
          {t('pages.create-course.assign-trainers.back-btn')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!form.formState.isValid}
          loading={saving}
          sx={{ marginTop: 4 }}
          endIcon={<ArrowForwardIcon />}
          data-testid="AssignTrainers-submit"
        >
          {t('pages.create-course.assign-trainers.submit-btn')}
        </LoadingButton>
      </Box>
    </Stack>
  )
}

function profileToInput(course: Course, type: CourseTrainerType) {
  return (p: SearchTrainer): SetCourseTrainerInput => ({
    course_id: course.id,
    profile_id: p.id,
    type,
  })
}
