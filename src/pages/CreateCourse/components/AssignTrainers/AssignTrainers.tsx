import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ChooseTrainers, { FormValues } from '@app/components/ChooseTrainers'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  BildStrategy,
  Course_Exception_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  isTrainersRatioNotMet,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import {
  CourseTrainer,
  InviteStatus,
  TrainerInput,
  TrainerRoleType,
  TrainerRoleTypeName,
} from '@app/types'
import {
  LoadingStatus,
  bildStrategiesToArray,
  checkIsETA,
  checkIsEmployerAOL,
} from '@app/util'
import { getRequiredLeads } from '@app/util/trainerRatio'

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
      type: Course_Trainer_Type_Enum.Assistant,
      fullName: assistant.fullName,
      levels: assistant.levels,
      seniorOrPrincipalLeader: false,
      trainer_role_types: assistant.trainer_role_types,
    })),
    ...trainers.moderator.map(moderator => ({
      profile_id: moderator.id,
      type: Course_Trainer_Type_Enum.Moderator,
      fullName: moderator.fullName,
      levels: moderator.levels,
      seniorOrPrincipalLeader: false,
      trainer_role_types: moderator.trainer_role_types,
    })),
    ...trainers.lead.map(trainer => ({
      profile_id: trainer.id,
      type: Course_Trainer_Type_Enum.Leader,
      fullName: trainer.fullName,
      levels: trainer.levels,
      trainer_role_types: trainer.trainer_role_types,
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
  const { completeStep, courseData, setCurrentStepKey, setTrainers, trainers } =
    useCreateCourse()
  const { addSnackbarMessage } = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const [trainersDataValid, setTrainersDataValid] = useState(false)
  const [seniorOrPrincipalLead, setSeniorOrPrincipalLead] = useState(false)
  const [isETA, setIsETA] = useState(false)
  const [isEmployerAOL, setIsEmployerAOL] = useState(false)
  const { savingStatus, saveCourse } = useSaveCourse()
  const [courseExceptions, setCourseExceptions] = useState<
    Course_Exception_Enum[]
  >([])

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
      setIsETA(
        data.lead.some(lead =>
          checkIsETA(lead.trainer_role_types as TrainerRoleType[])
        )
      )
      setIsEmployerAOL(
        data.lead.some(lead =>
          checkIsEmployerAOL(lead.trainer_role_types as TrainerRoleType[])
        )
      )
      setTrainers(formValuesToTrainerInput(data))
      setTrainersDataValid(isValid)
    },
    [setTrainers]
  )

  const submit = useCallback(async () => {
    if (courseData && trainers) {
      const isClosedCourse = courseData.type === Course_Type_Enum.Closed

      let nextPage: string
      if (isClosedCourse) {
        nextPage = '../trainer-expenses'
      } else {
        const savedCourse = await saveCourse()

        addSnackbarMessage('course-created', {
          label: (
            <Trans
              i18nKey="pages.create-course.submitted-course"
              values={{ code: savedCourse?.courseCode }}
            >
              <Link
                underline="always"
                href={`/manage-courses/all/${savedCourse?.id}/details`}
              >
                {savedCourse?.courseCode}
              </Link>
            </Trans>
          ),
        })

        nextPage =
          acl.isTTAdmin() || acl.isSalesAdmin()
            ? `/courses/${savedCourse?.id}/details`
            : '/courses'

        if (!savedCourse?.id) {
          return
        }
      }

      completeStep(StepsEnum.ASSIGN_TRAINER)
      navigate(nextPage)
    }
  }, [
    courseData,
    trainers,
    completeStep,
    navigate,
    saveCourse,
    addSnackbarMessage,
    acl,
  ])

  const handleSubmitButtonClick = useCallback(async () => {
    if (courseData) {
      const exceptions = checkCourseDetailsForExceptions(
        {
          ...courseData,
          hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
          usesAOL: courseData.usesAOL,
          isTrainer: acl.isTrainer(),
          isETA: isETA,
          isEmployerAOL: isEmployerAOL,
        },
        trainers
      )
      if (
        courseData.type === Course_Type_Enum.Closed &&
        exceptions.length > 0
      ) {
        setCourseExceptions(exceptions)
      } else {
        await submit()
      }
    }
  }, [
    acl,
    courseData,
    isETA,
    isEmployerAOL,
    seniorOrPrincipalLead,
    submit,
    trainers,
  ])

  const requiredLeaders = useMemo(() => {
    if (courseData) {
      return getRequiredLeads(courseData.type)
    } else {
      return { max: 1, min: 0 }
    }
  }, [courseData])

  const showTrainerRatioWarning = useMemo(() => {
    return (
      courseData?.courseLevel &&
      isTrainersRatioNotMet(
        {
          ...courseData,
          level: courseData.courseLevel,
          max_participants: courseData.maxParticipants,
          usesAOL: courseData.usesAOL,
        },
        trainers.map(trainer => ({
          type: trainer.type,
          trainer_role_types: trainer.trainer_role_types,
        }))
      )
    )
  }, [courseData, trainers])

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
          courseType={courseData.type}
          courseLevel={courseData.courseLevel}
          courseSchedule={{
            start: courseData.startDateTime,
            end: courseData.endDateTime,
          }}
          onChange={handleTrainersDataChange}
          trainers={trainerInputToCourseTrainer(trainers)}
          isReAccreditation={courseData.reaccreditation}
          isConversion={courseData.conversion}
          requiredLeaders={requiredLeaders}
          bildStrategies={
            bildStrategiesToArray(
              courseData.bildStrategies
            ) as unknown as BildStrategy[]
          }
        />

        {showTrainerRatioWarning ? (
          <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
            {t(
              `pages.create-course.exceptions.type_${Course_Exception_Enum.TrainerRatioNotMet}`
            )}
          </Alert>
        ) : null}

        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          sx={{ marginTop: 4 }}
        >
          <Box mb={2}>
            <Button
              onClick={() => navigate(`../../new?type=${courseData.type}`)}
              startIcon={<ArrowBackIcon />}
            >
              {t('pages.create-course.assign-trainers.back-btn')}
            </Button>
          </Box>
          <Box mb={2}>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={!trainersDataValid}
              loading={savingStatus === LoadingStatus.FETCHING}
              endIcon={<ArrowForwardIcon />}
              fullWidth={isMobile}
              data-testid="AssignTrainers-submit"
              onClick={handleSubmitButtonClick}
            >
              {courseData.type === Course_Type_Enum.Closed
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
          courseType={courseData?.type}
        />
      </Stack>
    </>
  ) : null
}
