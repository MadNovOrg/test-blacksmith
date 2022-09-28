import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import CourseForm from '@app/components/CourseForm'
import { SearchTrainers } from '@app/components/SearchTrainers'
import { useAuth } from '@app/context/auth'
import {
  CourseLevel,
  CourseTrainerType,
  CourseType,
  SearchTrainer,
  CourseInput,
  ValidCourseInput,
  InviteStatus,
} from '@app/types'
import { getNumberOfAssistants, LoadingStatus } from '@app/util'

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
  const { profile } = useAuth()

  const [consentFlags, setConsentFlags] = useState({
    healthLeaflet: false,
    practiceProtocols: false,
    validID: false,
  })

  useEffect(() => {
    if (courseType === CourseType.INDIRECT && profile) {
      setTrainers([
        {
          profile_id: profile.id,
          type: CourseTrainerType.LEADER,
          status: InviteStatus.ACCEPTED,
        },
        ...assistants.map(assistant => ({
          profile_id: assistant.id,
          type: CourseTrainerType.ASSISTANT,
          status: InviteStatus.PENDING,
        })),
      ])
    }
  }, [assistants, courseType, setTrainers, profile])

  useEffect(() => {
    setCurrentStepKey(StepsEnum.COURSE_DETAILS)
  }, [setCurrentStepKey])

  const minAssistants = useMemo(() => {
    if (courseData?.maxParticipants) {
      return getNumberOfAssistants(courseData?.maxParticipants)
    }

    return 0
  }, [courseData])

  const nextStepEnabled = useMemo(() => {
    if (courseType !== CourseType.INDIRECT) {
      return courseDataValid
    }

    const hasCheckedAllFlags =
      Object.values(consentFlags).filter(flag => flag === false).length === 0

    return hasCheckedAllFlags && courseDataValid
  }, [consentFlags, courseDataValid, courseType])

  useEffect(() => {
    if (minAssistants === 0) {
      setAssistants([])
    }
  }, [minAssistants])

  const handleNextStepButtonClick = async () => {
    if (!courseData || !profile) return

    assertCourseDataValid(courseData, courseDataValid)

    completeStep(StepsEnum.COURSE_DETAILS)

    if (courseData.blendedLearning && courseData.type === CourseType.INDIRECT) {
      navigate('./license-order-details')
    } else if (courseType === CourseType.INDIRECT) {
      const id = await saveCourse()
      navigate(`/courses/${id}/modules`)
    } else {
      navigate('./assign-trainers')
    }
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

      if (isValid) {
        setCourseDataValid(isValid)
      }
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
      <CourseForm
        onChange={handleCourseFormChange}
        type={courseType}
        courseInput={courseData}
      />

      {courseType === CourseType.INDIRECT ? (
        <>
          {minAssistants > 0 ? (
            <>
              <Typography mt={2} mb={2} variant="h5" fontWeight={500}>
                {t('pages.create-course.assign-trainers-title')}
              </Typography>

              <SearchTrainers
                trainerType={CourseTrainerType.ASSISTANT}
                courseLevel={courseData?.courseLevel || CourseLevel.LEVEL_1}
                courseSchedule={{
                  start: courseData?.startDateTime ?? undefined,
                  end: courseData?.endDateTime ?? undefined,
                }}
                matchesFilter={matches =>
                  matches.filter(t => t.id !== profile?.id)
                }
                max={3}
                value={assistants}
                onChange={event => {
                  setAssistants(event.target.value)
                }}
              />
            </>
          ) : null}

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
    </Box>
  )
}
