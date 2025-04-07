import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Cancel from '@mui/icons-material/Cancel'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { differenceInCalendarDays } from 'date-fns'
import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { FormState, UseFormReset, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { Dialog } from '@app/components/dialogs'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Accreditors_Enum,
  BildStrategy,
  Course_Exception_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  CourseLevel,
  GetCourseByIdQuery,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import ChooseTrainers, {
  FormValues as TrainersFormValues,
} from '@app/modules/course/components/ChooseTrainers'
import {
  DisabledFields,
  CourseForm,
} from '@app/modules/course/components/CourseForm'
import { CourseExceptionsConfirmation } from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  getExceptionsToIgnoreOnEditForTrainer,
  isTrainersRatioNotMet,
} from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { CourseCancellationModal } from '@app/modules/edit_course/components/CourseCancellationModal'
import { RegistrantsCancellationModal } from '@app/modules/edit_course/components/RegistrantsCancellationModal'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import {
  CourseInput,
  RoleName,
  TrainerRoleType,
  TrainerRoleTypeName,
} from '@app/types'
import {
  bildStrategiesToArray,
  checkIsEmployerAOL,
  checkIsETA,
  courseStarted,
  LoadingStatus,
} from '@app/util'

import {
  FormValues as ReviewChangesFormValues,
  ReviewChangesModal,
} from '../../components/ReviewChangesModal'
import { useEditCourse } from '../../contexts/EditCourseProvider/EditCourseProvider'

