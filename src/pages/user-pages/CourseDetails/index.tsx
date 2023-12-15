import Cancel from '@mui/icons-material/Cancel'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { isFuture, isPast } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { CourseCertification } from '@app/components/CourseCertification/CourseCertification'
import { CourseHeroSummary } from '@app/components/CourseHeroSummary'
import { CourseOverview } from '@app/components/CourseOverview'
import { CoursePrerequisitesAlert } from '@app/components/CoursePrerequisitesAlert'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  Course_Type_Enum,
  GetDietaryAndDisabilitiesCountQuery,
  GetDietaryAndDisabilitiesCountQueryVariables,
  GetFeedbackUsersQuery,
  GetFeedbackUsersQueryVariables,
  Organization,
} from '@app/generated/graphql'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { CourseAttendeesTab } from '@app/pages/trainer-pages/components/CourseAttendeesTab'
import { CourseCertifications } from '@app/pages/trainer-pages/components/CourseCertifications'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import { DietaryRequirementsTab } from '@app/pages/trainer-pages/CourseDetails/components/DietaryRequirementsTab'
import { DisabilitiesTab } from '@app/pages/trainer-pages/CourseDetails/components/DisabilitiesTab'
import { EvaluationSummaryTab } from '@app/pages/trainer-pages/CourseDetails/components/EvaluationSummaryTab'
import { CourseCancellationRequestFeature } from '@app/pages/trainer-pages/CourseDetails/CourseCancellationRequestFeature'
import { ModifyAttendanceModal } from '@app/pages/user-pages/CourseDetails/ModifyAttendanceModal'
import { QUERY as GET_FEEDBACK_USERS_QUERY } from '@app/queries/course-evaluation/get-feedback-users'
import { GET_DIETARY_AND_DISABILITIES_COUNT } from '@app/queries/course-participant/get-participant-dietary-restrictions-by-course-id'
import { GetParticipant } from '@app/queries/participants/get-course-participant-by-profile-id'
import {
  ParamsType,
  QUERY as GET_COURSE_QUERY,
  ResponseType as GetCourseResponseType,
} from '@app/queries/user-queries/get-course-by-id'
import { getIndividualCourseStatuses } from '@app/rules/course-status'
import { CourseParticipant } from '@app/types'
import { courseEnded, courseStarted } from '@app/util'

const ChecklistItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}))

const successAlerts = {
  invite_accepted: 'pages.participant-course.invite-accepted',
  course_evaluated: 'course-evaluation.saved',
} as const

export type CourseDetailsProps = {
  bookingOnly?: boolean
}

export const CourseDetails: React.FC<
  React.PropsWithChildren<CourseDetailsProps>
