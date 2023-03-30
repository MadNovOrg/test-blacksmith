import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Stack } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ChooseTrainers, { FormValues } from '@app/components/ChooseTrainers'
import { useAuth } from '@app/context/auth'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  CourseException,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import {
  CourseTrainer,
  CourseTrainerType,
  CourseType,
  InviteStatus,
  TrainerInput,
  TrainerRoleTypeName,
} from '@app/types'
import { LoadingStatus } from '@app/util'
import { getRequiredAssistants } from '@app/util/trainerRatio'

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
      type: CourseTrainerType.Assistant,
      fullName: assistant.fullName,
      levels: assistant.levels,
      seniorOrPrincipalLeader: false,
    })),
    ...trainers.moderator.map(moderator => ({
      profile_id: moderator.id,
      type: CourseTrainerType.Moderator,
      fullName: moderator.fullName,
      levels: moderator.levels,
      seniorOrPrincipalLeader: false,
    })),
    ...trainers.lead.map(trainer => ({
      profile_id: trainer.id,
      type: CourseTrainerType.Leader,
      fullName: trainer.fullName,
      levels: trainer.levels,
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
    levels: t.levels,
  }))

export const AssignTrainers = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()
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
  const [seniorOrPrincipalLead, setSeniorOrPrincipalLead] = useState(false)
  const { savingStatus, saveCourse } = useSaveCourse()
  const [courseExceptions, setCourseExceptions] = useState<CourseException[]>(
    []
  )

  useEffect(() => {
    setCurrentStepKey(StepsEnum.ASSIGN_TRAINER)
  }, [setCurrentStepKey])

  const handleTrainersDataChange = useCallback(
    (data: FormValues, isValid: boolean) => {
      setSeniorOrPrincipalLead(
        data.lead.some(lead =>
          lead.trainer_role_types.some(
            ({ trainer_role_type: role }) =>
              role?.name === TrainerRoleTypeName.SENIOR ||
              role?.name === TrainerRoleTypeName.PRINCIPAL
          )
        )
      )
      setTrainers(formValuesToTrainerInput(data))
      setTrainersDataValid(isValid)
    },
    [setTrainers]
  )

  const requiredAssistants = useMemo(() => {
    if (courseData) {
      return getRequiredAssistants({
        ...courseData,
        hasSeniorOrPrincipalLeader:
          courseData.type === CourseType.INDIRECT && seniorOrPrincipalLead,
      })
    }
    return {
      min: 0,
      max: 0,
    }
  }, [courseData, seniorOrPrincipalLead])

  const submit = useCallback(async () => {
    if (courseData && trainers) {
      const isClosedCourse = courseData.type === CourseType.CLOSED

      let nextPage: string
      if (isClosedCourse) {
        nextPage = '../trainer-expenses'
      } else {
        const id = await saveCourse()
        nextPage = '/courses'

        if (!id) {
          return
        }
      }

      completeStep(StepsEnum.ASSIGN_TRAINER)
      navigate(nextPage)
    }
  }, [completeStep, courseData, navigate, saveCourse, trainers])

  const handleSubmitButtonClick = useCallback(async () => {
    if (courseData) {
      const exceptions = checkCourseDetailsForExceptions(
        { ...courseData, hasSeniorOrPrincipalLeader: seniorOrPrincipalLead },
        trainers
      )
      if (!acl.isTTAdmin() && exceptions.length > 0) {
        setCourseExceptions(exceptions)
      } else {
        await submit()
      }
    }
  }, [acl, courseData, seniorOrPrincipalLead, submit, trainers])

  if (!courseData) {
    return (
      <Alert
        severity="error"
        variant="outlined"
        data-testid="AssignTrainers-alert"
      >
        {t('pages.create-course.course-not-found')}
      </Alert>
    )
  }

  return courseData ? (
    <>
      {savingStatus === LoadingStatus.ERROR ? (
        <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
          {t('pages.create-course.error-creating-course')}
        </Alert>
      ) : null}
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
          requiredAssistants={requiredAssistants}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ marginTop: 4 }}
        >
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

        <CourseExceptionsConfirmation
          open={courseExceptions.length > 0}
          onCancel={() => setCourseExceptions([])}
          onSubmit={submit}
          exceptions={courseExceptions}
        />
      </Stack>
    </>
  ) : null
}
