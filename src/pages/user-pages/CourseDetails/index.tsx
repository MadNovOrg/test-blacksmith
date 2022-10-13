import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'

import { BackButton } from '@app/components/BackButton'
import { CourseCertification } from '@app/components/CourseCertification'
import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { CoursePrerequisitesAlert } from '@app/components/CoursePrerequisitesAlert'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { useAuth } from '@app/context/auth'
import { ModifyAttendanceModal } from '@app/pages/user-pages/CourseDetails/ModifyAttendanceModal'
import {
  ParamsType as GetFeedbackUsersParamsType,
  QUERY as GET_FEEDBACK_USERS_QUERY,
  ResponseType as GetFeedbackUsersResponseType,
} from '@app/queries/course-evaluation/get-feedback-users'
import { GetParticipant } from '@app/queries/participants/get-course-participant-by-profile-id'
import {
  ParamsType as GetCourseParamsType,
  QUERY as GET_COURSE_QUERY,
  ResponseType as GetCourseResponseType,
} from '@app/queries/user-queries/get-course-by-id'
import { CourseParticipant, CourseType } from '@app/types'
import {
  courseEnded,
  courseStarted,
  getSWRLoadingStatus,
  LoadingStatus,
} from '@app/util'

const ChecklistItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}))

const successAlerts = {
  invite_accepted: 'pages.participant-course.invite-accepted',
  course_evaluated: 'course-evaluation.saved',
} as const

export const CourseDetails = () => {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const alertType = searchParams.get('success') as keyof typeof successAlerts
  const alertMessage = alertType ? successAlerts[alertType] : null
  const courseId = params.id as string

  const { data: courseData, error: courseError } = useSWR<
    GetCourseResponseType,
    Error,
    [string, GetCourseParamsType]
  >([GET_COURSE_QUERY, { id: courseId }])
  const course = courseData?.course
  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseError)

  const [activeTab, setActiveTab] = useState('checklist')
  const [showModifyAttendanceModal, setShowModifyAttendanceModal] =
    useState(false)

  const handleActiveTabChange = (_: unknown, newValue: string) => {
    setActiveTab(newValue)
  }

  const profileId = profile?.id
  const { data } = useSWR([GetParticipant, { profileId, courseId }])
  const courseParticipant: CourseParticipant | null =
    data?.course_participant?.length > 0 ? data?.course_participant[0] : null

  const { data: usersData, error } = useSWR<
    GetFeedbackUsersResponseType,
    Error,
    [string, GetFeedbackUsersParamsType]
  >([GET_FEEDBACK_USERS_QUERY, { courseId }])
  const loading = !usersData && !error

  const didAttendeeSubmitFeedback = useMemo(() => {
    return !!usersData?.users.find(u => u.profile.id === profileId)
  }, [usersData, profileId])

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

  const courseHasStarted = course && courseStarted(course)
  const courseHasEnded = course && courseEnded(course)
  const canSubmitFeedback =
    !loading &&
    courseHasStarted &&
    !didAttendeeSubmitFeedback &&
    courseParticipant?.attended

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}

      {course && courseParticipant ? (
        <>
          <CourseHeroSummary course={course}>
            <BackButton
              to="/courses"
              label={t('pages.course-participants.back-button')}
            />
          </CourseHeroSummary>

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
            <Box borderBottom={1} borderColor="divider">
              <Container>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="end"
                >
                  <PillTabList
                    onChange={handleActiveTabChange}
                    aria-label="Course participant tabs"
                  >
                    <PillTab
                      label={t('pages.participant-course.checklist-tab-title')}
                      value="checklist"
                    />
                    <PillTab
                      label={t('pages.participant-course.resources-tab-title')}
                      value="resources"
                    />
                    {courseParticipant?.certificate ? (
                      <PillTab
                        label={t(
                          'pages.participant-course.certification-tab-title'
                        )}
                        value="certification"
                      />
                    ) : null}
                  </PillTabList>
                  {!courseHasStarted && course.type === CourseType.OPEN ? (
                    <Button variant="text">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary"
                        my={1}
                        onClick={() => setShowModifyAttendanceModal(true)}
                      >
                        {t('pages.participant-course.change-my-attendance')}
                      </Typography>
                    </Button>
                  ) : null}
                </Box>
              </Container>
            </Box>

            <Container sx={{ pb: 2 }}>
              <TabPanel sx={{ px: 0 }} value="checklist">
                <CoursePrerequisitesAlert
                  courseId={courseId}
                  sx={{ m: 2 }}
                  showAction={true}
                />

                <ChecklistItem marginBottom={2} padding={2}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                  <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                    {t('pages.participant-course.personal-data-document-title')}
                  </Typography>
                  {courseParticipant?.healthSafetyConsent ? (
                    <Chip
                      label={t('common.complete')}
                      color="success"
                      sx={{ marginRight: 2 }}
                    />
                  ) : (
                    <>
                      <Chip
                        label={t('common.incomplete')}
                        sx={{ marginRight: 2 }}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          navigate(`/courses/${courseId}/health-and-safety`)
                        }
                      >
                        {t('pages.participant-course.review-and-submit')}
                      </Button>
                    </>
                  )}
                </ChecklistItem>
                <ChecklistItem padding={2}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                  <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                    {t(
                      'pages.participant-course.course-summary-evaluation-title'
                    )}
                  </Typography>
                  <Chip
                    label={
                      !didAttendeeSubmitFeedback || !courseHasEnded
                        ? t('incomplete')
                        : t('complete')
                    }
                    sx={{ marginRight: 2 }}
                    data-testid="evaluate-course-complete-message"
                  />
                  <Button
                    data-testid="evaluate-course-cta"
                    onClick={() => navigate(`/courses/${courseId}/evaluation`)}
                    variant="contained"
                    color="secondary"
                    disabled={!canSubmitFeedback}
                  >
                    {!courseHasEnded
                      ? t(
                          'pages.participant-course.course-summary-button-after-completion'
                        )
                      : t('pages.participant-course.evaluate-course')}
                  </Button>
                </ChecklistItem>
              </TabPanel>

              <TabPanel sx={{ px: 0 }} value="resources">
                {t('pages.participant-course.resources-empty-message')}
              </TabPanel>

              {courseParticipant?.certificate ? (
                <TabPanel sx={{ px: 0 }} value="certification">
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
                      certificateId={courseParticipant.certificate.id}
                    />
                  )}
                </TabPanel>
              ) : null}
            </Container>
          </TabContext>

          {course.type === CourseType.OPEN && showModifyAttendanceModal ? (
            <ModifyAttendanceModal
              course={course}
              onClose={() => setShowModifyAttendanceModal(false)}
            />
          ) : null}
        </>
      ) : (
        <Container sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error">{t('errors.course-not-found')}</Alert>
        </Container>
      )}
    </>
  )
}