> = ({ bookingOnly }) => {
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
  const isBookingContactManagement = acl.isBookingContact() && bookingOnly
  const canViewOrderItem =
    (acl.isBookingContact() || acl.isOrgKeyContact()) && bookingOnly

  const [pollCertificateCounter, setPollCertificateCounter] = useState(10)
  const [showCancellationRequestModal, setShowCancellationRequestModal] =
    useState(false)
  const [
    { data: courseData, error: courseError, fetching: courseLoadingStatus },
    refetch,
  ] = useQuery<
    {
      course: GetCourseResponseType['course'] & {
        organization?: Pick<Organization, 'members'>
      }
    },
    ParamsType
  >({
    query: GET_COURSE_QUERY,
    variables: {
      id: courseId,
      profileId: profile?.id || '',
      withCancellationRequest: isBookingContactManagement,
      withGo1Data: canViewOrderItem,
      withOrders: canViewOrderItem,
      withParticipants:
        (acl.isBookingContact() || acl.isOrgKeyContact()) && bookingOnly,
      withParticipantsOrders: isBookingContactManagement,
      ...(isBookingContactManagement
        ? {
            courseParticipantsWhere: {
              _or: [
                { course: { bookingContactProfileId: { _eq: profile?.id } } },
                { order: { bookingContactProfileId: { _eq: profile?.id } } },
              ],
            },
          }
        : {}),
    },
    requestPolicy: 'network-only',
  })
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
        ...(acl.isBookingContact()
          ? {
              participantWhere: {
                course: { id: { _eq: Number(courseId) } },
                order: { bookingContactProfileId: { _eq: profile?.id } },
                profile: { dietaryRestrictions: { _neq: 'null', _nilike: '' } },
              },
            }
          : {}),
      },
      requestPolicy: 'cache-and-network',
      pause: !courseId,
    })
  const course = courseData?.course

  const linkedOrderItem = useMemo(() => course?.orders?.[0], [course])
  const isCourseTypeClosed = course?.type === Course_Type_Enum.Closed
  const isCourseTypeIndirectBlended =
    course?.type === Course_Type_Enum.Indirect && course?.go1Integration
  const canViewLinkedOrderItem = useMemo(
    () =>
      linkedOrderItem && (isCourseTypeClosed || isCourseTypeIndirectBlended),
    [linkedOrderItem, isCourseTypeClosed, isCourseTypeIndirectBlended]
  )
  const [activeTab, setActiveTab] = useState('')
  const [showModifyAttendanceModal, setShowModifyAttendanceModal] =
    useState(false)

  const handleActiveTabChange = (_: unknown, newValue: string) => {
    setActiveTab(newValue)
  }

  const profileId = profile?.id
  const [{ data: participantData }, reexecuteQuery] = useQuery({
    query: GetParticipant,
    variables: { profileId, courseId },
    requestPolicy: 'network-only',
  })
  const courseParticipant: CourseParticipant | null =
    participantData?.course_participant?.length > 0
      ? participantData?.course_participant[0]
      : null

  const isBookingContact = Boolean(
    course && acl.isBookingContact() && bookingOnly
  )
  const isOrgKeyContact = Boolean(
    course && acl.isOrganizationKeyContactOfCourse(course) && bookingOnly
  )
  const isOrgAdmin = Boolean(
    course && course.organization?.id && acl.isOrgAdmin(course.organization?.id)
  )

  const isParticipant = !!courseParticipant
  const showCertificationsTab = [
    isBookingContact,
    isOrgAdmin,
    isOrgKeyContact,
  ].some(Boolean)

  useEffect(() => {
    if (course && !activeTab) {
      setActiveTab(
        [isBookingContact, isOrgKeyContact].includes(true)
          ? CourseDetailsTabs.ATTENDEES
          : 'checklist'
      )
    }
  }, [activeTab, course, isBookingContact, isOrgAdmin, isOrgKeyContact])

  useEffect(() => {
    reexecuteDietaryQuery()
  }, [courseParticipantsTotal, reexecuteDietaryQuery])

  const [{ data: usersData, error }] = useQuery<
    GetFeedbackUsersQuery,
    GetFeedbackUsersQueryVariables
  >({
    query: GET_FEEDBACK_USERS_QUERY,
    variables: { courseId: parseInt(courseId || '') },
    requestPolicy: 'cache-and-network',
  })
  const loading = !usersData && !error

  const didAttendeeSubmitFeedback = useMemo(() => {
    return !!usersData?.users.find(u => u.profile.id === profileId)
  }, [usersData, profileId])

  const canRequestCancellation = useMemo(() => {
    if (!course) return false

    const courseEnded =
      Boolean(course?.schedule.length) &&
      isPast(new Date(course?.schedule[0].end as string))

    const graduationFinished = !course?.courseParticipants?.some(
      participant => !participant.grade
    )
    const cancelRequested = Boolean(course?.cancellationRequest)

    const mappedStatus = getIndividualCourseStatuses(
      course?.status as Course_Status_Enum,
      courseEnded,
      graduationFinished,
      cancelRequested
    )

    const allowRequestCancelConditions = course
      ? [
          !cancelRequested,
          acl.isBookingContactOfCourse(course),
          bookingOnly,
          course.type === Course_Type_Enum.Closed,
          isFuture(new Date(course.schedule[0].end)),
          mappedStatus !== Course_Status_Enum.Cancelled &&
            mappedStatus !== Course_Status_Enum.Completed,
        ]
      : [false]

    return allowRequestCancelConditions.every(el => Boolean(el))
  }, [acl, bookingOnly, course])

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
          return reexecuteQuery()
        }, 1000)
        return () => clearTimeout(ref)
      }
    }
  }, [
    courseHasEnded,
    courseParticipant,
    didAttendeeSubmitFeedback,
    pollCertificateCounter,
    reexecuteQuery,
  ])

  if (courseLoadingStatus) {
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

  const showCourseOverview =
    (course?.moduleGroupIds?.length || course?.bildModules?.length) &&
    course.status !== Course_Status_Enum.Draft

  const isCourseContact =
    (isBookingContact && course?.type !== Course_Type_Enum.Open) ||
    (course && acl.isOneOfBookingContactsOfTheOpenCourse(course)) ||
    isOrgKeyContact

  return (
    <>
      <Helmet>
        <title>{t('pages.browser-tab-titles.manage-courses.course')}</title>
      </Helmet>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}

      {course && (isParticipant || isCourseContact) ? (
        <>
          <CourseHeroSummary
            course={course}
            isManaged={bookingOnly}
            slots={{
              BackButton: () => (
                <BackButton
                  label={t('pages.course-participants.back-button')}
                />
              ),
              OrderItem: canViewLinkedOrderItem
                ? () => (
                    <Trans
                      i18nKey="common.order-item"
                      defaults="Order: <0>{{invoiceNumber}}</0>"
                      components={[
                        <Typography
                          data-testid="order-item-text"
                          key="order-item-text"
                          display="inline-flex"
                          fontWeight="600"
                          fontSize="1rem"
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

          {alertMessage ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Alert
                variant="outlined"
                color="success"
                sx={{ mb: 3, mt: 3 }}
                data-testid="success-alert"
              >
                {t(alertMessage)}
              </Alert>
            </Box>
          ) : null}

          {course && (
            <Container disableGutters={isMobile}>
              <CourseCancellationRequestFeature
                course={course}
                open={showCancellationRequestModal}
                onClose={() => setShowCancellationRequestModal(false)}
                onChange={refetch}
              />
            </Container>
          )}

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
                        {!bookingOnly && isParticipant ? (
                          <PillTab
                            data-testid="participant-course-checklist"
                            label={t(
                              'pages.participant-course.checklist-tab-title'
                            )}
                            value="checklist"
                          />
                        ) : null}
                        {!bookingOnly &&
                        courseParticipant?.completed_evaluation &&
                        courseParticipant?.certificate ? (
                          <PillTab
                            data-testid="participant-course-certification"
                            label={t(
                              'pages.participant-course.certification-tab-title'
                            )}
                            value="certification"
                          />
                        ) : null}
                        {isCourseContact ? (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.attendees.title'
                            )}
                            value={CourseDetailsTabs.ATTENDEES}
                            data-testid="attendees-tab"
                          />
                        ) : null}
                        {isCourseContact &&
                        course.type !== Course_Type_Enum.Open ? (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.evaluation.title'
                            )}
                            value={CourseDetailsTabs.EVALUATION}
                            data-testid="evaluation-tab"
                          />
                        ) : null}
                        {(dietaryAndDisabilitiesCount
                          ?.participantDietaryRestrictionsCount.aggregate
                          ?.count ||
                          dietaryAndDisabilitiesCount
                            ?.trainerDietaryRestrictionsCount.aggregate
                            ?.count) &&
                        acl.canViewDietaryAndDisabilitiesDetails(course) ? (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.dietary-requirements.title-with-count',
                              {
                                count: Number(
                                  (dietaryAndDisabilitiesCount
                                    ?.participantDietaryRestrictionsCount
                                    .aggregate?.count ?? 0) +
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
                        {(dietaryAndDisabilitiesCount
                          ?.participantDisabilitiesCount.aggregate?.count ||
                          dietaryAndDisabilitiesCount?.trainerDisabilitiesCount
                            .aggregate?.count) &&
                        acl.canViewDietaryAndDisabilitiesDetails(course) ? (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.disabilities.title-with-count',
                              {
                                count: Number(
                                  (dietaryAndDisabilitiesCount
                                    ?.participantDisabilitiesCount.aggregate
                                    ?.count ?? 0) +
                                    (dietaryAndDisabilitiesCount
                                      .trainerDisabilitiesCount.aggregate
                                      ?.count ?? 0)
                                ),
                              }
                            )}
                            value={CourseDetailsTabs.DISABILITIES}
                            data-testid="disabilities-tab"
                          />
                        ) : null}
                        {showCertificationsTab &&
                        course.certificateCount?.aggregate.count &&
                        course.participantSubmittedEvaluationCount?.aggregate
                          .count ? (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.certifications.title'
                            )}
                            value={CourseDetailsTabs.CERTIFICATIONS}
                            data-testid="certifications-tab"
                          />
                        ) : null}
                        {!bookingOnly && showCourseOverview && (
                          <PillTab
                            label={t(
                              'pages.course-details.tabs.course-overview.title'
                            )}
                            value={CourseDetailsTabs.COURSE_OVERVIEW}
                            data-testid="course-overview-tab"
                          />
                        )}
                      </PillTabList>
                    </Box>
                    <Box display={'flex'}>
                      {!bookingOnly &&
                      !courseHasStarted &&
                      course.type === Course_Type_Enum.Open ? (
                        <Button variant="text">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="primary"
                            my={1}
                            onClick={() => setShowModifyAttendanceModal(true)}
                            data-testid="change-my-attendance-btn"
                          >
                            {t('pages.participant-course.change-my-attendance')}
                          </Typography>
                        </Button>
                      ) : null}

                      {acl.isOrgAdmin() ? (
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
                      {canRequestCancellation ? (
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
                  </Box>
                </Container>
              </Box>

              <Container sx={{ pb: 2 }}>
                <TabPanel sx={{ px: 0 }} value="checklist">
                  {showFeedbackRequiredAlert ? (
                    <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
                      <Typography>
                        {t('pages.participant-course.feedback-required-alert')}
                      </Typography>
                    </Alert>
                  ) : null}

                  {isParticipant ? (
                    <>
                      <CoursePrerequisitesAlert
                        courseId={courseId}
                        sx={{ m: 3 }}
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
                {isCourseContact ? (
                  <>
                    <TabPanel
                      sx={{ px: 0 }}
                      value={CourseDetailsTabs.ATTENDEES}
                    >
                      <CourseAttendeesTab course={course} />
                    </TabPanel>
                    <TabPanel
                      sx={{ px: 0 }}
                      value={CourseDetailsTabs.EVALUATION}
                    >
                      <EvaluationSummaryTab course={course} />
                    </TabPanel>
                  </>
                ) : null}
                <TabPanel
                  sx={{ px: 0 }}
                  value={CourseDetailsTabs.DIETARY_REQUIREMENTS}
                >
                  <DietaryRequirementsTab courseId={course.id} />
                </TabPanel>
                <TabPanel sx={{ px: 0 }} value={CourseDetailsTabs.DISABILITIES}>
                  <DisabilitiesTab courseId={course.id} />
                </TabPanel>
                {showCertificationsTab &&
                course.certificateCount?.aggregate.count &&
                course.certificateCount?.aggregate.count ? (
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
          ) : null}
          {course.type === Course_Type_Enum.Open &&
          showModifyAttendanceModal ? (
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
