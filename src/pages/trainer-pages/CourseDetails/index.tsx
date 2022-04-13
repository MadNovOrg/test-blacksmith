import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { Expire } from '@app/components/Expire'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import useCourse from '@app/hooks/useCourse'
import { CourseAttendees } from '@app/pages/trainer-pages/components/CourseAttendees'
import { CourseCertifications } from '@app/pages/trainer-pages/components/CourseCertifications'
import { CourseGrading } from '@app/pages/trainer-pages/components/CourseGrading'
import { EvaluationSummaryTab } from '@app/pages/trainer-pages/components/EvaluationSummaryTab'
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
  const [searchParams] = useSearchParams()
  const alertType = searchParams.get('success') as keyof typeof successAlerts
  const alertMessage = alertType ? successAlerts[alertType] : null

  const tabToSelect = (searchParams.get('tab') ??
    CourseDetailsTabs.ATTENDEES) as CourseDetailsTabs

  const [selectedTab, setSelectedTab] = useState<CourseDetailsTabs>(tabToSelect)

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  const courseHasEnded = course && courseEnded(course)

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
                  onClick={() => navigate('/courses')}
                >
                  {t('pages.course-participants.back-button')}
                </Button>
              </CourseHeroSummary>

              <TabContext value={selectedTab}>
                <Box borderBottom={1} borderColor="divider">
                  <Container>
                    <PillTabList
                      onChange={(
                        _,
                        selectedTab: React.SetStateAction<CourseDetailsTabs>
                      ) => setSelectedTab(selectedTab)}
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
                          {t(alertMessage, { name: course?.name })}
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
