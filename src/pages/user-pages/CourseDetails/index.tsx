import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { styled } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'

import { BackButton } from '@app/components/BackButton'
import { CourseCertification } from '@app/components/CourseCertification'
import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { CoursePrerequisitesAlert } from '@app/components/CoursePrerequisitesAlert'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { useAuth } from '@app/context/auth'
import {
  GetFeedbackUsersQuery,
  GetFeedbackUsersQueryVariables,
  Organization,
} from '@app/generated/graphql'
import { CourseAttendees } from '@app/pages/trainer-pages/components/CourseAttendees'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import { ModifyAttendanceModal } from '@app/pages/user-pages/CourseDetails/ModifyAttendanceModal'
import { QUERY as GET_FEEDBACK_USERS_QUERY } from '@app/queries/course-evaluation/get-feedback-users'
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
  const { profile, acl } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const params = useParams()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const alertType = searchParams.get('success') as keyof typeof successAlerts
  const alertMessage = alertType ? successAlerts[alertType] : null
  const courseId = params.id as string

  const [pollCertificateCounter, setPollCertificateCounter] = useState(10)

  const { data: courseData, error: courseError } = useSWR<
    {
      course: GetCourseResponseType['course'] & {
        organization?: Pick<Organization, 'members'>
      }
    },
    Error,
    [string, GetCourseParamsType]
  >([GET_COURSE_QUERY, { id: courseId }])
  const course = courseData?.course
  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseError)

  const [activeTab, setActiveTab] = useState('')
  const [showModifyAttendanceModal, setShowModifyAttendanceModal] =
    useState(false)

  const handleActiveTabChange = (_: unknown, newValue: string) => {
    setActiveTab(newValue)
  }

  const profileId = profile?.id
  const { data, mutate } = useSWR([GetParticipant, { profileId, courseId }])
  const courseParticipant: CourseParticipant | null =
    data?.course_participant?.length > 0 ? data?.course_participant[0] : null

  const isBookingContact =
    acl.isBookingContact() && course?.bookingContact?.id === profileId
  const isParticipant = !!courseParticipant

  useEffect(() => {
    if (course && !activeTab) {
      setActiveTab(
        isBookingContact && !isParticipant
          ? CourseDetailsTabs.ATTENDEES
          : 'checklist'
      )
    }
  }, [course, isBookingContact, isParticipant, activeTab])

  const { data: usersData, error } = useSWR<
    GetFeedbackUsersQuery,
    Error,
    [string, GetFeedbackUsersQueryVariables]
  >([GET_FEEDBACK_USERS_QUERY, { courseId: parseInt(courseId || '') }])
  const loading = !usersData && !error

  const didAttendeeSubmitFeedback = useMemo(() => {
    return !!usersData?.users.find(u => u.profile.id === profileId)
  }, [usersData, profileId])

  const canManageCourse = useMemo(() => {
    return Boolean(
      course?.organization?.members.find(
        member => member.isAdmin && member.profile_id === profileId
      )
    )
  }, [course, profileId])

  const courseHasStarted = course && courseStarted(course)
  const courseHasEnded = course && courseEnded(course)
  const canSubmitFeedback =
    !loading &&
    courseHasStarted &&
    !didAttendeeSubmitFeedback &&
    courseParticipant?.attended
  const showFeedbackRequiredAlert =
    courseParticipant && courseParticipant.grade && !didAttendeeSubmitFeedback

  useEffect(() => {
    if (
      courseHasEnded &&
      didAttendeeSubmitFeedback &&
      courseParticipant &&
      pollCertificateCounter > 0
    ) {
      if (courseParticipant.certificate) {
        setPollCertificateCounter(0)
      } else {
        const ref = setTimeout(() => {
          setPollCertificateCounter(counter => counter - 1)
          return mutate()
        }, 1000)
        return () => clearTimeout(ref)
      }
    }
  }, [
    courseHasEnded,
    courseParticipant,
    didAttendeeSubmitFeedback,
    mutate,
    pollCertificateCounter,
  ])

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

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}

      {course && (isParticipant || isBookingContact) ? (
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

          {activeTab ? (
            <TabContext value={activeTab}>
              <Box borderBottom={1} borderColor="divider">
                <Container>
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex" justifyContent="space-between">
                      <PillTabList
                        onChange={handleActiveTabChange}
                        aria-label="Course participant tabs"
                      >
                        {isParticipant ? (
                          <PillTab
                            data-testid="participant-course-checklist"
                            label={t(
                              'pages.participant-course.checklist-tab-title'
                            )}
                            value="checklist"
                          />
                        ) : null}
                        {courseParticipant?.certificate ? (
                          <PillTab
                            data-testid="participant-course-certification"
                            label={t(
                              'pages.participant-course.certification-tab-title'
                            )}
                            value="certification"
                          />
                        ) : null}
                        {isBookingContact ? (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.attendees.title'
                            )}
                            value={CourseDetailsTabs.ATTENDEES}
                            data-testid="attendees-tab"
                          />
                        ) : null}
                      </PillTabList>
                    </Box>
                    <Box>
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

                      {canManageCourse ? (
                        <Button
                          variant="text"
                          component={LinkBehavior}
                          href={`/manage-courses/${course?.organization?.id}/${courseId}/details`}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="primary"
                            my={1}
                          >
                            {t('pages.participant-course.manage-course')}
                          </Typography>
                        </Button>
                      ) : null}
                    </Box>
                  </Box>
                </Container>
              </Box>

              <Container sx={{ pb: 2 }}>
                <TabPanel sx={{ px: 0 }} value="checklist">
                  {showFeedbackRequiredAlert ? (
                    <Alert variant="outlined" severity="error" sx={{ m: 2 }}>
                      <Typography>
                        {t('pages.participant-course.feedback-required-alert')}
                      </Typography>
                    </Alert>
                  ) : null}

                  {isParticipant ? (
                    <>
                      <CoursePrerequisitesAlert
                        courseId={courseId}
                        sx={{ m: 2 }}
                        showAction={true}
                      />

                      <ChecklistItem marginBottom={2} padding={2}>
                        <Grid container alignItems={'center'}>
                          <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                          <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                            {t(
                              'pages.participant-course.personal-data-document-title'
                            )}
                          </Typography>
                          {courseParticipant?.healthSafetyConsent ? (
                            <Chip
                              label={t('common.complete')}
                              color="success"
                              sx={{ marginRight: 2, my: 1 }}
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
                                fullWidth={isMobile}
                                sx={{ mt: isMobile ? 2 : 0 }}
                                onClick={() =>
                                  navigate(
                                    `/courses/${courseId}/health-and-safety`
                                  )
                                }
                              >
                                {t(
                                  'pages.participant-course.review-and-submit'
                                )}
                              </Button>
                            </>
                          )}
                        </Grid>
                      </ChecklistItem>
                      <ChecklistItem padding={2}>
                        <Grid container alignItems={'center'}>
                          <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                          <Typography
                            fontWeight={500}
                            sx={{ flexGrow: 1, my: 1 }}
                          >
                            {' '}
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
                            color={
                              !didAttendeeSubmitFeedback || !courseHasEnded
                                ? 'default'
                                : 'success'
                            }
                            sx={{ marginRight: 2 }}
                            data-testid="evaluate-course-complete-message"
                          />
                          <Button
                            data-testid="evaluate-course-cta"
                            onClick={() =>
                              navigate(`/courses/${courseId}/evaluation`)
                            }
                            variant="contained"
                            color="secondary"
                            fullWidth={isMobile}
                            sx={{ mt: isMobile ? 2 : 0 }}
                            disabled={!canSubmitFeedback}
                          >
                            {!courseHasEnded
                              ? t(
                                  'pages.participant-course.course-summary-button-after-completion'
                                )
                              : t('pages.participant-course.evaluate-course')}
                          </Button>
                        </Grid>
                      </ChecklistItem>
                    </>
                  ) : null}
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
                        <Alert
                          variant="outlined"
                          color="warning"
                          sx={{ mb: 3 }}
                        >
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
                {isBookingContact ? (
                  <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.ATTENDEES}>
                    <CourseAttendees course={course} />
                  </TabPanel>
                ) : null}
              </Container>
            </TabContext>
          ) : null}
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
