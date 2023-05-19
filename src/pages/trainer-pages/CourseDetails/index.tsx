import Cancel from '@mui/icons-material/Cancel'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { courseEnded, LoadingStatus } from '@app/util'

import { OrderYourWorkbookAlert } from './components/OrderYourWorkbookAlert'

export enum CourseDetailsTabs {
  ATTENDEES = 'ATTENDEES',
  GRADING = 'GRADING',
  EVALUATION = 'EVALUATION',
  CERTIFICATIONS = 'CERTIFICATIONS',
}

export const CourseDetails = () => {
  const { t } = useTranslation()
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
                  acl.canEditCourses(
                    course.type,
                    leader?.profile.id === profile?.id
                  ) &&
                  !courseEnded(course) &&
                  !courseCancelled ? (
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
                  ) : null
                }
              >
                <BackButton label={t('back')} />
              </CourseHeroSummary>

              <Container>
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
                    >
                      <Box>
                        {acl.canApproveCourseExceptions() ? (
                          <Typography variant="body1" fontWeight={600}>
                            {t('pages.create-course.exceptions.admin-header')}
                          </Typography>
                        ) : (
                          <Typography variant="body1" fontWeight={600}>
                            {t('pages.create-course.exceptions.warning-header')}
                          </Typography>
                        )}
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
                        <Box>
                          <Button variant="text" onClick={onExceptionsReject}>
                            {t('common.reject')}
                          </Button>
                          <Button variant="text" onClick={onExceptionsApprove}>
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
                    messageKey="participant-transferred"
                    sx={{ position: 'absolute' }}
                  />

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
