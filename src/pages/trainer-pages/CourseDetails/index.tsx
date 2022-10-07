import Cancel from '@mui/icons-material/Cancel'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { Expire } from '@app/components/Expire'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { useAuth } from '@app/context/auth'
import { Course_Status_Enum } from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { CourseAttendees } from '@app/pages/trainer-pages/components/CourseAttendees'
import { CourseCertifications } from '@app/pages/trainer-pages/components/CourseCertifications'
import { CourseGrading } from '@app/pages/trainer-pages/components/CourseGrading'
import { EvaluationSummaryTab } from '@app/pages/trainer-pages/components/EvaluationSummaryTab'
import { CourseCancellationRequestFeature } from '@app/pages/trainer-pages/CourseDetails/CourseCancellationRequestFeature'
import { CourseType } from '@app/types'
import { courseEnded, LoadingStatus } from '@app/util'

export enum CourseDetailsTabs {
  ATTENDEES = 'ATTENDEES',
  GRADING = 'GRADING',
  EVALUATION = 'EVALUATION',
  CERTIFICATIONS = 'CERTIFICATIONS',
}

const successAlerts = {
  course_submitted:
    'pages.trainer-base.create-course.new-course.submitted-course',
  course_evaluated: 'course-evaluation.saved',
} as const

export const CourseDetails = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const { acl, isOrgAdmin } = useAuth()
  const [searchParams] = useSearchParams()

  const showCancelledAlert = searchParams.get('cancelled')
  const alertType = searchParams.get('success') as keyof typeof successAlerts
  const alertMessage = alertType ? successAlerts[alertType] : null

  const initialTab = searchParams.get('tab') as CourseDetailsTabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab || CourseDetailsTabs.ATTENDEES
  )
  const [showCancellationRequestModal, setShowCancellationRequestModal] =
    useState(false)

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
    mutate,
  } = useCourse(courseId ?? '')

  const courseHasEnded = course && courseEnded(course)
  const courseCancelled =
    course && course.status === Course_Status_Enum.Cancelled

  return (
    <>
      {courseError && (
        <Alert severity="error">{t('errors.loading-course')}</Alert>
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
                renderButton={() =>
                  acl.canCreateCourse(course.type) &&
                  !courseEnded(course) &&
                  !courseCancelled ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{ mt: 3 }}
                      onClick={() => navigate(`/courses/edit/${courseId}`)}
                    >
                      {t('pages.course-participants.edit-course-button')}
                    </Button>
                  ) : null
                }
              >
                <BackButton
                  to="/courses"
                  label={t('pages.course-participants.back-button')}
                />
              </CourseHeroSummary>

              <CourseCancellationRequestFeature
                course={course}
                open={showCancellationRequestModal}
                onClose={() => setShowCancellationRequestModal(false)}
                onChange={mutate}
              />

              <TabContext value={selectedTab}>
                <Box borderBottom={1} borderColor="divider">
                  <Container
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <PillTabList
                      onChange={(_, tab) => navigate(`.?tab=${tab}`)}
                    >
                      <PillTab
                        label={t('pages.course-details.tabs.attendees.title')}
                        value={CourseDetailsTabs.ATTENDEES}
                        data-testid="attendees-tab"
                      />
                      {courseHasEnded ? (
                        <PillTab
                          label={t('pages.course-details.tabs.grading.title')}
                          value={CourseDetailsTabs.GRADING}
                          data-testid="grading-tab"
                        />
                      ) : null}
                      <PillTab
                        label={t('pages.course-details.tabs.evaluation.title')}
                        value={CourseDetailsTabs.EVALUATION}
                        data-testid="evaluation-tab"
                      />
                      {course.certificateCount?.aggregate.count ? (
                        <PillTab
                          label={t(
                            'pages.course-details.tabs.certifications.title'
                          )}
                          value={CourseDetailsTabs.CERTIFICATIONS}
                          data-testid="certifications-tab"
                        />
                      ) : null}
                    </PillTabList>
                    <Box>
                      {!course.cancellationRequest &&
                      course.type === CourseType.CLOSED &&
                      isOrgAdmin &&
                      !acl.canCancelCourses() ? (
                        <Button
                          variant="text"
                          startIcon={<Cancel />}
                          onClick={() => setShowCancellationRequestModal(true)}
                        >
                          {t('pages.edit-course.request-cancellation')}
                        </Button>
                      ) : null}
                    </Box>
                  </Container>
                </Box>

                <Container sx={{ pb: 2 }}>
                  {alertMessage ? (
                    <Expire delay={3000}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt={2}
                      >
                        <Alert
                          variant="outlined"
                          color="success"
                          data-testid="success-message"
                        >
                          {t(alertMessage, { id: course?.id })}
                        </Alert>
                      </Box>
                    </Expire>
                  ) : null}

                  {showCancelledAlert ? (
                    <Expire delay={3000}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt={2}
                      >
                        <Alert
                          variant="filled"
                          color="info"
                          data-testid="cancelled-message"
                        >
                          {t('pages.course-details.course-has-been-cancelled', {
                            code: course.course_code,
                          })}
                        </Alert>
                      </Box>
                    </Expire>
                  ) : null}

                  <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.ATTENDEES}>
                    <CourseAttendees course={course} />
                  </TabPanel>

                  {courseHasEnded ? (
                    <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.GRADING}>
                      <CourseGrading course={course} />
                    </TabPanel>
                  ) : null}

                  <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.EVALUATION}>
                    <EvaluationSummaryTab />
                  </TabPanel>

                  {course.certificateCount?.aggregate.count ? (
                    <TabPanel
                      sx={{ px: 0 }}
                      value={CourseDetailsTabs.CERTIFICATIONS}
                    >
                      <CourseCertifications course={course} />
                    </TabPanel>
                  ) : null}
                </Container>
              </TabContext>
            </>
          )}
        </>
      ) : (
        <Container sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error">{t('errors.course-not-found')}</Alert>
        </Container>
      )}
    </>
  )
}
