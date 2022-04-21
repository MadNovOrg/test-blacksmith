import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import CourseForm from '@app/components/CourseForm'
import { SearchTrainers } from '@app/components/SearchTrainers'
import { useAuth } from '@app/context/auth'
import theme from '@app/theme'
import {
  CourseLevel,
  CourseTrainerType,
  CourseType,
  SearchTrainer,
  CourseInput,
  ValidCourseInput,
} from '@app/types'
import { getNumberOfAssistants, LoadingStatus } from '@app/util'

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
  const { courseData: storedCourseData, storeCourseData } = useCreateCourse()
  const { savingStatus, saveCourse } = useSaveCourse()

  const [courseData, setCourseData] = useState<CourseInput | undefined>(
    storedCourseData
  )
  const [assistants, setAssistants] = useState<SearchTrainer[]>([])
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile } = useAuth()

  const [consentFlags, setConsentFlags] = useState({
    healthLeaflet: false,
    practiceProtocols: false,
    validID: false,
  })

  const courseType =
    CourseType[searchParams.get('type') as CourseType] ?? CourseType.OPEN

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
    const hasSelectedEnoughAssistants = minAssistants <= assistants.length

    return hasCheckedAllFlags && courseDataValid && hasSelectedEnoughAssistants
  }, [consentFlags, courseDataValid, courseType, minAssistants, assistants])

  useEffect(() => {
    if (minAssistants === 0) {
      setAssistants([])
    }
  }, [minAssistants])

  const handleNextStepButtonClick = async () => {
    if (courseData) {
      if (courseType === CourseType.INDIRECT && profile) {
        assertCourseDataValid(courseData, courseDataValid)
        const insertedId = await saveCourse(
          {
            ...courseData,
            type: CourseType.INDIRECT,
          },
          [
            { profile_id: profile.id, type: CourseTrainerType.LEADER },
            ...assistants.map(assistant => ({
              profile_id: assistant.id,
              type: CourseTrainerType.ASSISTANT,
            })),
          ]
        )

        navigate(`/courses/${insertedId}/modules`)
      } else {
        assertCourseDataValid(courseData, courseDataValid)
        storeCourseData({ ...courseData, type: courseType })
        navigate(`./assign-trainers`)
      }
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
    (data: CourseInput, isValid: boolean) => {
      setCourseData(data)
      setCourseDataValid(isValid)
    },
    []
  )

  return (
    <Box paddingBottom={5}>
      <CourseForm
        onChange={handleCourseFormChange}
        type={courseType}
        course={storedCourseData}
      />

      {courseType === CourseType.INDIRECT ? (
        <>
          {minAssistants > 0 ? (
            <>
              <Typography marginTop={2} variant="h5" fontWeight={500}>
                {t('pages.create-course.assign-trainers-title')}
              </Typography>
              <Typography color={theme.palette.grey[700]} marginBottom={2}>
                {t('pages.create-course.assists-needed', {
                  count: minAssistants,
                })}
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

          <FormGroup sx={{ marginTop: 3 }}>
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

      <Box display="flex" justifyContent="flex-end">
        <LoadingButton
          variant="contained"
          disabled={!nextStepEnabled}
          sx={{ marginTop: 4 }}
          onClick={handleNextStepButtonClick}
          loading={savingStatus === LoadingStatus.FETCHING}
          endIcon={<ArrowForwardIcon />}
          data-testid="next-page-btn"
        >
          {courseType === CourseType.INDIRECT
            ? t('pages.create-course.indirect-course-button-text')
            : t('pages.create-course.next-page-button-text')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