const editAttendeesForbiddenStatuses = [
  Course_Status_Enum.ConfirmModules,
  Course_Status_Enum.Declined,
  Course_Status_Enum.ExceptionsApprovalPending,
]
// 17.12.2024 - 47 cognitive complexity - tread with caution
export const EditCourse: React.FC<React.PropsWithChildren<unknown>> = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useTranslation()
  const { profile, acl, activeRole } = useAuth()
  const navigate = useNavigate()
  const isAustraliaRegion = acl.isAustralia()
  const { isUKCountry } = useWorldCountries()
  const { addSnackbarMessage } = useSnackbar()

  const [trainersDataValid, setTrainersDataValid] = useState(false)
  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const [
    showRegistrantsCancellationModal,
    setShowRegistrantsCancellationModal,
  ] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [
    allowCourseEditWithoutScheduledPrice,
    setAllowCourseEditWithoutScheduledPrice,
  ] = useState<boolean>(true)

  const courseMethods = useRef<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
    reset: UseFormReset<CourseInput>
  }>(null)

  const trainerMethods = useRef<{
    reset: UseFormReset<TrainersFormValues>
  }>(null)

  const {
    autoapproved,
    canGoToCourseBuilder,
    courseData,
    courseDataValid,
    courseDiffs,
    courseExceptions,
    courseFormInput: courseInput,
    fetching,
    getCourseName,
    hasError,
    mutateCourse,
    preEditedCourse: course,
    requireNewOrderForGo1Licenses,
    requireNewOrderForResourcePacks,
    saveChanges,
    setCourseData,
    setCourseDataValid,
    setCourseExceptions,
    setEditCourseReviewInput,
    setTrainersData,
    status: progressStatus,
    trainersData,
  } = useEditCourse()

  const submitDisabled =
    (courseData?.type === Course_Type_Enum.Closed ||
      courseData?.type === Course_Type_Enum.Indirect) &&
    !trainersData?.lead.length

  const participantsCount =
    (course as GetCourseByIdQuery['course'])?.attendeesCount?.aggregate
      ?.count ?? 0

  const canEditAttendees =
    course?.type === Course_Type_Enum.Indirect &&
    !editAttendeesForbiddenStatuses.includes(course?.status)

  const seniorOrPrincipalLead = useMemo(
    () =>
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL,
      ) ?? false,
    [profile],
  )

  const isETA = useMemo(
    () =>
      checkIsETA(profile?.trainer_role_types as unknown as TrainerRoleType[]),
    [profile],
  )
  const isEmployerAOL = useMemo(
    () =>
      checkIsEmployerAOL(
        profile?.trainer_role_types as unknown as TrainerRoleType[],
      ),
    [profile],
  )

  const alignedWithProtocol =
    (courseData?.startDateTime &&
      differenceInCalendarDays(courseData.startDateTime, new Date()) > 14) ||
    acl.canRescheduleWithoutWarning()

  const canRescheduleCourseEndDate =
    activeRole === RoleName.TRAINER &&
    course?.type === Course_Type_Enum.Indirect &&
    courseStarted(course)

  const cancellableCourse =
    course &&
    [
      Course_Status_Enum.ConfirmModules,
      Course_Status_Enum.ExceptionsApprovalPending,
      Course_Status_Enum.Scheduled,
      Course_Status_Enum.TrainerDeclined,
      Course_Status_Enum.TrainerMissing,
      Course_Status_Enum.TrainerPending,
    ].indexOf(course.status) !== -1

  const canCancelCourse =
    acl.canCancelCourses() ||
    course?.trainers?.find(
      t =>
        t.profile.id === profile?.id &&
        t.type === Course_Trainer_Type_Enum.Leader,
    )

  const editCourseValid = courseDataValid && trainersDataValid
  const baseDisabledFields: DisabledFields[] = useMemo(
    () => [
      'accreditedBy',
      'bildStrategies',
      'blendedLearning',
      'conversion',
      'courseLevel',
      'reaccreditation',
      'resourcePacksType',
    ],
    [],
  )

  const disabledFields = useMemo(() => {
    if (!course || acl.canEditWithoutRestrictions(course.type)) {
      return new Set<DisabledFields>(baseDisabledFields)
    }

    return new Set<DisabledFields>([
      ...baseDisabledFields,
      'aolCountry',
      'aolRegion',
      'bookingContact',
      'deliveryType',
      'minParticipants',
      'organization',
      'usesAOL',
      ...(canEditAttendees
        ? ([] as Array<DisabledFields>)
        : (['maxParticipants'] as Array<DisabledFields>)),
    ])
  }, [acl, baseDisabledFields, canEditAttendees, course])

  const handleCourseFormChange = useCallback(
    ({ data, isValid }: { data?: CourseInput; isValid?: boolean }) => {
      if (data) {
        setCourseData(data)
      }
      setCourseDataValid(Boolean(isValid))
    },
    [setCourseData, setCourseDataValid],
  )

  const handleTrainersDataChange = useCallback(
    (data: TrainersFormValues, isValid: boolean) => {
      setTrainersData(data)
      setTrainersDataValid(isValid)
    },
    [setTrainersData],
  )

  const handleReset = useCallback(() => {
    courseMethods.current?.reset()
    trainerMethods.current?.reset()
  }, [])

  const nextStep = useCallback(
    (reviewInput?: ReviewChangesFormValues) => {
      if (requireNewOrderForGo1Licenses || requireNewOrderForResourcePacks) {
        navigate('./review-licenses-order')
      } else {
        saveChanges(reviewInput)
      }
    },
    [
      navigate,
      requireNewOrderForGo1Licenses,
      requireNewOrderForResourcePacks,
      saveChanges,
    ],
  )

  const editCourse = useCallback(() => {
    if (!autoapproved) {
      setShowReviewModal(true)
    } else {
      nextStep()
    }
  }, [autoapproved, nextStep])

  const submitButtonHandler = useCallback(async () => {
    courseMethods?.current?.trigger()

    if (
      !editCourseValid ||
      !courseData?.courseLevel ||
      !courseData?.type ||
      !profile ||
      !trainersData
    )
      return

    if (!allowCourseEditWithoutScheduledPrice) return

    const checkCourseExceptionsData = {
      ...courseData,
      accreditedBy: courseData.accreditedBy ?? Accreditors_Enum.Icm,
      bildStrategies: courseData.bildStrategies ?? {},
      courseLevel: courseData.courseLevel ?? Course_Level_Enum.Level_1,
      type: courseData.type,
      maxParticipants: courseData.maxParticipants ?? 0,
      startDateTime: courseData.startDateTime ?? new Date(),
      hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
      usesAOL: courseData.usesAOL,
      isTrainer: acl.isTrainer(),
      isETA: isETA,
      isEmployerAOL: isEmployerAOL,
      isUKCountry: isUKCountry(courseData.residingCountry),
      isAustraliaRegion: acl.isAustralia(),
    }

    if (courseData.type !== Course_Type_Enum.Open && !acl.isTTAdmin()) {
      const exceptions = checkCourseDetailsForExceptions(
        checkCourseExceptionsData,
        [
          ...trainersData.lead.map(leader => ({
            type: Course_Trainer_Type_Enum.Leader,
            trainer_role_types: leader.trainer_role_types,
            levels: leader.levels,
          })),
          ...trainersData.assist.map(assistant => ({
            type: Course_Trainer_Type_Enum.Assistant,
            trainer_role_types: assistant.trainer_role_types,
            levels: assistant.levels,
          })),
          ...trainersData.moderator.map(mod => ({
            type: Course_Trainer_Type_Enum.Moderator,
            trainer_role_types: mod.trainer_role_types,
            levels: mod.levels,
          })),
        ],
        acl.isAustralia(),
        [
          ...(course?.status !== Course_Status_Enum.ExceptionsApprovalPending
            ? getExceptionsToIgnoreOnEditForTrainer({
                courseData: checkCourseExceptionsData,
                courseInput,
              })
            : []),
        ],
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
    allowCourseEditWithoutScheduledPrice,
    seniorOrPrincipalLead,
    acl,
    isETA,
    isEmployerAOL,
    isUKCountry,
    editCourse,
    course?.status,
    courseInput,
    canRescheduleCourseEndDate,
    autoapproved,
    alignedWithProtocol,
    setCourseExceptions,
  ])

  const showTrainerRatioWarning = useMemo(() => {
    if (
      !courseData?.courseLevel ||
      !courseData?.type ||
      !courseData?.maxParticipants ||
      !courseData?.accreditedBy ||
      (isAustraliaRegion &&
        courseData.courseLevel === Course_Level_Enum.FoundationTrainer)
    )
      return false

    return isTrainersRatioNotMet(
      {
        ...courseData,
        accreditedBy: courseData.accreditedBy ?? Accreditors_Enum.Icm,
        level: courseData.courseLevel as unknown as Course_Level_Enum,
        type: courseData.type,
        max_participants: courseData.maxParticipants as unknown as number,
        usesAOL: courseData.usesAOL,
        isTrainer: acl.isTrainer(),
        isUKCountry: isUKCountry(courseData.residingCountry),
        isAustraliaRegion: acl.isAustralia(),
      },
      [
        ...(trainersData?.assist ?? []).map(assistant => ({
          type: Course_Trainer_Type_Enum.Assistant,
          trainer_role_types: assistant.trainer_role_types,
          levels: assistant.levels,
        })),
        ...(trainersData?.lead ?? []).map(lead => ({
          type: Course_Trainer_Type_Enum.Leader,
          trainer_role_types: lead.trainer_role_types,
          levels: lead.levels,
        })),
        ...(trainersData?.moderator ?? []).map(moderator => ({
          type: Course_Trainer_Type_Enum.Moderator,
          trainer_role_types: moderator.trainer_role_types,
          levels: moderator.levels,
        })),
      ],
    )
  }, [
    acl,
    courseData,
    isAustraliaRegion,
    isUKCountry,
    trainersData?.assist,
    trainersData?.lead,
    trainersData?.moderator,
  ])

  if (
    (progressStatus === LoadingStatus.SUCCESS && !course) ||
    (course && !acl.canEditCourses(course))
  ) {
    return <NotFound />
  }

  const goToCurseBuilder = canGoToCourseBuilder
    ? t('pages.edit-course.course-builder-button-text')
    : t('pages.edit-course.save-button-text')

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {progressStatus === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            data-testid="edit-course-fetching"
            justifyContent="center"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {progressStatus === LoadingStatus.ERROR ? (
          <Alert severity="error" variant="outlined">
            {t('pages.edit-course.course-not-found')}
          </Alert>
        ) : null}

        {course && LoadingStatus.SUCCESS ? (
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            paddingBottom={5}
          >
            <Box display="flex" flexDirection="column" pr={4} width={400}>
              <Sticky top={20}>
                <Box mb={2}>
                  <BackButton
                    label={t('pages.edit-course.back-to-course-button', {
                      courseName: getCourseName(),
                    })}
                    to={`/${
                      acl.isTrainer() ? 'courses' : 'manage-courses/all'
                    }/${course.id}/details`}
                  />
                </Box>
                <Typography mb={4} variant="h2">
                  {t('pages.edit-course.title')}
                </Typography>

                <Box mb={4}>
                  <Typography
                    color="dimGrey.main"
                    fontWeight={600}
                    mb={1}
                    variant="h6"
                  >
                    {t('status')}
                  </Typography>
                  <CourseStatusChip hideIcon status={course.status} />
                </Box>

                <Box>
                  <Typography
                    color="dimGrey.main"
                    fontWeight={600}
                    mb={1}
                    variant="h6"
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
                  <Alert severity="error" sx={{ mb: 2 }} variant="outlined">
                    {t('pages.edit-course.updating-error')}
                  </Alert>
                ) : null}
                <Box mb={2}>
                  <CourseForm
                    allowCourseEditWithoutScheduledPrice={
                      setAllowCourseEditWithoutScheduledPrice
                    }
                    courseInput={courseData ?? courseInput}
                    currentNumberOfParticipantsAndInvitees={
                      (course?.attendeesCount?.aggregate.count ?? 0) +
                      (course?.participantsPendingInvites?.aggregate.count ?? 0)
                    }
                    disabledFields={disabledFields}
                    isCreation={false}
                    methodsRef={courseMethods}
                    onChange={handleCourseFormChange}
                    trainerRatioNotMet={showTrainerRatioWarning}
                    type={course?.type}
                  />
                </Box>

                {courseData?.startDateTime &&
                courseData.endDateTime &&
                courseData.type ? (
                  <ChooseTrainers
                    autoFocus={false}
                    bildStrategies={
                      courseData.bildStrategies
                        ? (bildStrategiesToArray(
                            courseData.bildStrategies,
                          ) as unknown as BildStrategy[])
                        : undefined
                    }
                    courseLevel={
                      courseData.courseLevel ||
                      (Course_Level_Enum.Level_1 as unknown as CourseLevel)
                    }
                    courseSchedule={{
                      start: courseData.startDateTime,
                      end: courseData.endDateTime,
                    }}
                    courseType={courseData.type}
                    isConversion={courseData.conversion}
                    isReAccreditation={courseData.reaccreditation}
                    methodsRef={trainerMethods}
                    onChange={handleTrainersDataChange}
                    showAssistHint={false}
                    trainers={course.trainers}
                    useAOL={courseData.usesAOL}
                  />
                ) : null}

                <SubmitAlert
                  submitDisabled={submitDisabled}
                  showTrainerRatioWarning={showTrainerRatioWarning}
                />

                <Box
                  display="flex"
                  flexDirection={isMobile ? 'column' : 'row'}
                  justifyContent="space-between"
                  mt={4}
                >
                  {cancellableCourse && canCancelCourse ? (
                    <Button
                      data-testid="cancel-course-button"
                      onClick={() => {
                        if (
                          course.type === Course_Type_Enum.Open &&
                          participantsCount
                        ) {
                          setShowRegistrantsCancellationModal(true)
                        } else {
                          setShowCancellationModal(true)
                        }
                      }}
                      startIcon={<Cancel color="error" />}
                      variant="outlined"
                    >
                      {t('pages.edit-course.cancel-this-course')}
                    </Button>
                  ) : (
                    <></>
                  )}

                  <Button
                    data-testid="reset-edit-course-button"
                    onClick={handleReset}
                    startIcon={<Cancel color="error" />}
                    variant="outlined"
                  >
                    {t('pages.edit-course.reset-button-text')}
                  </Button>

                  <LoadingButton
                    data-testid="save-button"
                    disabled={submitDisabled}
                    endIcon={
                      canGoToCourseBuilder ||
                      requireNewOrderForGo1Licenses ||
                      requireNewOrderForResourcePacks ? (
                        <ArrowForwardIcon />
                      ) : null
                    }
                    loading={fetching}
                    onClick={submitButtonHandler}
                    sx={{ mt: isMobile ? 2 : 0 }}
                    variant="contained"
                  >
                    {requireNewOrderForGo1Licenses ||
                    requireNewOrderForResourcePacks
                      ? t(
                          'pages.create-course.step-navigation-review-and-confirm',
                        )
                      : goToCurseBuilder}
                  </LoadingButton>
                </Box>

                {!allowCourseEditWithoutScheduledPrice && (
                  <Alert
                    data-testid="price-error-banner"
                    severity="error"
                    sx={{ marginTop: '1rem' }}
                    variant="outlined"
                  >
                    {t('pages.create-course.no-course-price')}
                  </Alert>
                )}
              </Box>
            </Box>
          </Box>
        ) : null}
      </Container>

      {course ? (
        <>
          <Dialog
            maxWidth={700}
            onClose={() => setShowRegistrantsCancellationModal(false)}
            open={showRegistrantsCancellationModal}
          >
            <DialogTitle>
              <Typography fontWeight={600} variant="h3">
                {t('pages.edit-course.cancellation-modal.title')}
              </Typography>
            </DialogTitle>

            <RegistrantsCancellationModal
              onProceed={async () => {
                setShowRegistrantsCancellationModal(false)
                setShowCancellationModal(true)
              }}
              onTransfer={() => navigate(`/courses/${course.id}/details`)}
            />
          </Dialog>

          <Dialog
            maxWidth={600}
            onClose={() => setShowCancellationModal(false)}
            open={showCancellationModal}
            slots={{
              Title: () => (
                <Typography fontWeight={600} variant="h3">
                  {t('pages.edit-course.cancellation-modal.title')}
                </Typography>
              ),
            }}
          >
            <CourseCancellationModal
              course={course}
              onClose={() => setShowCancellationModal(false)}
              onSubmit={() => {
                mutateCourse()
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
            alignedWithProtocol={
              canRescheduleCourseEndDate || Boolean(alignedWithProtocol)
            }
            diff={courseDiffs}
            level={course.level as unknown as Course_Level_Enum}
            onCancel={() => setShowReviewModal(false)}
            onConfirm={reviewInput => {
              setEditCourseReviewInput(reviewInput)
              nextStep(reviewInput)
            }}
            open={showReviewModal}
            priceCurrency={course.priceCurrency}
            withFees={course.type === Course_Type_Enum.Closed}
          />

          <CourseExceptionsConfirmation
            courseType={courseData?.type ?? undefined}
            exceptions={courseExceptions}
            onCancel={() => setCourseExceptions([])}
            onSubmit={editCourse}
            open={courseExceptions.length > 0}
          />
        </>
      ) : null}
    </FullHeightPageLayout>
  )
}

function SubmitAlert({
  submitDisabled,
  showTrainerRatioWarning,
}: Readonly<{
  submitDisabled: boolean
  showTrainerRatioWarning: boolean
}>): ReactNode | null {
  const { t } = useTranslation()
  if (submitDisabled) {
    return (
      <Alert severity="error" sx={{ mt: 2 }} variant="outlined">
        {t('pages.edit-course.cannot-save-without-trainer')}
      </Alert>
    )
  }
  if (showTrainerRatioWarning) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }} variant="outlined">
        {t(
          `pages.create-course.exceptions.type_${Course_Exception_Enum.TrainerRatioNotMet}`,
        )}
      </Alert>
    )
  }
  return null
}
