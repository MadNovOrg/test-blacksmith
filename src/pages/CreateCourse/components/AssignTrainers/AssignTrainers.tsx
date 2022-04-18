import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Box, Button, CircularProgress, Alert, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import ChooseTrainers, { FormValues } from '@app/components/ChooseTrainers'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { SetCourseTrainer } from '@app/queries/courses/set-course-trainers'
import { CourseTrainerType, SetCourseTrainerVars } from '@app/types'
import { LoadingStatus, profileToInput } from '@app/util'

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const [saving, setSaving] = useState(false)
  const [trainers, setTrainers] = useState<FormValues>()
  const [trainersDataValid, setTrainersDataValid] = useState(false)

  const { courseId = '' } = useParams()
  const { data: course, status: courseStatus } = useCourse(courseId)

  const saveTrainers = useCallback(async () => {
    const lead = trainers?.lead ?? []
    const assist = trainers?.assist ?? []

    if (!course || !trainersDataValid) return

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
  }, [fetcher, course, navigate, trainersDataValid, trainers])

  const handleTrainersDataChange = useCallback(
    (data: FormValues, isValid: boolean) => {
      setTrainers(data)
      setTrainersDataValid(isValid)
    },
    []
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

  return course ? (
    <Stack spacing={5}>
      <ChooseTrainers
        maxParticipants={course.max_participants}
        courseSchedule={course.schedule[0]}
        onChange={handleTrainersDataChange}
        trainers={course.trainers}
      />
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
          disabled={!trainersDataValid}
          loading={saving}
          sx={{ marginTop: 4 }}
          endIcon={<ArrowForwardIcon />}
          data-testid="AssignTrainers-submit"
          onClick={saveTrainers}
        >
          {t('pages.create-course.assign-trainers.submit-btn')}
        </LoadingButton>
      </Box>
    </Stack>
  ) : null
}
