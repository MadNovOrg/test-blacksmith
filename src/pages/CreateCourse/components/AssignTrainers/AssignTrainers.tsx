import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Alert, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ChooseTrainers, { FormValues } from '@app/components/ChooseTrainers'
import { CourseTrainerType } from '@app/types'
import { LoadingStatus } from '@app/util'

import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const { courseData } = useCreateCourse()
  const navigate = useNavigate()
  const [trainers, setTrainers] = useState<FormValues>()
  const [trainersDataValid, setTrainersDataValid] = useState(false)
  const { savingStatus, saveCourse } = useSaveCourse()

  const handleTrainersDataChange = useCallback(
    (data: FormValues, isValid: boolean) => {
      setTrainers(data)
      setTrainersDataValid(isValid)
    },
    []
  )

  const handleSaveButtonClick = async () => {
    if (courseData && trainers) {
      await saveCourse(courseData, [
        ...trainers.assist.map(assistant => ({
          profile_id: assistant.id,
          type: CourseTrainerType.ASSISTANT,
        })),
        ...trainers.lead.map(trainer => ({
          profile_id: trainer.id,
          type: CourseTrainerType.LEADER,
        })),
      ])

      navigate('/courses')
    }
  }

  if (!courseData) {
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

  return courseData ? (
    <Stack spacing={5}>
      <ChooseTrainers
        maxParticipants={courseData.maxParticipants}
        courseLevel={courseData.courseLevel}
        courseSchedule={{
          start: courseData.startDateTime,
          end: courseData.endDateTime,
        }}
        onChange={handleTrainersDataChange}
      />
      <Box display="flex" justifyContent="space-between">
        <Button
          sx={{ marginTop: 4 }}
          onClick={() => navigate(`../../new?type=${courseData.type}`)}
          startIcon={<ArrowBackIcon />}
        >
          {t('pages.create-course.assign-trainers.back-btn')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!trainersDataValid}
          loading={savingStatus === LoadingStatus.FETCHING}
          sx={{ marginTop: 4 }}
          endIcon={<ArrowForwardIcon />}
          data-testid="AssignTrainers-submit"
          onClick={handleSaveButtonClick}
        >
          {t('pages.create-course.assign-trainers.submit-btn')}
        </LoadingButton>
      </Box>
    </Stack>
  ) : null
}
