import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Alert, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ChooseTrainers, { FormValues } from '@app/components/ChooseTrainers'
import { CourseTrainerType, CourseType } from '@app/types'
import { LoadingStatus } from '@app/util'

import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const { completeStep, courseData, storeTrainers } = useCreateCourse()
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

  const handleSubmitButtonClick = async () => {
    completeStep('assign-trainers')

    if (courseData && trainers) {
      if (courseData.type === CourseType.CLOSED) {
        const trainersData = [
          ...trainers.assist.map(assistant => ({
            profile_id: assistant.id,
            type: CourseTrainerType.ASSISTANT,
            fullName: assistant.fullName,
          })),
          ...trainers.moderator.map(moderator => ({
            profile_id: moderator.id,
            type: CourseTrainerType.MODERATOR,
            fullName: moderator.fullName,
          })),
          ...trainers.lead.map(trainer => ({
            profile_id: trainer.id,
            type: CourseTrainerType.LEADER,
            fullName: trainer.fullName,
          })),
        ]

        await storeTrainers(trainersData)
        navigate('../trainer-expenses')
      } else {
        const trainersData = [
          ...trainers.assist.map(assistant => ({
            profile_id: assistant.id,
            type: CourseTrainerType.ASSISTANT,
          })),
          ...trainers.moderator.map(moderator => ({
            profile_id: moderator.id,
            type: CourseTrainerType.MODERATOR,
          })),
          ...trainers.lead.map(trainer => ({
            profile_id: trainer.id,
            type: CourseTrainerType.LEADER,
          })),
        ]

        await saveCourse(courseData, trainersData)
        navigate('/courses')
      }
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
          onClick={handleSubmitButtonClick}
        >
          {courseData.type === CourseType.CLOSED
            ? t('pages.create-course.step-navigation-trainer-expenses')
            : t('pages.create-course.assign-trainers.submit-btn')}
        </LoadingButton>
      </Box>
    </Stack>
  ) : null
}
