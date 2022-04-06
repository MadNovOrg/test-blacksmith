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
import React, { useCallback, useMemo } from 'react'
import { useForm, Controller, NestedValue, Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import { yup } from '@app/schemas'
import { LoadingStatus } from '@app/util'

import { SearchTrainers } from './SearchTrainers'
import { Trainer } from './types'

type FormValues = {
  lead: NestedValue<Trainer[]>
  assistant: NestedValue<Trainer[]>
}

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { courseId = '' } = useParams()
  const { data: course, status: courseStatus } = useCourse(courseId)

  const minAssistants = useMemo(() => {
    const { max_participants = 0 } = course ?? {}
    return Math.floor((max_participants ?? 0) / 12)
  }, [course])

  const schema = useMemo(() => {
    return yup.object({
      lead: yup
        .array()
        .min(1, t('pages.create-course.assign-trainers.lead-error-min'))
        .max(1, t('pages.create-course.assign-trainers.lead-error-max')),
      assistant: yup.array().min(
        minAssistants,
        t('pages.create-course.assign-trainers.assistant-hint', {
          count: minAssistants,
        })
      ),
    })
  }, [t, minAssistants])

  const { getValues, control, formState } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { lead: [], assistant: [] },
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>, // fixed in v8. See https://github.com/react-hook-form/react-hook-form/issues/7888
  })

  const notLead = useCallback(
    (matches: Trainer[]) => {
      const lead = getValues('lead')
      const ids = new Set(lead.map(t => t.id))
      return matches.filter(m => !ids.has(m.id))
    },
    [getValues]
  )

  const notAssistant = useCallback(
    (matches: Trainer[]) => {
      const assistants = getValues('assistant')
      const ids = new Set(assistants.map(t => t.id))
      return matches.filter(m => !ids.has(m.id))
    },
    [getValues]
  )

  if (courseStatus === LoadingStatus.FETCHING) {
    return (
      <Stack direction="row" justifyContent="center">
        <CircularProgress size={40} />
      </Stack>
    )
  }

  if (courseStatus === LoadingStatus.ERROR || !course) {
    return (
      <Alert severity="error" variant="filled">
        {t('pages.create-course.assign-trainers.course-not-found')}
      </Alert>
    )
  }

  return (
    <Stack component="form" spacing={5}>
      <Box>
        <Typography variant="subtitle1">
          {t('pages.create-course.assign-trainers.lead-title')}
        </Typography>
        <Controller
          name="lead"
          control={control}
          render={({ field }) => (
            <SearchTrainers
              max={1}
              autoFocus={true}
              value={field.value}
              onChange={field.onChange}
              matchesFilter={notAssistant}
            />
          )}
        />
        {formState.errors.lead ? (
          <FormHelperText error>{formState.errors.lead.message}</FormHelperText>
        ) : null}
      </Box>

      {minAssistants > 0 ? (
        <Box>
          <Typography variant="subtitle1">
            {t('pages.create-course.assign-trainers.assistant-title', {
              count: minAssistants,
            })}
          </Typography>
          <Controller
            name="assistant"
            control={control}
            render={({ field }) => (
              <SearchTrainers
                max={3}
                value={field.value}
                onChange={field.onChange}
                matchesFilter={notLead}
              />
            )}
          />
          {formState.errors.assistant ? (
            <FormHelperText error>
              {formState.errors.assistant.message}
            </FormHelperText>
          ) : (
            <FormHelperText>
              {t('pages.create-course.assign-trainers.assistant-hint', {
                count: minAssistants,
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
          variant="contained"
          disabled={!formState.isValid}
          sx={{ marginTop: 4 }}
          onClick={() => console.log(getValues())}
          endIcon={<ArrowForwardIcon />}
        >
          {t('pages.create-course.assign-trainers.submit-btn')}
        </LoadingButton>
      </Box>
    </Stack>
  )
}
