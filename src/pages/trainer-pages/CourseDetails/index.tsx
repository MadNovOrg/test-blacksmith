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
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import {
  ApproveCourseMutation,
  ApproveCourseMutationVariables,
  Course_Status_Enum,
  SetCourseStatusMutation,
  SetCourseStatusMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import usePollQuery from '@app/hooks/usePollQuery'
import { checkCourseDetailsForExceptions } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { CourseAttendees } from '@app/pages/trainer-pages/components/CourseAttendees'
import { CourseCertifications } from '@app/pages/trainer-pages/components/CourseCertifications'
import { CourseGrading } from '@app/pages/trainer-pages/components/CourseGrading'
import { EvaluationSummaryTab } from '@app/pages/trainer-pages/components/EvaluationSummaryTab'
import { CourseCancellationRequestFeature } from '@app/pages/trainer-pages/CourseDetails/CourseCancellationRequestFeature'
import { MUTATION as APPROVE_COURSE_MUTATION } from '@app/queries/courses/approve-course'
import { MUTATION as SET_COURSE_STATUS_MUTATION } from '@app/queries/courses/set-course-status'
import {
  CourseLevel,
  CourseTrainerType,
  CourseType,
  TrainerRoleTypeName,
} from '@app/types'
import { bildStrategiesToRecord, courseEnded, LoadingStatus } from '@app/util'

import { OrderYourWorkbookAlert } from './components/OrderYourWorkbookAlert'

export enum CourseDetailsTabs {
  ATTENDEES = 'ATTENDEES',
  GRADING = 'GRADING',
  EVALUATION = 'EVALUATION',
  CERTIFICATIONS = 'CERTIFICATIONS',
}

export const CourseDetails = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const { acl, isOrgAdmin, profile } = useAuth()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher()

  const initialTab = searchParams.get('tab') as CourseDetailsTabs | null

  const [selectedTab, setSelectedTab] = useState(
    initialTab || CourseDetailsTabs.ATTENDEES
  )
  const [showCancellationRequestModal, setShowCancellationRequestModal] =
    useState(false)
  const [approvalError, setApprovalError] = useState<string>()

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
    mutate,
  } = useCourse(courseId ?? '')

  const isCourseClosed = course?.type === CourseType.CLOSED
  const isCourseIndirectBlended =
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
  const canViewOrderItem = useMemo(
    () => linkedOrderItem && (isCourseClosed || isCourseIndirectBlended),
    [linkedOrderItem, isCourseClosed, isCourseIndirectBlended]
  )

  const courseExceptions = useMemo(() => {
    if (!course || !course.trainers || !exceptionsApprovalPending) return []

    return checkCourseDetailsForExceptions(
      {
        startDateTime: new Date(course.dates?.aggregate?.start?.date),
        courseLevel: course.level,
        maxParticipants: course.max_participants,
        modulesDuration: course.modulesDuration,
        type: course.type,
        deliveryType: course.deliveryType,
        reaccreditation: course.reaccreditation ?? false,
        conversion: course.conversion,
        accreditedBy: course.accreditedBy,
        bildStrategies: bildStrategiesToRecord(course.bildStrategies),
        hasSeniorOrPrincipalLeader:
          (leader &&
            leader.profile.trainer_role_types.some(
              ({ trainer_role_type: role }) =>
                role.name === TrainerRoleTypeName.SENIOR ||
                role.name === TrainerRoleTypeName.PRINCIPAL
            )) ??
          false,
      },
      course.trainers.map(t => ({
        type: t.type,
        trainer_role_types: t.profile.trainer_role_types,
        levels: (t.profile.certificates ?? []).map(c => ({
          courseLevel: c.courseLevel as CourseLevel,
          expiryDate: c.expiryDate,
        })),
      }))
    )
  }, [course, exceptionsApprovalPending, leader])

  const onExceptionsReject = useCallback(async () => {
    if (!course) return
    setApprovalError(undefined)
    try {
      await fetcher<SetCourseStatusMutation, SetCourseStatusMutationVariables>(
        SET_COURSE_STATUS_MUTATION,
        {
          id: course.id,
          status: Course_Status_Enum.Declined,
        }
      )
      navigate('/')
    } catch (e: unknown) {
      console.error(e)
      setApprovalError((e as Error).message)
    }
  }, [course, fetcher, navigate])

  const onExceptionsApprove = useCallback(async () => {
    if (!course) return
    setApprovalError(undefined)
    try {
      await fetcher<ApproveCourseMutation, ApproveCourseMutationVariables>(
        APPROVE_COURSE_MUTATION,
        { courseId: course.id }
      )
      await mutate()
    } catch (e: unknown) {
      console.error(e)
      setApprovalError((e as Error).message)
    }
  }, [course, fetcher, mutate])

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

  return (
    <>
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
                  OrderItem: canViewOrderItem
                    ? () => (
                        <Trans
                          i18nKey="common.order-item"
                          defaults="Order: <0>{{invoiceNumber}}</0>"
                          components={[
                            <Link
                              href={`/orders/${linkedOrderItem?.id}`}
                              data-testid="order-item-link"
                              key="order-item-link"
                              color="Highlight"
                              fontWeight="600"
                            />,
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

                {exceptionsApprovalPending ? (
                  <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{
                      my: 2,
                      '&& .MuiAlert-message': {
                        width: '100%',
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="stretch"
                      gap={1}
                      flexDirection={isMobile ? 'column' : 'row'}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {t('pages.create-course.exceptions.approval-header')}
                        </Typography>
                        <ul>
                          {courseExceptions.map(exception => (
                            <li key={exception}>
                              {t(
                                `pages.create-course.exceptions.type_${exception}`
                              )}
                            </li>
                          ))}
                        </ul>
                        {approvalError ? (
                          <Typography variant="caption" color="error">
                            {approvalError}
                          </Typography>
                        ) : null}
                      </Box>
                      {acl.canApproveCourseExceptions() ? (
                        <Box
                          display="flex"
                          flexDirection={isMobile ? 'column' : 'row'}
                          alignItems="center"
                        >
                          <Button
                            variant="text"
                            fullWidth={isMobile}
                            onClick={onExceptionsReject}
                            sx={{ px: 2 }}
                          >
                            {t('common.reject')}
                          </Button>
                          <Button
                            variant="contained"
                            fullWidth={isMobile}
                            onClick={onExceptionsApprove}
                            sx={{ px: 7 }}
                          >
                            {t('common.approve')}
                          </Button>
                        </Box>
                      ) : null}
                    </Box>
                  </Alert>
                ) : null}
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

                  <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.ATTENDEES}>
                    <CourseAttendees course={course} />
                  </TabPanel>

                  {courseHasEnded ? (
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
