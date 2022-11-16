import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ChooseTrainers, { FormValues } from '@app/components/ChooseTrainers'
import {
  CourseTrainer,
  CourseTrainerType,
  CourseType,
  InviteStatus,
  TrainerInput,
} from '@app/types'
import { LoadingStatus } from '@app/util'

import { StepsEnum } from '../../types'
import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'

const formValuesToTrainerInput = (trainers?: FormValues): TrainerInput[] => {
  if (!trainers) {
    return []
  }

  return [
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
}

const now = new Date()

const trainerInputToCourseTrainer = (
  trainers: TrainerInput[] = []
): CourseTrainer[] =>
  trainers.map(t => ({
    profile: {
      id: t.profile_id,
      fullName: t.fullName ?? '',
      givenName: t.fullName?.split(' ')[0] ?? '',
      familyName: t.fullName?.split(' ').slice(-1)[0] ?? '',
      email: '',
      phone: '',
      dob: '',
      jobTitle: '',
      avatar: '',
      title: '',
      tags: null,
      dietaryRestrictions: null,
      disabilities: null,
      addresses: [],
      attributes: [],
      contactDetails: [],
      preferences: [],
      organizations: [],
      roles: [],
      trainer_role_types: [],
      lastActivity: now,
      createdAt: now.toISOString(),
    },
    type: t.type,
    status: InviteStatus.PENDING,
    id: t.profile_id,
  }))

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const {
    completeStep,
    courseData,
    saveDraft,
    setCurrentStepKey,
    setTrainers,
    trainers,
  } = useCreateCourse()
  const navigate = useNavigate()
  const [trainersDataValid, setTrainersDataValid] = useState(false)
  const { savingStatus, saveCourse } = useSaveCourse()

  useEffect(() => {
    setCurrentStepKey(StepsEnum.ASSIGN_TRAINER)
  }, [setCurrentStepKey])

  const handleTrainersDataChange = useCallback(
    (data: FormValues, isValid: boolean) => {
      setTrainers(formValuesToTrainerInput(data))
      setTrainersDataValid(isValid)
    },
    [setTrainers]
  )

  const handleSubmitButtonClick = async () => {
    if (courseData && trainers) {
      const isClosedCourse = courseData.type === CourseType.CLOSED

      let nextPage: string
      if (isClosedCourse) {
        nextPage = '../trainer-expenses'
      } else {
        await saveCourse()
        nextPage = '/courses'
      }

      completeStep(StepsEnum.ASSIGN_TRAINER)
      navigate(nextPage)
    }
  }

  if (!courseData) {
    return (
      <Alert
        severity="error"
        variant="filled"
        data-testid="AssignTrainers-alert"
      >
        {t('pages.create-course.course-not-found')}
      </Alert>
    )
  }

  return courseData ? (
    <Stack spacing={5}>
      <ChooseTrainers
        maxParticipants={courseData.maxParticipants}
        courseType={courseData.type}
        courseLevel={courseData.courseLevel}
        courseSchedule={{
          start: courseData.startDateTime,
          end: courseData.endDateTime,
        }}
        onChange={handleTrainersDataChange}
        trainers={trainerInputToCourseTrainer(trainers)}
      />
      <Box display="flex" justifyContent="space-between" sx={{ marginTop: 4 }}>
        <Button
          onClick={() => navigate(`../../new?type=${courseData.type}`)}
          startIcon={<ArrowBackIcon />}
        >
          {t('pages.create-course.assign-trainers.back-btn')}
        </Button>

        <Box>
          <Button variant="text" sx={{ marginRight: 4 }} onClick={saveDraft}>
            {t('pages.create-course.save-as-draft')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!trainersDataValid}
            loading={savingStatus === LoadingStatus.FETCHING}
            endIcon={<ArrowForwardIcon />}
            data-testid="AssignTrainers-submit"
            onClick={handleSubmitButtonClick}
          >
            {courseData.type === CourseType.CLOSED
              ? t('pages.create-course.step-navigation-trainer-expenses')
              : t('pages.create-course.assign-trainers.submit-btn')}
          </LoadingButton>
        </Box>
      </Box>
    </Stack>
  ) : null
}
