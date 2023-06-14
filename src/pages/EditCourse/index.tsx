import Cancel from '@mui/icons-material/Cancel'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { differenceInCalendarDays } from 'date-fns'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FormState, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import ChooseTrainers, {
  FormValues as TrainersFormValues,
} from '@app/components/ChooseTrainers'
import CourseForm, { DisabledFields } from '@app/components/CourseForm'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { Dialog } from '@app/components/Dialog'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Accreditors_Enum,
  BildStrategy,
  Course_Audit_Type_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  GetCourseByIdQuery,
  InsertCourseAuditMutation,
  InsertCourseAuditMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  CourseException,
  isTrainersRatioNotMet,
  shouldGoIntoExceptionApproval,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { CourseCancellationModal } from '@app/pages/EditCourse/CourseCancellationModal'
import { RegistrantsCancellationModal } from '@app/pages/EditCourse/RegistrantsCancellationModal'
import { INSERT_COURSE_AUDIT } from '@app/queries/courses/insert-course-audit'
import {
  MUTATION as NOTIFY_COURSE_INPUT,
  ParamsType as NotifyCourseEditParamType,
  ResponseType as NotifyCourseEditResponseType,
} from '@app/queries/courses/notify-course-edit'
import {
  ParamsType,
  ResponseType,
  UPDATE_COURSE_MUTATION,
} from '@app/queries/courses/update-course'
import theme from '@app/theme'
import {
  CourseDeliveryType,
  CourseInput,
  CourseLevel,
  CourseTrainerType,
  CourseType,
  InviteStatus,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import {
  bildStrategiesToArray,
  courseToCourseInput,
  generateCourseName,
  LoadingStatus,
  profileToInput,
} from '@app/util'

import { NotFound } from '../common/NotFound'

import { FormValues, ReviewChangesModal } from './components/ReviewChangesModal'
import { CourseDiff } from './types'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean
): asserts data is ValidCourseInput {
  if (!isValid) {
    throw new Error()
  }
}

