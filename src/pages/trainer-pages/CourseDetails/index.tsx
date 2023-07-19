import Cancel from '@mui/icons-material/Cancel'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { CourseOverview } from '@app/components/CourseOverview'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import { Course_Status_Enum } from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import usePollQuery from '@app/hooks/usePollQuery'
import { CourseAttendeesTab } from '@app/pages/trainer-pages/components/CourseAttendeesTab'
import { CourseCertifications } from '@app/pages/trainer-pages/components/CourseCertifications'
import { CourseGrading } from '@app/pages/trainer-pages/components/CourseGrading'
import { EvaluationSummaryTab } from '@app/pages/trainer-pages/components/EvaluationSummaryTab'
import { CourseCancellationRequestFeature } from '@app/pages/trainer-pages/CourseDetails/CourseCancellationRequestFeature'
import { CourseTrainerType, CourseType } from '@app/types'
import { courseEnded, LoadingStatus } from '@app/util'

import { ExceptionsApprovalAlert } from './components/ExceptionsApprovalAlert'
import { OrderYourWorkbookAlert } from './components/OrderYourWorkbookAlert'

export enum CourseDetailsTabs {
  ATTENDEES = 'ATTENDEES',
  GRADING = 'GRADING',
  EVALUATION = 'EVALUATION',
  CERTIFICATIONS = 'CERTIFICATIONS',
  COURSE_OVERVIEW = 'COURSE_OVERVIEW',
}

