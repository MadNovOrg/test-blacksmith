import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { Expire } from '@app/components/Expire'

import useCourse from '@app/hooks/useCourse'

import { LoadingStatus } from '@app/util'
import { CourseParticipants } from '@app/pages/TrainerBase/components/CourseParticipants'

export const CourseDetails = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [searchParams] = useSearchParams()
  const courseJustSubmitted = searchParams.get('courseJustSubmitted') === 'true'

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  return (
    <>
      {courseError && (
        <Alert severity="error">There was an error loading a course.</Alert>
      )}
      {course ? (
        <>
          {courseLoadingStatus === LoadingStatus.FETCHING ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="course-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <CourseHeroSummary
                course={course}
                renderButton={() => (
                  <Button variant="contained" color="secondary" size="large">
                    {t('pages.course-participants.edit-course-button')}
                  </Button>
                )}
              >
                <Button
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                  sx={{ marginBottom: 2 }}
                  onClick={() => navigate('/trainer-base/course')}
                >
                  {t('pages.course-participants.back-button')}
                </Button>
              </CourseHeroSummary>

              {courseJustSubmitted && (
                <Expire delay={3000}>
                  <Alert variant="outlined" color="success">
                    {`You have successfully created your ${course.name} Course`}
                  </Alert>
                </Expire>
              )}

              <CourseParticipants course={course} />
            </>
          )}
        </>
      ) : (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Alert severity="warning">Course not found.</Alert>
        </Container>
      )}
    </>
  )
}