export const EditCourse: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile, acl } = useAuth()
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState<CourseInput>()
  const [courseDataValid, setCourseDataValid] = useState(false)
  const [trainersData, setTrainersData] = useState<TrainersFormValues>()
  const [trainersDataValid, setTrainersDataValid] = useState(false)
  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const [
    showRegistrantsCancellationModal,
    setShowRegistrantsCancellationModal,
  ] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [courseExceptions, setCourseExceptions] = useState<CourseException[]>(
    []
  )

  const methods = useRef<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
  }>(null)

  const { addSnackbarMessage } = useSnackbar()

  const [{ error: updatingError, fetching: updatingCourse }, updateCourse] =
    useMutation<ResponseType, ParamsType>(UPDATE_COURSE_MUTATION)
  const [{ error: auditError, fetching: insertingAudit }, insertAudit] =
    useMutation<InsertCourseAuditMutation, InsertCourseAuditMutationVariables>(
      INSERT_COURSE_AUDIT
    )

  const {
    data: course,
    status: courseStatus,
    mutate: mutateCourse,
  } = useCourse(id ?? '')

  const participantsCount =
    (course as GetCourseByIdQuery['course'])?.attendeesCount?.aggregate
      ?.count ?? 0

  const handleCourseFormChange = useCallback(
    ({ data, isValid }: { data?: CourseInput; isValid?: boolean }) => {
      if (data) {
        setCourseData(data)
      }

      setCourseDataValid(Boolean(isValid))
    },
    []
  )

  const notifyCourseEdit = useCallback(
    async (
      oldCourse: NotifyCourseEditParamType['oldCourse'],
      oldTrainers: NotifyCourseEditParamType['oldTrainers']
    ) => {
      const response = await fetcher<
        NotifyCourseEditResponseType,
        NotifyCourseEditParamType
      >(NOTIFY_COURSE_INPUT, { oldCourse, oldTrainers })

      return response
    },
    [fetcher]
  )

  const [courseDiffs, autoapproved]: [CourseDiff[], boolean] = useMemo(() => {
    const diffs: CourseDiff[] = []
    let approved = true

    if (
      course?.schedule[0].start &&
      course.schedule[0].end &&
      courseData?.startDateTime &&
      courseData.endDateTime
    ) {
      const oldStart = new Date(course.schedule[0].start)
      const oldEnd = new Date(course.schedule[0].end)

      const newStart = courseData.startDateTime
      const newEnd = courseData.endDateTime

      if (
        oldStart.getTime() !== newStart.getTime() ||
        oldEnd.getTime() !== newEnd.getTime()
      ) {
        diffs.push({
          type: 'date',
          oldValue: [oldStart, oldEnd],
          newValue: [newStart, newEnd],
        })

        approved = newStart > oldStart
      }
    }

    return [diffs, approved]
  }, [course, courseData])

  const handleTrainersDataChange = useCallback(
    (data: TrainersFormValues, isValid: boolean) => {
      setTrainersData(data)
      setTrainersDataValid(isValid)
    },
    []
  )

  const courseInput: CourseInput | undefined = useMemo(() => {
    return course ? courseToCourseInput(course) : undefined
  }, [course])

  const saveChanges = useCallback(
    async (reviewInput?: FormValues) => {
      const trainersMap = new Map(course?.trainers?.map(t => [t.profile.id, t]))

      try {
        if (courseData && course && trainersData) {
          assertCourseDataValid(courseData, courseDataValid)

          const trainers = [
            ...trainersData.assist.map(t => ({
              ...profileToInput(course, CourseTrainerType.Assistant)(t),
              status: trainersMap.get(t.id)?.status,
            })),
            ...trainersData.moderator.map(t => ({
              ...profileToInput(course, CourseTrainerType.Moderator)(t),
              status: trainersMap.get(t.id)?.status,
            })),
          ]

          if (!acl.canAssignLeadTrainer() && profile) {
            trainers.push({
              course_id: course.id,
              profile_id: profile.id,
              type: CourseTrainerType.Leader,
              status: InviteStatus.ACCEPTED,
            })
          } else {
            trainers.push(
              ...trainersData.lead.map(t => ({
                ...profileToInput(course, CourseTrainerType.Leader)(t),
                status: trainersMap.get(t.id)?.status,
              }))
            )
          }

          const newVenueId =
            [CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(
              courseData.deliveryType
            ) && courseData.venue
              ? courseData.venue.id
              : null
          const newVirtualLink =
            courseData.deliveryType === CourseDeliveryType.F2F
              ? ''
              : courseData.zoomMeetingUrl

          const status =
            courseExceptions.length > 0 &&
            shouldGoIntoExceptionApproval(acl, course.type)
              ? Course_Status_Enum.ExceptionsApprovalPending
              : null

          const editResponse = await updateCourse({
            courseId: course.id,
            courseInput: {
              status,
              name: generateCourseName(
                {
                  level: courseData.courseLevel,
                  reaccreditation: courseData.reaccreditation,
                },
                t
              ),
              deliveryType: courseData.deliveryType,
              reaccreditation: courseData.reaccreditation,
              go1Integration: courseData.blendedLearning,
              freeSpaces: courseData.freeSpaces,
              special_instructions: courseData.specialInstructions,
              parking_instructions: courseData.parkingInstructions,
              notes: courseData.notes,
              ...(courseData.minParticipants
                ? { min_participants: courseData.minParticipants }
                : null),
              max_participants: courseData.maxParticipants,
              ...(courseData.organization
                ? { organization_id: courseData.organization.id }
                : null),
              ...(courseData.bookingContact?.profileId
                ? {
                    bookingContactProfileId:
                      courseData.bookingContact.profileId,
                  }
                : null),
              ...(courseData.bookingContact?.email
                ? { bookingContactInviteData: courseData.bookingContact }
                : null),
              ...(courseData.salesRepresentative
                ? { salesRepresentativeId: courseData.salesRepresentative.id }
                : null),
              ...(courseData.source ? { source: courseData.source } : null),
              ...(courseData.usesAOL
                ? {
                    aolCostOfCourse: courseData.courseCost,
                    aolCountry: courseData.aolCountry,
                    aolRegion: courseData.aolRegion,
                  }
                : null),
            },
            trainers,
            scheduleId: course?.schedule[0].id,
            scheduleInput: {
              venue_id: newVenueId,
              virtualLink: newVirtualLink,
              start: courseData.startDateTime,
              end: courseData.endDateTime,
            },
          })

          if (editResponse.data?.updateCourse.id && courseDiffs.length) {
            const dateChanged = courseDiffs.find(d => d.type === 'date')

            if (!dateChanged) {
              return
            }

            const payload = {
              oldStartDate: course.schedule[0].start,
              oldEndDate: course.schedule[0].end,
              newStartDate: courseData.startDateTime.toISOString(),
              newEndDate: courseData.endDateTime.toISOString(),
              reason: reviewInput?.reason ?? '',
              ...(course.type === CourseType.CLOSED && reviewInput
                ? {
                    feeType: reviewInput.feeType,
                    customFee: reviewInput.customFee,
                  }
                : null),
            }

            await insertAudit({
              object: {
                type: Course_Audit_Type_Enum.Reschedule,
                course_id: course.id,
                payload,
                authorized_by: profile?.id,
              },
            })
          }

          if (editResponse.data?.updateCourse.id) {
            notifyCourseEdit(
              {
                courseId: course.id,
                level: course.level,
                venueId: course.schedule[0].venue?.id || null,
                virtualLink: course.schedule[0].virtualLink || null,
                startDate: course.dates.aggregate.start.date,
                endDate: course.dates.aggregate.end.date,
                parkingInstructions: course.parking_instructions || '',
                specialInstructions: course.special_instructions || '',
                notes: course.notes || '',
              },
              course.trainers?.map(trainer => ({
                id: trainer.profile.id,
                type: trainer.type,
              })) || []
            )
            mutateCourse()
            navigate(`/courses/${course.id}/details`)
          } else {
            console.error('error updating course')
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
    [
      acl,
      course,
      courseData,
      courseDataValid,
      courseDiffs,
      courseExceptions.length,
      insertAudit,
      mutateCourse,
      navigate,
      notifyCourseEdit,
      profile,
      t,
      trainersData,
      updateCourse,
    ]
  )

  const editCourse = useCallback(() => {
    if (!autoapproved) {
      setShowReviewModal(true)
    } else {
      saveChanges()
    }
  }, [autoapproved, saveChanges])

  const disabledFields = useMemo(() => {
    if (course) {
      if (!acl.canEditWithoutRestrictions(course.type)) {
        return new Set<DisabledFields>([
          'organization',
          'bookingContact',
          'courseLevel',
          'blendedLearning',
          'reaccreditation',
          'deliveryType',
          'usesAOL',
          'aolCountry',
          'aolRegion',
          'minParticipants',
          'maxParticipants',
          'bildStrategies',
          'conversion',
        ])
      }
      return new Set<DisabledFields>([
        'courseLevel',
        'bildStrategies',
        'blendedLearning',
        'reaccreditation',
        'conversion',
      ])
    }

    return new Set([])
  }, [acl, course])

  const leader = course?.trainers?.find(
    c => c.type === CourseTrainerType.Leader
  )

  const seniorOrPrincipalLead = useMemo(() => {
    return (
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL
      ) ?? false
    )
  }, [profile])

  const editCourseValid = courseDataValid && trainersDataValid

  const submitButtonHandler = useCallback(async () => {
    methods?.current?.trigger()

    if (
      !editCourseValid ||
      !courseData?.courseLevel ||
      !profile ||
      !trainersData
    )
      return

    if (courseData.type !== CourseType.OPEN && !acl.isTTAdmin()) {
      const exceptions = checkCourseDetailsForExceptions(
        {
          ...courseData,
          accreditedBy: courseData.accreditedBy ?? Accreditors_Enum.Icm,
          bildStrategies: courseData.bildStrategies ?? {},
          courseLevel: courseData.courseLevel ?? CourseLevel.Level_1,
          type: Course_Type_Enum.Indirect,
          maxParticipants: courseData.maxParticipants ?? 0,
          startDateTime: courseData.startDateTime ?? new Date(),
          hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
        },
        trainersData.assist.map(assistant => ({
          type: CourseTrainerType.Assistant,
          trainer_role_types: assistant.trainer_role_types,
          levels: assistant.levels,
        }))
      )
      if (exceptions.length > 0) {
        setCourseExceptions(exceptions)
        return
      }
    }
    editCourse()
  }, [
    acl,
    courseData,
    editCourse,
    profile,
    seniorOrPrincipalLead,
    trainersData,
    editCourseValid,
  ])

  const showTrainerRatioWarning = useMemo(() => {
    if (
      !courseData?.courseLevel ||
      !courseData?.type ||
      !courseData?.maxParticipants ||
      !courseData?.accreditedBy
    )
      return false

    return isTrainersRatioNotMet(
      {
        ...courseData,
        accreditedBy: courseData.accreditedBy ?? Accreditors_Enum.Icm,
        bildStrategies: courseData.bildStrategies ?? {},
        level: courseData.courseLevel as unknown as CourseLevel,
        type: courseData.type as unknown as CourseType,
        max_participants: courseData.maxParticipants as unknown as number,
        hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
      },
      [
        ...(trainersData?.assist ?? []).map(assistant => ({
          type: CourseTrainerType.Assistant,
          trainer_role_types: assistant.trainer_role_types,
          levels: assistant.levels,
        })),
        ...(trainersData?.lead ?? []).map(lead => ({
          type: CourseTrainerType.Leader,
          trainer_role_types: lead.trainer_role_types,
          levels: lead.levels,
        })),
      ]
    )
  }, [
    courseData,
    seniorOrPrincipalLead,
    trainersData?.assist,
    trainersData?.lead,
  ])

  if (
    (courseStatus === LoadingStatus.SUCCESS && !course) ||
    (course &&
      !acl.canEditCourses(course.type, leader?.profile.id === profile?.id))
  ) {
    return <NotFound />
  }

  const alignedWithProtocol =
    (courseData?.startDateTime &&
      differenceInCalendarDays(courseData.startDateTime, new Date()) > 14) ||
    acl.canRescheduleWithoutWarning()

  const hasError = updatingError || auditError
  const fetching = updatingCourse || insertingAudit
  const cancellableCourse =
    course &&
    [
      Course_Status_Enum.TrainerUnavailable,
      Course_Status_Enum.TrainerPending,
      Course_Status_Enum.Scheduled,
      Course_Status_Enum.ConfirmModules,
    ].indexOf(course.status) !== -1
  const canCancelCourse =
    acl.canCancelCourses() ||
    course?.trainers?.find(
      t => t.profile.id === profile?.id && t.type === CourseTrainerType.Leader
    )

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {courseStatus === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="edit-course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {courseStatus === LoadingStatus.ERROR ? (
          <Alert severity="error" variant="outlined">
            {t('pages.edit-course.course-not-found')}
          </Alert>
        ) : null}

        {course && LoadingStatus.SUCCESS ? (
          <Box display="flex" paddingBottom={5}>
            <Box width={400} display="flex" flexDirection="column" pr={4}>
              <Sticky top={20}>
                <Box mb={2}>
                  <BackButton
                    label={t('pages.create-course.back-button-text')}
                    to="/courses"
                  />
                </Box>
                <Typography variant="h2" mb={4}>
                  {t('pages.edit-course.title')}
                </Typography>

                <Box mb={4}>
                  <Typography
                    mb={1}
                    variant="h6"
                    fontWeight={600}
                    color="dimGrey.main"
                  >
                    {t('status')}
                  </Typography>
                  <CourseStatusChip status={course.status} hideIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    mb={1}
                    fontWeight={600}
                    color="dimGrey.main"
                  >
                    {t('course-type')}
                  </Typography>
                  <Typography>{t(`course-types.${course.type}`)}</Typography>
                </Box>
              </Sticky>
            </Box>

            <Box flex={1}>
              <Box mt={8}>
                {hasError ? (
                  <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                    {t('pages.edit-course.updating-error')}
                  </Alert>
                ) : null}
                <Box mb={2}>
                  <CourseForm
                    courseInput={courseInput}
                    type={course?.type}
                    onChange={handleCourseFormChange}
                    disabledFields={disabledFields}
                    isCreation={false}
                    methodsRef={methods}
                  />
                </Box>

                {courseData?.maxParticipants &&
                courseData?.startDateTime &&
                courseData.endDateTime &&
                courseData.type ? (
                  <ChooseTrainers
                    courseType={courseData.type}
                    courseLevel={courseData.courseLevel || CourseLevel.Level_1}
                    courseSchedule={{
                      start: courseData.startDateTime,
                      end: courseData.endDateTime,
                    }}
                    trainers={course.trainers}
                    onChange={handleTrainersDataChange}
                    autoFocus={false}
                    isReAccreditation={courseData.reaccreditation}
                    bildStrategies={
                      courseData.bildStrategies
                        ? (bildStrategiesToArray(
                            courseData.bildStrategies
                          ) as unknown as BildStrategy[])
                        : undefined
                    }
                    showAssistHint={false}
                  />
                ) : null}

                {showTrainerRatioWarning ? (
                  <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                    {t(
                      `pages.create-course.exceptions.type_${CourseException.TRAINER_RATIO_NOT_MET}`
                    )}
                  </Alert>
                ) : null}

                <Box display="flex" justifyContent="space-between" mt={4}>
                  {cancellableCourse && canCancelCourse ? (
                    <Button
                      data-testid="cancel-course-button"
                      variant="outlined"
                      onClick={() => {
                        if (
                          course.type === CourseType.OPEN &&
                          participantsCount
                        ) {
                          setShowRegistrantsCancellationModal(true)
                        } else {
                          setShowCancellationModal(true)
                        }
                      }}
                      startIcon={<Cancel color="error" />}
                    >
                      {t('pages.edit-course.cancel-this-course')}
                    </Button>
                  ) : (
                    <></>
                  )}
                  <LoadingButton
                    variant="contained"
                    onClick={submitButtonHandler}
                    loading={fetching}
                    data-testid="save-button"
                  >
                    {t('pages.edit-course.save-button-text')}
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Container>

      {course ? (
        <>
          <Dialog
            open={showRegistrantsCancellationModal}
            onClose={() => setShowRegistrantsCancellationModal(false)}
            title={
              <Typography variant="h3" fontWeight={600}>
                {t('pages.edit-course.cancellation-modal.title')}
              </Typography>
            }
            maxWidth={700}
          >
            <RegistrantsCancellationModal
              onTransfer={() => navigate(`/courses/${course.id}/details`)}
              onProceed={async () => {
                setShowRegistrantsCancellationModal(false)
                setShowCancellationModal(true)
              }}
            />
          </Dialog>

          <Dialog
            open={showCancellationModal}
            onClose={() => setShowCancellationModal(false)}
            title={
              <Typography variant="h3" fontWeight={600}>
                {t('pages.edit-course.cancellation-modal.title')}
              </Typography>
            }
            maxWidth={600}
          >
            <CourseCancellationModal
              course={course}
              onClose={() => setShowCancellationModal(false)}
              onSubmit={async () => {
                await mutateCourse()

                addSnackbarMessage('course-canceled', {
                  label: t('pages.course-details.course-has-been-cancelled', {
                    code: course.course_code,
                  }),
                })

                navigate(`/courses/${course.id}/details`)
              }}
            />
          </Dialog>

          <ReviewChangesModal
            open={showReviewModal}
            diff={courseDiffs}
            onCancel={() => setShowReviewModal(false)}
            onConfirm={reviewInput => {
              saveChanges(reviewInput)
            }}
            withFees={course.type === CourseType.CLOSED}
            alignedWithProtocol={alignedWithProtocol}
            level={course.level as unknown as Course_Level_Enum}
          />

          <CourseExceptionsConfirmation
            open={courseExceptions.length > 0}
            onCancel={() => setCourseExceptions([])}
            onSubmit={editCourse}
            exceptions={courseExceptions}
            courseType={courseData?.type ?? undefined}
          />
        </>
      ) : null}
    </FullHeightPage>
  )
}
