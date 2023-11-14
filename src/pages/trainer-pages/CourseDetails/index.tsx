import Cancel from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
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
import { useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { CourseOverview } from '@app/components/CourseOverview'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  GetDietaryAndDisabilitiesCountQuery,
  GetDietaryAndDisabilitiesCountQueryVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import usePollQuery from '@app/hooks/usePollQuery'
import { CourseAttendeesTab } from '@app/pages/trainer-pages/components/CourseAttendeesTab'
import { CourseCertifications } from '@app/pages/trainer-pages/components/CourseCertifications'
import { CourseGrading } from '@app/pages/trainer-pages/components/CourseGrading'
import { CourseCancellationRequestFeature } from '@app/pages/trainer-pages/CourseDetails/CourseCancellationRequestFeature'
import { GET_DIETARY_AND_DISABILITIES_COUNT } from '@app/queries/course-participant/get-participant-dietary-restrictions-by-course-id'
import { CourseType } from '@app/types'
import { courseEnded, LoadingStatus } from '@app/util'

import { DietaryRequirementsTab } from './components/DietaryRequirementsTab'
import { DisabilitiesTab } from './components/DisabilitiesTab/DisabilitiesTab'
import { EvaluationSummaryTab } from './components/EvaluationSummaryTab'
import { ExceptionsApprovalAlert } from './components/ExceptionsApprovalAlert'
import { OrderYourWorkbookAlert } from './components/OrderYourWorkbookAlert'

export enum CourseDetailsTabs {
  ATTENDEES = 'ATTENDEES',
  GRADING = 'GRADING',
  EVALUATION = 'EVALUATION',
  CERTIFICATIONS = 'CERTIFICATIONS',
  COURSE_OVERVIEW = 'COURSE_OVERVIEW',
  EDIT = 'EDIT',
  DISABILITIES = 'DISABILITIES',
  DIETARY_REQUIREMENTS = 'DIETARY_REQUIREMENTS',
}

export const CourseDetails = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const { acl, isOrgAdmin } = useAuth()
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
  const { total: courseParticipantsTotal } = useCourseParticipants(
    Number(courseId),
    { alwaysShowArchived: true }
  )

  const [{ data: dietaryAndDisabilitiesCount }, reexecuteDietaryQuery] =
    useQuery<
      GetDietaryAndDisabilitiesCountQuery,
      GetDietaryAndDisabilitiesCountQueryVariables
    >({
      query: GET_DIETARY_AND_DISABILITIES_COUNT,
      variables: {
        courseId: Number(courseId),
        withTrainerData: !acl.canViewTrainerDietaryAndDisabilities(),
      },
      requestPolicy: 'cache-and-network',
      pause: !courseId,
    })
  const isCourseTypeClosed = course?.type === CourseType.CLOSED
  const isCourseTypeIndirectBlended =
    course?.type === CourseType.INDIRECT && course?.go1Integration

  const courseHasEnded = course && courseEnded(course)
  const courseCancelled =
    course &&
    (course.status === Course_Status_Enum.Cancelled ||
      course.status === Course_Status_Enum.Declined)

  const isCourseInExceptionDisabledStatus =
    course?.status === Course_Status_Enum.ExceptionsApprovalPending

  const exceptionsApprovalPending =
    course?.status === Course_Status_Enum.ExceptionsApprovalPending

  const canEditCourse = useMemo(
    () =>
      course &&
      acl.canEditCourses(course) &&
      !courseEnded(course) &&
      !courseCancelled,
    [acl, course, courseCancelled]
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

  const showCourseOverview =
    (course?.moduleGroupIds?.length || course?.bildModules?.length) &&
    course.status !== Course_Status_Enum.Draft

  const showCourseBuilderOnEditPage = acl.canViewCourseBuilderOnEditPage(
    course,
    course?.trainers ?? []
  )

  useEffect(() => {
    reexecuteDietaryQuery()
  }, [courseParticipantsTotal, reexecuteDietaryQuery])

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
          <CourseHeroSummary
            course={course}
            slots={{
              BackButton: () => (
                <BackButton label={t('back')} to="/manage-courses/all" />
              ),
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
                    tab !== CourseDetailsTabs.EDIT
                      ? navigate(`.?tab=${tab}`, { replace: true })
                      : null
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
                      disabled={isCourseInExceptionDisabledStatus}
                    />
                  ) : null}

                  {acl.isOrgAdmin() &&
                  course.type === CourseType.OPEN ? null : (
                    <PillTab
                      label={t('pages.course-details.tabs.evaluation.title')}
                      value={CourseDetailsTabs.EVALUATION}
                      data-testid="evaluation-tab"
                    />
                  )}

                  {(dietaryAndDisabilitiesCount
                    ?.participantDietaryRestrictionsCount.aggregate?.count ||
                    dietaryAndDisabilitiesCount?.trainerDietaryRestrictionsCount
                      .aggregate?.count) &&
                  acl.canViewDietaryAndDisabiltitiesDetails(course) ? (
                    <PillTab
                      label={t(
                        'pages.course-details.tabs.dietary-requirements.title-with-count',
                        {
                          count: Number(
                            (dietaryAndDisabilitiesCount
                              ?.participantDietaryRestrictionsCount.aggregate
                              ?.count ?? 0) +
                              (dietaryAndDisabilitiesCount
                                .trainerDietaryRestrictionsCount.aggregate
                                ?.count ?? 0)
                          ),
                        }
                      )}
                      value={CourseDetailsTabs.DIETARY_REQUIREMENTS}
                      data-testid="dietary-requirements-tab"
                    />
                  ) : null}
                  {(dietaryAndDisabilitiesCount?.participantDisabilitiesCount
                    .aggregate?.count ||
                    dietaryAndDisabilitiesCount?.trainerDisabilitiesCount
                      .aggregate?.count) &&
                  acl.canViewDietaryAndDisabiltitiesDetails(course) ? (
                    <PillTab
                      label={t(
                        'pages.course-details.tabs.disabilities.title-with-count',
                        {
                          count: Number(
                            (dietaryAndDisabilitiesCount
                              ?.participantDisabilitiesCount.aggregate?.count ??
                              0) +
                              (dietaryAndDisabilitiesCount
                                .trainerDisabilitiesCount.aggregate?.count ?? 0)
                          ),
                        }
                      )}
                      value={CourseDetailsTabs.DISABILITIES}
                      data-testid="disabilities-tab"
                    />
                  ) : null}
                  {course.certificateCount?.aggregate.count ? (
                    <PillTab
                      label={t(
                        'pages.course-details.tabs.certifications.title'
                      )}
                      value={CourseDetailsTabs.CERTIFICATIONS}
                      data-testid="certifications-tab"
                    />
                  ) : null}
                  {showCourseOverview ? (
                    <PillTab
                      label={t(
                        'pages.course-details.tabs.course-overview.title'
                      )}
                      value={CourseDetailsTabs.COURSE_OVERVIEW}
                      data-testid="course-overview-tab"
                    />
                  ) : null}
                  {showCourseBuilderOnEditPage ? (
                    <EditIcon
                      sx={{ ml: 2, cursor: 'pointer' }}
                      data-testid="course-edit-tab"
                      onClick={() => navigate(`/courses/${course.id}/modules`)}
                    />
                  ) : null}
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

              {acl.isOrgAdmin() && course.type === CourseType.OPEN ? null : (
                <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.EVALUATION}>
                  <EvaluationSummaryTab course={course} />
                </TabPanel>
              )}

              <TabPanel
                sx={{ px: 0 }}
                value={CourseDetailsTabs.DIETARY_REQUIREMENTS}
              >
                <DietaryRequirementsTab courseId={course.id} />
              </TabPanel>
              <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.DISABILITIES}>
                <DisabilitiesTab courseId={course.id} />
              </TabPanel>

              {course.certificateCount?.aggregate.count ? (
                <TabPanel
                  sx={{ px: 0 }}
                  value={CourseDetailsTabs.CERTIFICATIONS}
                >
                  <CourseCertifications course={course} />
                </TabPanel>
              ) : null}

              {showCourseOverview ? (
                <TabPanel
                  sx={{ px: 0 }}
                  value={CourseDetailsTabs.COURSE_OVERVIEW}
                >
                  <CourseOverview course={course} />
                </TabPanel>
              ) : null}
            </Container>
          </TabContext>
        </>
      ) : (
        <Container sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error">{t('errors.course-not-found')}</Alert>
        </Container>
      )}
    </>
  )
}
