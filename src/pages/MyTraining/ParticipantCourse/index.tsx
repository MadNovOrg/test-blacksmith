import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  CircularProgress,
  Stack,
  Alert,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import InfoIcon from '@mui/icons-material/Info'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'

import useCourse from '@app/hooks/useCourse'

import { LoadingStatus } from '@app/util'

export const ParticipantCourse = () => {
  const { id: courseId } = useParams()
  const { t } = useTranslation()

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  if (courseLoadingStatus === LoadingStatus.FETCHING) {
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

  const attendingLabel = t('pages.participant-course.attending-course-label')

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}
      {course ? (
        <>
          <CourseHeroSummary
            course={course}
            renderButton={() => (
              <FormGroup>
                <FormControlLabel
                  control={<Switch size="small" checked={true} />}
                  label={attendingLabel}
                />
              </FormGroup>
            )}
          >
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              sx={{ marginBottom: 2 }}
            >
              {t('pages.course-participants.back-button')}
            </Button>
          </CourseHeroSummary>

          <Container sx={{ marginTop: 4 }}>
            <Alert
              icon={<InfoIcon />}
              variant="outlined"
              color="warning"
              sx={{ marginBottom: 2 }}
            >
              {t('pages.participant-course.invite-accepted')}
            </Alert>
          </Container>
        </>
      ) : (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Alert severity="warning">Course not found.</Alert>
        </Container>
      )}
    </>
  )
}
