import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import ChooseTrainers, {
  FormValues as TrainersFormValues,
} from '@app/components/ChooseTrainers'
import CourseForm from '@app/components/CourseForm'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import {
  ParamsType,
  ResponseType,
  UPDATE_COURSE_MUTATION,
} from '@app/queries/courses/update-course'
import theme from '@app/theme'
import {
  CourseDeliveryType,
  CourseInput,
  CourseLevel,
  CourseTrainerType,
  ValidCourseInput,
} from '@app/types'
import {
  courseToCourseInput,
  generateCourseName,
  LoadingStatus,
  profileToInput,
} from '@app/util'

import { NotFound } from '../common/NotFound'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean
): asserts data is ValidCourseInput {
  if (!isValid) {
    throw new Error()
  }
}

export const EditCourse: React.FC<unknown> = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState<CourseInput>()
  const [courseDataValid, setCourseDataValid] = useState(false)
  const [trainersData, setTrainersData] = useState<TrainersFormValues>()
  const [trainersDataValid, setTrainersDataValid] = useState(false)
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const fetcher = useFetcher()

  const {
    data: course,
    status: courseStatus,
    mutate: mutateCourse,
  } = useCourse(id ?? '')

  const handleCourseFormChange = useCallback(
    (data: CourseInput, isValid: boolean) => {
      setCourseData(data)
      setCourseDataValid(isValid)
    },
    []
  )

  const handleTrainersDataChange = useCallback(
    (data: TrainersFormValues, isValid: boolean) => {
      setTrainersData(data)
      setTrainersDataValid(isValid)
    },
    []
  )

  const courseInput: CourseInput | undefined = useMemo(() => {
    if (course) {
      return courseToCourseInput(course)
    }

    return undefined
  }, [course])

  const saveChanges = async () => {
    try {
      if (courseData && course && trainersData) {
        assertCourseDataValid(courseData, courseDataValid)

        const trainers = [
          ...trainersData.assist.map(
            profileToInput(course, CourseTrainerType.ASSISTANT)
          ),
        ]

        if (!acl.canAssignLeadTrainer() && profile) {
          trainers.push({
            course_id: course.id,
            profile_id: profile.id,
            type: CourseTrainerType.LEADER,
          })
        } else {
          trainers.push(
            ...trainersData.lead.map(
              profileToInput(course, CourseTrainerType.LEADER)
            )
          )
        }

        const response = await fetcher<ResponseType, ParamsType>(
          UPDATE_COURSE_MUTATION,
          {
            courseId: String(course.id),
            courseInput: {
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
              ...(courseData.organizationId
                ? { organization_id: courseData.organizationId }
                : null),
              ...(courseData.contactProfile
                ? { contactProfileId: courseData.contactProfile.id }
                : null),
              ...(courseData.usesAOL
                ? { aolCostOfCourse: courseData.courseCost }
                : null),
            },
            trainers,
            scheduleId: course?.schedule[0].id,
            scheduleInput: {
              venue_id: courseData.venue.id,
              virtualLink:
                courseData.deliveryType === CourseDeliveryType.F2F
                  ? ''
                  : courseData.zoomMeetingUrl,
              start: courseData.startDateTime,
              end: courseData.endDateTime,
            },
          }
        )

        if (response.updateCourse.id) {
          mutateCourse()
          navigate(`/courses/${course.id}/details`)
        } else {
          setSavingStatus(LoadingStatus.ERROR)
        }
      }
    } catch (err) {
      setSavingStatus(LoadingStatus.ERROR)
    }
  }

  if (
    (courseStatus === LoadingStatus.SUCCESS && !course) ||
    (course && !acl.canCreateCourse(course.type))
  ) {
    return <NotFound />
  }

  const editCourseValid = courseDataValid && trainersDataValid

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {courseStatus === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="edit-course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {courseStatus === LoadingStatus.ERROR ? (
          <Alert severity="error">
            {t('pages.edit-course.course-not-found')}
          </Alert>
        ) : null}

        {course && LoadingStatus.SUCCESS ? (
          <Box display="flex" paddingBottom={5}>
            <Box width={400} display="flex" flexDirection="column" pr={4}>
              <Sticky top={20}>
                <Box mb={2}>
                  <BackButton
                    label={t('pages.create-course.back-button-text')}
                    to="/courses"
                  />
                </Box>
                <Typography variant="h2" mb={2}>
                  {t('pages.edit-course.title')}
                </Typography>
              </Sticky>
            </Box>

            <Box flex={1}>
              <Box mt={8}>
                <Box mb={2}>
                  <CourseForm
                    course={courseInput}
                    type={course?.type}
                    onChange={handleCourseFormChange}
                  />
                </Box>

                {courseData?.maxParticipants &&
                courseData?.startDateTime &&
                courseData.endDateTime ? (
                  <ChooseTrainers
                    maxParticipants={courseData?.maxParticipants ?? 0}
                    courseLevel={courseData.courseLevel || CourseLevel.LEVEL_1}
                    courseSchedule={{
                      start: courseData.startDateTime,
                      end: courseData.endDateTime,
                    }}
                    trainers={course.trainers}
                    onChange={handleTrainersDataChange}
                    autoFocus={false}
                  />
                ) : null}

                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <LoadingButton
                    disabled={!editCourseValid}
                    variant="contained"
                    onClick={saveChanges}
                    loading={savingStatus === LoadingStatus.FETCHING}
                  >
                    {t('pages.edit-course.save-button-text')}
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
