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

import CourseForm, {
  FormValues,
  ValidFormFields,
} from '@app/components/CourseForm'
import { SearchTrainers } from '@app/components/SearchTrainers'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/insert-course'
import theme from '@app/theme'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseTrainerType,
  CourseType,
  SearchTrainer,
} from '@app/types'
import {
  generateCourseName,
  getNumberOfAssistants,
  LoadingStatus,
} from '@app/util'

function assertCourseDataValid(
  data: FormValues,
  isValid: boolean
): asserts data is ValidFormFields {
  if (!isValid) {
    throw new Error()
  }
}

export const CreateCourseForm = () => {
  const [courseData, setCourseData] = useState<FormValues>()
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const [assistants, setAssistants] = useState<SearchTrainer[]>([])
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const fetcher = useFetcher()
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

  const saveCourse = async () => {
    try {
      if (courseData) {
        assertCourseDataValid(courseData, courseDataValid)
        setSavingStatus(LoadingStatus.FETCHING)

        const response = await fetcher<ResponseType, ParamsType>(MUTATION, {
          course: {
            name: generateCourseName(
              {
                level: courseData.courseLevel,
                reaccreditation: courseData.reaccreditation,
              },
              t
            ),
            deliveryType: courseData.deliveryType,
            level: courseData.courseLevel,
            reaccreditation: courseData.reaccreditation,
            go1Integration: courseData.blendedLearning,
            ...(courseData.minParticipants
              ? { min_participants: courseData.minParticipants }
              : null),
            max_participants: courseData.maxParticipants,
            type: courseType,
            ...(courseData.organizationId
              ? { organization_id: courseData.organizationId }
              : null),
            ...(courseData.organizationId
              ? { contactProfileId: courseData.contactProfileId }
              : null),
            ...(courseData.usesAOL
              ? { aolCostOfCourse: courseData.courseCost }
              : null),
            ...(profile?.id
              ? {
                  trainers: {
                    data: [
                      ...assistants.map(assistant => ({
                        profile_id: assistant.id,
                        type: CourseTrainerType.ASSISTANT,
                      })),
                      {
                        profile_id: profile.id,
                        type: CourseTrainerType.LEADER,
                      },
                    ],
                  },
                }
              : null),
            schedule: {
              data: [
                {
                  start: courseData.startDateTime,
                  end: courseData.endDateTime,
                  virtualLink: [
                    CourseDeliveryType.VIRTUAL,
                    CourseDeliveryType.MIXED,
                  ].includes(courseData.deliveryType)
                    ? courseData.zoomMeetingUrl
                    : undefined,
                  venue_id: courseData.venueId,
                  name: 'name', // @todo cleanup the data model for these two fields
                  type: 'PHYSICAL',
                },
              ],
            },
          },
        })

        if (response.insertCourse.inserted.length === 1) {
          setSavingStatus(LoadingStatus.SUCCESS)

          const insertedId = response.insertCourse.inserted[0].id

          const to =
            courseType === CourseType.INDIRECT
              ? `/courses/${insertedId}/modules`
              : `assign-trainers/${insertedId}`

          navigate(to)
        }
      }
    } catch (err) {
      console.log(err)
      setSavingStatus(LoadingStatus.ERROR)
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
    (data: FormValues, isValid: boolean) => {
      setCourseData(data)
      setCourseDataValid(isValid)
    },
    []
  )

  return (
    <Box paddingBottom={5}>
      <CourseForm onChange={handleCourseFormChange} type={courseType} />

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
          onClick={saveCourse}
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
