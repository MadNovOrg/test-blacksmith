import { Container, CircularProgress, Stack, Alert, Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'

import { BackButton } from '@app/components/BackButton'
import { CourseCertification } from '@app/components/CourseCertification'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import {
  ParamsType as GetCourseParticipantParamsType,
  QUERY as GetCourseParticipantQuery,
  ResponseType as GetCourseParticipantResponseType,
} from '@app/queries/participants/get-course-participant-by-id'
import {
  QUERY as GetCourseQuery,
  ResponseType as GetCourseResponseType,
  ParamsType as GetCourseParamsType,
} from '@app/queries/user-queries/get-course-by-id'
import { LoadingStatus, getSWRLoadingStatus } from '@app/util'

export const CourseCertificationDetails = () => {
  const params = useParams()
  const { t } = useTranslation()
  const courseId = params.id as string
  const participantId = params.participantId as string

  const { data: courseData, error: courseError } = useSWR<
    GetCourseResponseType,
    Error,
    [string, GetCourseParamsType]
  >([GetCourseQuery, { id: courseId }])
  const course = courseData?.course
  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseError)

  const { error: participantError, data: courseParticipantData } = useSWR<
    GetCourseParticipantResponseType,
    Error,
    [string, GetCourseParticipantParamsType]
  >([GetCourseParticipantQuery, { id: participantId }])
  const courseParticipant = courseParticipantData?.participant
  const participantLoadingStatus = getSWRLoadingStatus(
    courseParticipantData,
    participantError
  )

  if (
    courseLoadingStatus === LoadingStatus.FETCHING ||
    participantLoadingStatus === LoadingStatus.FETCHING
  ) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="course-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Container>
      <Box mt={1}>
        <BackButton
          to={`/courses/${courseId}/details?tab=${CourseDetailsTabs.CERTIFICATIONS}`}
          label={t('pages.course-grading-details.back-button-text')}
        />
      </Box>
      <Box mt={4}>
        {courseError || participantError ? (
          <Alert severity="error">
            {t('common.errors.generic.loading-error')}
          </Alert>
        ) : null}

        {course && courseParticipant ? (
          <CourseCertification
            courseParticipant={courseParticipant}
            course={course}
          />
        ) : (
          <Container sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
            <Alert severity="error">
              {t('common.errors.record-not-found')}
            </Alert>
          </Container>
        )}
      </Box>
    </Container>
  )
}
