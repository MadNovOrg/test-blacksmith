import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import CourseForm from '@app/components/CourseForm'
import { SearchTrainers } from '@app/components/SearchTrainers'
import { useAuth } from '@app/context/auth'
import {
  CourseLevel,
  CourseTrainerType,
  SearchTrainer,
} from '@app/generated/graphql'
import useProfile from '@app/hooks/useProfile'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  CourseException,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import {
  CourseInput,
  CourseType,
  InviteStatus,
  TrainerInput,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import { LoadingStatus } from '@app/util'

import { StepsEnum } from '../../types'
import { useSaveCourse } from '../../useSaveCourse'
import { useCreateCourse } from '../CreateCourseProvider'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean
): asserts data is ValidCourseInput {
  if (!isValid) {
    throw new Error()
  }
}

export const CreateCourseForm = () => {
  const {
    completeStep,
    courseData,
    courseType,
    saveDraft,
    setCourseData,
    setCurrentStepKey,
    setTrainers,
  } = useCreateCourse()

  const { savingStatus, saveCourse } = useSaveCourse()
  const [assistants, setAssistants] = useState<SearchTrainer[]>([])
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()

  const [courseExceptions, setCourseExceptions] = useState<CourseException[]>(
    []
  )

  const { certifications } = useProfile(profile?.id)

  const [consentFlags, setConsentFlags] = useState({
    healthLeaflet: false,
    practiceProtocols: false,
    validID: false,
  })

  useEffect(() => {
    if (courseType === CourseType.INDIRECT && profile && certifications) {
      setTrainers([
        {
          profile_id: profile.id,
          type: CourseTrainerType.Leader,
          status: InviteStatus.ACCEPTED,
          levels: certifications as TrainerInput['levels'],
        },
        ...assistants.map(assistant => ({
          profile_id: assistant.id,
          type: CourseTrainerType.Assistant,
          status: InviteStatus.PENDING,
          levels: certifications as TrainerInput['levels'],
        })),
      ])
    }
  }, [assistants, courseType, setTrainers, profile, certifications])

  useEffect(() => {
    setCurrentStepKey(StepsEnum.COURSE_DETAILS)
  }, [setCurrentStepKey])

  const seniorOrPrincipalLead = useMemo(() => {
    return (
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL
      ) ?? false
    )
  }, [profile])

  const nextStepEnabled = useMemo(() => {
    if (courseType !== CourseType.INDIRECT) {
      return courseDataValid
    }

    const hasCheckedAllFlags =
      Object.values(consentFlags).filter(flag => flag === false).length === 0

    return hasCheckedAllFlags && courseDataValid
  }, [consentFlags, courseDataValid, courseType])

  const submit = useCallback(async () => {
    if (!courseData || !profile) return

    if (courseData.blendedLearning && courseData.type === CourseType.INDIRECT) {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./license-order-details')
    } else if (courseType === CourseType.INDIRECT) {
      const id = await saveCourse()

      if (id) {
        navigate(`/courses/${id}/modules`)
      }
    } else {
      completeStep(StepsEnum.COURSE_DETAILS)
      navigate('./assign-trainers')
    }
  }, [completeStep, courseData, courseType, navigate, profile, saveCourse])

  const handleNextStepButtonClick = async () => {
    if (!courseData || !profile) return

    assertCourseDataValid(courseData, courseDataValid)

    if (courseType === CourseType.INDIRECT && !acl.isTTAdmin()) {
      const exceptions = checkCourseDetailsForExceptions(
        { ...courseData, hasSeniorOrPrincipalLeader: seniorOrPrincipalLead },
        assistants.map(assistant => ({
          profile_id: assistant.id,
          type: CourseTrainerType.Assistant,
          fullName: assistant.fullName,
          levels: assistant.levels,
        }))
      )
      setCourseExceptions(exceptions)
      if (exceptions.length > 0) return
    }
    await submit()
  }

  const handleConsentFlagChange = (
    flag: keyof typeof consentFlags,
    checked: boolean
  ) => {
    setConsentFlags({
      ...consentFlags,
      [flag]: checked,
    })
  }

  const handleCourseFormChange = useCallback(
    ({ data, isValid }: { data?: CourseInput; isValid?: boolean }) => {
      // Type casting to save the data in context
      // Validation still happens before moving to the next step
      if (data) {
        setCourseData(data as unknown as ValidCourseInput)
      }

      setCourseDataValid(Boolean(isValid))
    },
    [setCourseData]
  )

  const nextStepButtonLabel =
    courseData?.blendedLearning && courseData.type === CourseType.INDIRECT
      ? 'order-details-button-text'
      : courseType === CourseType.INDIRECT
      ? 'course-builder-button-text'
      : 'select-trainers-button-text'

  return (
    <Box paddingBottom={5}>
      {savingStatus === LoadingStatus.ERROR ? (
        <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
          {t('pages.create-course.error-creating-course')}
        </Alert>
      ) : null}
      <CourseForm
        onChange={handleCourseFormChange}
        type={courseType}
        courseInput={courseData}
      />

      {courseType === CourseType.INDIRECT ? (
        <>
          <Typography mt={2} mb={2} variant="h5" fontWeight={500}>
            {t('pages.create-course.assign-trainers-title')}
          </Typography>

          <SearchTrainers
            trainerType={CourseTrainerType.Assistant}
            courseLevel={courseData?.courseLevel || CourseLevel.Level_1}
            courseSchedule={{
              start: courseData?.startDateTime ?? undefined,
              end: courseData?.endDateTime ?? undefined,
            }}
            matchesFilter={matches => matches.filter(t => t.id !== profile?.id)}
            value={assistants}
            onChange={event => {
              setAssistants(event.target.value)
            }}
          />

          <FormGroup sx={{ marginTop: 3 }} data-testid="acknowledge-checks">
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentFlags.healthLeaflet}
                  onChange={e =>
                    handleConsentFlagChange('healthLeaflet', e.target.checked)
                  }
                />
              }
              label={
                t('pages.create-course.form.health-leaflet-copy') as string
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentFlags.practiceProtocols}
                  onChange={e =>
                    handleConsentFlagChange(
                      'practiceProtocols',
                      e.target.checked
                    )
                  }
                />
              }
              label={
                t('pages.create-course.form.practice-protocol-copy') as string
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={consentFlags.validID}
                  onChange={e =>
                    handleConsentFlagChange('validID', e.target.checked)
                  }
                />
              }
              label={t('pages.create-course.form.valid-id-copy') as string}
            />
          </FormGroup>
        </>
      ) : null}

      <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 4 }}>
        <Button variant="text" sx={{ marginRight: 4 }} onClick={saveDraft}>
          {t('pages.create-course.save-as-draft')}
        </Button>

        <LoadingButton
          variant="contained"
          disabled={!nextStepEnabled}
          onClick={handleNextStepButtonClick}
          loading={savingStatus === LoadingStatus.FETCHING}
          endIcon={<ArrowForwardIcon />}
          data-testid="next-page-btn"
        >
          {t(`pages.create-course.${nextStepButtonLabel}`)}
        </LoadingButton>
      </Box>

      <CourseExceptionsConfirmation
        open={courseExceptions.length > 0}
        onCancel={() => setCourseExceptions([])}
        onSubmit={submit}
        exceptions={courseExceptions}
      />
    </Box>
  )
}