export const CourseDetails = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const { acl, isOrgAdmin, profile } = useAuth()
  const [searchParams] = useSearchParams()

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

  const isCourseTypeClosed = course?.type === CourseType.CLOSED
  const isCourseTypeIndirectBlended =
    course?.type === CourseType.INDIRECT && course?.go1Integration

  const courseHasEnded = course && courseEnded(course)
  const courseCancelled =
    course &&
    (course.status === Course_Status_Enum.Cancelled ||
      course.status === Course_Status_Enum.Declined)

  const exceptionsApprovalPending =
    course?.status === Course_Status_Enum.ExceptionsApprovalPending

  const leader = course?.trainers?.find(
    c => c.type === CourseTrainerType.Leader
  )

  const canEditCourse = useMemo(
    () =>
      course &&
      acl.canEditCourses(course.type, leader?.profile.id === profile?.id) &&
      !courseEnded(course) &&
      !courseCancelled,
    [acl, course, courseCancelled, leader?.profile.id, profile?.id]
  )

  const linkedOrderItem = useMemo(() => course?.orders?.[0], [course])
  const canViewLinkedOrderItem = useMemo(
    () =>
      linkedOrderItem && (isCourseTypeClosed || isCourseTypeIndirectBlended),
    [linkedOrderItem, isCourseTypeClosed, isCourseTypeIndirectBlended]
  )

  /**
   * TTHP-1410
   *
   * @description Ugly, nasty solution, but there is no other way without
   * completely refactoring every piece of routing work starting with `routes/index.ts`
   */
  const canOnlyViewOrderItemAsText = useMemo(() => {
    if (acl.isInternalUser()) {
      return false
    }

    return (
      (isCourseTypeClosed && (acl.isOrgAdmin() || acl.isBookingContact())) ||
      (isCourseTypeIndirectBlended && (acl.isOrgAdmin() || acl.isTrainer()))
    )
  }, [acl, isCourseTypeClosed, isCourseTypeIndirectBlended])

  const onRefreshCourse = useCallback(async () => {
    await mutate()
  }, [mutate])

  const [startPolling, polling] = usePollQuery(
    () => mutate(),
    () => !!course?.status
  )

  useEffect(() => {
    if (course && !course.status && !polling) {
      startPolling()
    }
  }, [course, startPolling, polling])

  const showCourseOverview = course?.status === Course_Status_Enum.Scheduled

  return (
    <>
      <SnackbarMessage
        messageKey="course-approval-message"
        sx={{ position: 'absolute' }}
      />
      <SnackbarMessage
        severity="error"
        messageKey="course-approval-error"
        sx={{ position: 'absolute' }}
      />
      {courseError || !course ? (
        <Alert severity="error">{t('errors.loading-course')}</Alert>
      ) : null}
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
                slots={{
                  BackButton: () => <BackButton label={t('back')} />,
                  EditButton: canEditCourse
                    ? () => (
                        <Button
                          variant="contained"
                          data-testid="edit-course-button"
                          color="secondary"
                          size="large"
                          sx={{ mt: 3 }}
                          onClick={() => navigate(`/courses/edit/${courseId}`)}
                        >
                          {t('pages.course-participants.edit-course-button')}
                        </Button>
                      )
                    : undefined,
                  OrderItem: canViewLinkedOrderItem
                    ? () => (
                        <Trans
                          i18nKey="common.order-item"
                          defaults="Order: <0>{{invoiceNumber}}</0>"
                          components={[
                            canOnlyViewOrderItemAsText ? (
                              <Typography
                                data-testid="order-item-text"
                                key="order-item-text"
                                display="inline-flex"
                                fontWeight="600"
                                fontSize="1rem"
                              />
                            ) : (
                              <Link
                                href={`/orders/${linkedOrderItem?.id}`}
                                data-testid="order-item-link"
                                key="order-item-link"
                                color="Highlight"
                                fontWeight="600"
                              />
                            ),
                          ]}
                          values={{
                            invoiceNumber: linkedOrderItem?.xeroInvoiceNumber,
                          }}
                        />
                      )
                    : undefined,
                }}
              />

              <Container disableGutters={isMobile}>
                <CourseCancellationRequestFeature
                  course={course}
                  open={showCancellationRequestModal}
                  onClose={() => setShowCancellationRequestModal(false)}
                  onChange={mutate}
                />
                {exceptionsApprovalPending ? <ExceptionsApprovalAlert /> : null}
                <OrderYourWorkbookAlert course={course} />
              </Container>

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
                      variant="scrollable"
                      scrollButtons="auto"
                      onChange={(_, tab) =>
                        navigate(`.?tab=${tab}`, { replace: true })
                      }
                    >
                      <PillTab
                        label={t('pages.course-details.tabs.attendees.title')}
                        value={CourseDetailsTabs.ATTENDEES}
                        data-testid="attendees-tab"
                      />
                      {courseHasEnded && !acl.isOrgAdmin() ? (
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
                      {showCourseOverview && (
                        <PillTab
                          label={t(
                            'pages.course-details.tabs.course-overview.title'
                          )}
                          value={CourseDetailsTabs.COURSE_OVERVIEW}
                          data-testid="course-overview-tab"
                        />
                      )}
                    </PillTabList>
                    <Box>
                      {!course.cancellationRequest &&
                      course.type === CourseType.CLOSED &&
                      isOrgAdmin &&
                      course.status !== Course_Status_Enum.Cancelled &&
                      !acl.canCancelCourses() ? (
                        <Button
                          data-testid="request-cancellation-button"
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

                <Container sx={{ pb: 2, position: 'relative' }}>
                  {isMobile ? undefined : (
                    <>
                      <SnackbarMessage
                        messageKey="course-created"
                        sx={{ position: 'absolute' }}
                      />
                      <SnackbarMessage
                        messageKey="course-canceled"
                        severity="info"
                        sx={{ position: 'absolute' }}
                      />
                      <SnackbarMessage
                        messageKey="course-submitted"
                        sx={{ position: 'absolute' }}
                      />
                      <SnackbarMessage
                        messageKey="course-evaluated"
                        sx={{ position: 'absolute' }}
                      />
                      <SnackbarMessage
                        messageKey="participant-transferred"
                        sx={{ position: 'absolute' }}
                      />
                    </>
                  )}

                  <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.ATTENDEES}>
                    <CourseAttendeesTab course={course} />
                  </TabPanel>

                  {courseHasEnded && !acl.isOrgAdmin() ? (
                    <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.GRADING}>
                      <CourseGrading
                        course={course}
                        refreshCourse={onRefreshCourse}
                      />
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

                  {showCourseOverview && (
                    <TabPanel
                      sx={{ px: 0 }}
                      value={CourseDetailsTabs.COURSE_OVERVIEW}
                    >
                      <CourseOverview course={course} />
                    </TabPanel>
                  )}
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
