import React from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Container,
  CircularProgress,
  Stack,
  Alert,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Box,
  Tab,
  Typography,
  Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { styled } from '@mui/system'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import useSWR from 'swr'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'

import { useAuth } from '@app/context/auth'

import useCourse from '@app/hooks/useCourse'

import { CourseCertification } from './CourseCertification'

import { LoadingStatus, courseEnded } from '@app/util'
import { GetParticipant } from '@app/queries/participants/get-course-participant-by-profile-id'

const ChecklistItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}))

const successAlerts = {
  invite_accepted: 'pages.participant-course.invite-accepted',
  course_evaluated: 'course-evaluation.saved',
} as const

export const ParticipantCourse = () => {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const alertType = searchParams.get('success') as keyof typeof successAlerts
  const alertMessage = alertType ? successAlerts[alertType] : null

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  const [activeTab, setActiveTab] = React.useState('checklist')

  const handleActiveTabChange = (_: unknown, newValue: string) => {
    setActiveTab(newValue)
  }

  const profileId = profile?.id
  const { data } = useSWR([GetParticipant, { profileId, courseId }])
  const courseParticipant = data?.course_participant

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
  const courseHasEnded = course && courseEnded(course)

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}
      {course && courseParticipant ? (
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
            {alertMessage ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Alert
                  variant="outlined"
                  color="success"
                  sx={{ mb: 3 }}
                  data-testid="success-alert"
                >
                  {t(alertMessage)}
                </Alert>
              </Box>
            ) : null}

            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleActiveTabChange}
                  aria-label="Course participant tabs"
                >
                  <Tab
                    label={t('pages.participant-course.checklist-tab-title')}
                    value="checklist"
                  />
                  <Tab
                    label={t('pages.participant-course.resources-tab-title')}
                    value="resources"
                  />
                  <Tab
                    label={t(
                      'pages.participant-course.certification-tab-title'
                    )}
                    value="certification"
                  />
                </TabList>
              </Box>
              <TabPanel
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                value="checklist"
              >
                <ChecklistItem marginBottom={2} padding={2}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                  <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                    {t('pages.participant-course.personal-data-document-title')}
                  </Typography>
                  <Chip label="Incomplete" sx={{ marginRight: 2 }} />
                  <Button variant="contained" color="secondary">
                    {t('pages.participant-course.open-form-button')}
                  </Button>
                </ChecklistItem>
                <ChecklistItem padding={2}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                  <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                    {t(
                      'pages.participant-course.course-summary-evaluation-title'
                    )}
                  </Typography>
                  <Chip label="Incomplete" sx={{ marginRight: 2 }} />
                  <Button
                    data-testid="evaluate-course-cta"
                    onClick={() =>
                      navigate(`/my-training/courses/${courseId}/evaluation`)
                    }
                    variant="contained"
                    color="secondary"
                    disabled={!courseHasEnded}
                  >
                    {!courseHasEnded
                      ? t(
                          'pages.participant-course.course-summary-button-after-completion'
                        )
                      : t('pages.participant-course.evaluate-course')}
                  </Button>
                </ChecklistItem>
              </TabPanel>
              <TabPanel
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                value="resources"
              >
                {t('pages.participant-course.resources-empty-message')}
              </TabPanel>

              <TabPanel
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                value="certification"
              >
                {!courseHasEnded ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={5}
                  >
                    <Alert variant="outlined" color="warning" sx={{ mb: 3 }}>
                      {t(
                        'pages.participant-course.certification-course-not-ended'
                      )}
                    </Alert>
                  </Box>
                ) : (
                  <CourseCertification
                    courseParticipant={courseParticipant[0]}
                    course={course}
                  />
                )}
              </TabPanel>
            </TabContext>
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
