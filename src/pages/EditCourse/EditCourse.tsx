import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { differenceInCalendarDays } from 'date-fns'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FormState, UseFormReset, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import ChooseTrainers, {
  FormValues as TrainersFormValues,
} from '@app/components/ChooseTrainers'
import CourseForm, { DisabledFields } from '@app/components/CourseForm'
import { hasRenewalCycle } from '@app/components/CourseForm/helpers'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { Dialog } from '@app/components/dialogs'
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
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import useCourse from '@app/hooks/useCourse'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  CourseException,
  isTrainersRatioNotMet,
  shouldGoIntoExceptionApproval,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { CourseCancellationModal } from '@app/pages/EditCourse/components/CourseCancellationModal'
import { RegistrantsCancellationModal } from '@app/pages/EditCourse/components/RegistrantsCancellationModal'
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
import {
  BildStrategies,
  CourseDeliveryType,
  CourseInput,
  CourseTrainerType,
  CourseType,
  InviteStatus,
  RoleName,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import {
  bildStrategiesToArray,
  courseToCourseInput,
  generateBildCourseName,
  generateCourseName,
  LoadingStatus,
  profileToInput,
  courseStarted,
} from '@app/util'

import { NotFound } from '../common/NotFound'

import { FormValues, ReviewChangesModal } from './components/ReviewChangesModal'
import { getChangedTrainers, type CourseDiff } from './shared'

function assertCourseDataValid(
  data: CourseInput,
  isValid: boolean
): asserts data is ValidCourseInput {
  if (!isValid) {
    throw new Error()
  }
}

const editAttendeesForbiddenStatuses = [
  Course_Status_Enum.Declined,
  Course_Status_Enum.ExceptionsApprovalPending,
  Course_Status_Enum.ConfirmModules,
]

export const EditCourse: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile, acl, activeRole } = useAuth()
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
  const {
    data: course,
    status: courseStatus,
    mutate: mutateCourse,
  } = useCourse(id ?? '')

  const courseInput: CourseInput | undefined = useMemo(() => {
    return course ? courseToCourseInput(course) : undefined
  }, [course])

  const canGoToCourseBuilder =
    activeRole === RoleName.TRAINER &&
    course?.accreditedBy === Accreditors_Enum.Icm &&
    course?.type === CourseType.INDIRECT

  const courseMethods = useRef<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
    reset: UseFormReset<CourseInput>
  }>(null)

  const trainerMethods = useRef<{
    reset: UseFormReset<TrainersFormValues>
  }>(null)

  const { addSnackbarMessage } = useSnackbar()

  const [{ error: updatingError, fetching: updatingCourse }, updateCourse] =
    useMutation<ResponseType, ParamsType>(UPDATE_COURSE_MUTATION)
  const [{ error: auditError, fetching: insertingAudit }, insertAudit] =
    useMutation<InsertCourseAuditMutation, InsertCourseAuditMutationVariables>(
      INSERT_COURSE_AUDIT
    )

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

  const { strategies } = useBildStrategies(
    Boolean(courseData?.accreditedBy === Accreditors_Enum.Bild)
  )

  const handleTrainersDataChange = useCallback(
    (data: TrainersFormValues, isValid: boolean) => {
      setTrainersData(data)
      setTrainersDataValid(isValid)
    },
    []
  )

  const getCourseName = useCallback(() => {
    return courseData?.accreditedBy === Accreditors_Enum.Bild
      ? generateBildCourseName(
          strategies,
          {
            level: courseData.courseLevel as Course_Level_Enum,
            reaccreditation: courseData.reaccreditation,
            conversion: courseData.conversion,
            bildStrategies: courseData.bildStrategies as Record<
              BildStrategies,
              boolean
            >,
          },
          t
        )
      : generateCourseName(
          {
            level: courseData?.courseLevel as Course_Level_Enum,
            reaccreditation: courseData?.reaccreditation as boolean,
          },
          t
        )
  }, [courseData, strategies, t])

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

          const [trainersToAdd, trainersToDelete] = getChangedTrainers(
            course.trainers?.map(t => ({
              profile_id: t.profile.id,
              type: t.type,
              status: t.status,
            })) ?? [],
            trainers.map(t => ({ profile_id: t.profile_id, type: t.type }))
          )

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

          const orderToUpdate = {
            salesRepresentativeId: courseData.salesRepresentative?.id,
            source: courseData.source,
          }

          const editResponse = await updateCourse({
            courseId: course.id,
            courseInput: {
              // TODO: Delete this after arlo migration
              ...(acl.isInternalUser()
                ? { arloReferenceId: courseData.arloReferenceId || '' }
                : null),
              status,
              ...(courseData.type === CourseType.OPEN
                ? { displayOnWebsite: courseData.displayOnWebsite }
                : null),
              exceptionsPending:
                status === Course_Status_Enum.ExceptionsApprovalPending,
              name: getCourseName(),
              deliveryType: courseData.deliveryType,
              reaccreditation: courseData.reaccreditation,
              go1Integration: courseData.blendedLearning,
              freeSpaces: courseData.freeSpaces,
              special_instructions: courseData.specialInstructions,
              parking_instructions: courseData.parkingInstructions,
              ...(hasRenewalCycle({
                courseType: courseData.type,
                startDate: courseData.startDate,
                courseLevel: courseData.courseLevel,
              })
                ? { renewalCycle: courseData.renewalCycle }
                : { renewalCycle: null }),
              ...(courseData.minParticipants
                ? { min_participants: courseData.minParticipants }
                : null),
              max_participants: courseData.maxParticipants,
              ...(courseData.organization
                ? { organization_id: courseData.organization.id }
                : null),
              ...(courseData.bookingContact?.profileId ||
              courseData.bookingContact?.email
                ? {
                    bookingContactProfileId:
                      courseData.bookingContact?.profileId ?? null,
                  }
                : null),
              ...(courseData.bookingContact?.email
                ? { bookingContactInviteData: courseData.bookingContact }
                : null),
              ...(courseData.organizationKeyContact?.profileId ||
              courseData.organizationKeyContact?.email
                ? {
                    organizationKeyContactProfileId:
                      courseData.organizationKeyContact?.profileId ?? null,
                  }
                : null),
              ...(courseData.organizationKeyContact?.email
                ? {
                    organizationKeyContactInviteData:
                      courseData.organizationKeyContact,
                  }
                : null),
              ...(courseData.usesAOL
                ? {
                    aolCostOfCourse: courseData.courseCost,
                    aolCountry: courseData.aolCountry,
                    aolRegion: courseData.aolRegion,
                  }
                : null),
              ...(courseData.price ? { price: courseData.price } : null),
            },
            orderInput: orderToUpdate,
            trainers: trainersToAdd.map(t => ({
              ...t,
              course_id: course.id,
            })),
            trainersToDelete,
            scheduleId: course?.schedule[0].id,
            scheduleInput: {
              venue_id: newVenueId,
              virtualLink: newVirtualLink,
              virtualAccountId: courseData.zoomProfileId,
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
            await notifyCourseEdit(
              {
                courseId: course.id,
                level: course.level,
                venueId: course.schedule[0].venue?.id || null,
                virtualLink: course.schedule[0].virtualLink || null,
                startDate: course.dates.aggregate.start.date,
                endDate: course.dates.aggregate.end.date,
                parkingInstructions: course.parking_instructions || '',
                specialInstructions: course.special_instructions || '',
              },
              course.trainers?.map(trainer => ({
                id: trainer.profile.id,
                type: trainer.type,
              })) || []
            )
            await mutateCourse()
            canGoToCourseBuilder
              ? navigate(`/courses/${courseInput?.id}/modules`, {
                  state: { editMode: true },
                })
              : navigate(`/courses/${course.id}/details`)
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
      canGoToCourseBuilder,
      course,
      courseData,
      courseDataValid,
      courseDiffs,
      courseExceptions.length,
      courseInput?.id,
      insertAudit,
      mutateCourse,
      navigate,
      notifyCourseEdit,
      profile,
      trainersData,
      updateCourse,
      getCourseName,
    ]
  )

  const handleReset = useCallback(() => {
    courseMethods.current?.reset()
    trainerMethods.current?.reset()
  }, [])

  const editCourse = useCallback(() => {
    if (!autoapproved) {
      setShowReviewModal(true)
    } else {
      saveChanges()
    }
  }, [autoapproved, saveChanges])

  const canEditAttendees =
    course?.type === CourseType.INDIRECT &&
    !editAttendeesForbiddenStatuses.includes(course?.status)

  const disabledFields = useMemo(() => {
    if (course) {
      if (!acl.canEditWithoutRestrictions(course.type)) {
        return new Set<DisabledFields>([
          'accreditedBy',
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
          ...(canEditAttendees
            ? ([] as Array<DisabledFields>)
            : (['maxParticipants'] as Array<DisabledFields>)),
          'bildStrategies',
          'conversion',
        ])
      }
      return new Set<DisabledFields>([
        'accreditedBy',
        'courseLevel',
        'bildStrategies',
        'blendedLearning',
        'reaccreditation',
        'conversion',
      ])
    }

    return new Set([])
  }, [acl, canEditAttendees, course])

  const seniorOrPrincipalLead = useMemo(() => {
    return (
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL
      ) ?? false
    )
  }, [profile])

  const alignedWithProtocol =
    (courseData?.startDateTime &&
      differenceInCalendarDays(courseData.startDateTime, new Date()) > 14) ||
    acl.canRescheduleWithoutWarning()

  const canRescheduleCourseEndDate =
    activeRole === RoleName.TRAINER &&
    course?.type === CourseType.INDIRECT &&
    courseStarted(course)

  const hasError = updatingError || auditError
  const fetching = updatingCourse || insertingAudit
  const cancellableCourse =
    course &&
    [
      Course_Status_Enum.TrainerPending,
      Course_Status_Enum.TrainerMissing,
      Course_Status_Enum.TrainerDeclined,
      Course_Status_Enum.Scheduled,
      Course_Status_Enum.ConfirmModules,
      Course_Status_Enum.ExceptionsApprovalPending,
    ].indexOf(course.status) !== -1
  const canCancelCourse =
    acl.canCancelCourses() ||
    course?.trainers?.find(
      t => t.profile.id === profile?.id && t.type === CourseTrainerType.Leader
    )

  const editCourseValid = courseDataValid && trainersDataValid
  const submitButtonHandler = useCallback(async () => {
    courseMethods?.current?.trigger()
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
          courseLevel: courseData.courseLevel ?? Course_Level_Enum.Level_1,
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
      if (
        canRescheduleCourseEndDate ||
        (!autoapproved && !alignedWithProtocol)
      ) {
        setShowReviewModal(true)
        return
      }

      if (exceptions.length > 0) {
        setCourseExceptions(exceptions)
        return
      }
    }
    editCourse()
  }, [
    editCourseValid,
    courseData,
    profile,
    trainersData,
    acl,
    editCourse,
    seniorOrPrincipalLead,
    autoapproved,
    alignedWithProtocol,
    canRescheduleCourseEndDate,
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
        level: courseData.courseLevel as unknown as Course_Level_Enum,
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
        ...(trainersData?.moderator ?? []).map(moderator => ({
          type: CourseTrainerType.Moderator,
          trainer_role_types: moderator.trainer_role_types,
          levels: moderator.levels,
        })),
      ]
    )
  }, [
    courseData,
    seniorOrPrincipalLead,
    trainersData?.assist,
    trainersData?.lead,
    trainersData?.moderator,
  ])

  const submitDisabled =
    (courseData?.type === CourseType.CLOSED ||
      courseData?.type === CourseType.INDIRECT) &&
    !trainersData?.lead.length

  if (
    (courseStatus === LoadingStatus.SUCCESS && !course) ||
    (course && !acl.canEditCourses(course))
  ) {
    return <NotFound />
  }

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
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
          <Box
            display="flex"
            paddingBottom={5}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Box width={400} display="flex" flexDirection="column" pr={4}>
              <Sticky top={20}>
                <Box mb={2}>
                  <BackButton
                    label={t('pages.edit-course.back-to-course-button', {
                      courseName: getCourseName(),
                    })}
                    to={'/courses/' + id + '/details'}
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
              <Box mt={isMobile ? 4 : 8}>
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
                    methodsRef={courseMethods}
                    trainerRatioNotMet={showTrainerRatioWarning}
                  />
                </Box>

                {courseData?.startDateTime &&
                courseData.endDateTime &&
                courseData.type ? (
                  <ChooseTrainers
                    courseType={courseData.type}
                    courseLevel={
                      courseData.courseLevel || Course_Level_Enum.Level_1
                    }
                    courseSchedule={{
                      start: courseData.startDateTime,
                      end: courseData.endDateTime,
                    }}
                    trainers={course.trainers}
                    onChange={handleTrainersDataChange}
                    autoFocus={false}
                    isReAccreditation={courseData.reaccreditation}
                    isConversion={courseData.conversion}
                    bildStrategies={
                      courseData.bildStrategies
                        ? (bildStrategiesToArray(
                            courseData.bildStrategies
                          ) as unknown as BildStrategy[])
                        : undefined
                    }
                    showAssistHint={false}
                    methodsRef={trainerMethods}
                  />
                ) : null}

                {submitDisabled ? (
                  <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
                    {t('pages.edit-course.cannot-save-without-trainer')}
                  </Alert>
                ) : showTrainerRatioWarning ? (
                  <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                    {t(
                      `pages.create-course.exceptions.type_${CourseException.TRAINER_RATIO_NOT_MET}`
                    )}
                  </Alert>
                ) : null}

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={4}
                  flexDirection={isMobile ? 'column' : 'row'}
                >
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

                  <Button
                    data-testid="reset-edit-course-button"
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<Cancel color="error" />}
                  >
                    {t('pages.edit-course.reset-button-text')}
                  </Button>

                  <LoadingButton
                    variant="contained"
                    onClick={submitButtonHandler}
                    loading={fetching}
                    data-testid="save-button"
                    sx={{ mt: isMobile ? 2 : 0 }}
                    endIcon={canGoToCourseBuilder ? <ArrowForwardIcon /> : null}
                    disabled={submitDisabled}
                  >
                    {canGoToCourseBuilder
                      ? t('pages.edit-course.course-builder-button-text')
                      : t('pages.edit-course.save-button-text')}
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
            alignedWithProtocol={
              canRescheduleCourseEndDate || Boolean(alignedWithProtocol)
            }
            level={course.level as unknown as Course_Level_Enum}
          />

          {!showTrainerRatioWarning ? (
            <CourseExceptionsConfirmation
              open={courseExceptions.length > 0}
              onCancel={() => setCourseExceptions([])}
              onSubmit={editCourse}
              exceptions={courseExceptions}
              courseType={courseData?.type ?? undefined}
            />
          ) : null}
        </>
      ) : null}
    </FullHeightPageLayout>
  )
}
