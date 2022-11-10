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
import { differenceInDays } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
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
import {
  Course_Audit_Type_Enum,
  Course_Status_Enum,
  GetCourseByIdQuery,
  InsertCourseAuditMutation,
  InsertCourseAuditMutationVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { CourseCancellationModal } from '@app/pages/EditCourse/CourseCancellationModal'
import { RegistrantsCancellationModal } from '@app/pages/EditCourse/RegistrantsCancellationModal'
import { INSERT_COURSE_AUDIT } from '@app/queries/courses/insert-course-audit'
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
  ValidCourseInput,
} from '@app/types'
import {
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

export const EditCourse: React.FC<unknown> = () => {
  const { id } = useParams()
  const { t } = useTranslation()
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

      if (isValid) {
        setCourseDataValid(isValid)
      }
    },
    []
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

  const saveChanges = async (reviewInput?: FormValues) => {
    const trainersMap = new Map(course?.trainers?.map(t => [t.profile.id, t]))

    try {
      if (courseData && course && trainersData) {
        assertCourseDataValid(courseData, courseDataValid)

        const trainers = [
          ...trainersData.assist.map(t => ({
            ...profileToInput(course, CourseTrainerType.ASSISTANT)(t),
            status: trainersMap.get(t.id)?.status,
          })),
          ...trainersData.moderator.map(t => ({
            ...profileToInput(course, CourseTrainerType.MODERATOR)(t),
            status: trainersMap.get(t.id)?.status,
          })),
        ]

        if (!acl.canAssignLeadTrainer() && profile) {
          trainers.push({
            course_id: course.id,
            profile_id: profile.id,
            type: CourseTrainerType.LEADER,
            status: InviteStatus.ACCEPTED,
          })
        } else {
          trainers.push(
            ...trainersData.lead.map(t => ({
              ...profileToInput(course, CourseTrainerType.LEADER)(t),
              status: trainersMap.get(t.id)?.status,
            }))
          )
        }

        const editResponse = await updateCourse({
          courseId: course.id,
          courseInput: {
            name: generateCourseName(
              {
                level: courseData.courseLevel,
                reaccreditation: courseData.reaccreditation,
              },
              t
            ),
            deliveryType: courseData.deliveryType,
            level: courseData.courseLevel,
            reaccreditation: courseData.reaccreditation,
            go1Integration: courseData.blendedLearning,
            freeSpaces: courseData.freeSpaces,
            ...(courseData.minParticipants
              ? { min_participants: courseData.minParticipants }
              : null),
            max_participants: courseData.maxParticipants,
            ...(courseData.organization
              ? { organization_id: courseData.organization.id }
              : null),
            ...(courseData.contactProfile
              ? { contactProfileId: courseData.contactProfile.id }
              : null),
            ...(courseData.salesRepresentative
              ? { salesRepresentativeId: courseData.salesRepresentative.id }
              : null),
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
            venue_id: courseData.venue ? courseData.venue.id : undefined,
            virtualLink:
              courseData.deliveryType === CourseDeliveryType.F2F
                ? ''
                : courseData.zoomMeetingUrl,
            start: courseData.startDateTime,
            end: courseData.endDateTime,
          },
        })

        if (editResponse.data?.updateCourse.id && courseDiffs.length) {
          const dateChanged = courseDiffs.find(d => d.type === 'date')

          const payload =
            dateChanged && reviewInput
              ? {
                  oldStartDate: course.schedule[0].start,
                  oldEndDate: course.schedule[0].end,
                  newStartDate: courseData.startDateTime.toISOString(),
                  newEndDate: courseData.endDateTime.toISOString(),
                  reason: reviewInput.reason,
                  ...(course.type === CourseType.CLOSED
                    ? {
                        feeType: reviewInput.feeType,
                        customFee: reviewInput.customFee,
                      }
                    : null),
                }
              : {}

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
          mutateCourse()
          navigate(`/courses/${course.id}/details`)
        } else {
          console.error('error updating course')
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const editCourse = () => {
    if (!autoapproved) {
      setShowReviewModal(true)
    } else {
      saveChanges()
    }
  }

  const disabledFields = useMemo(() => {
    if (course && !acl.canEditWithoutRestrictions(course.type)) {
      return new Set<DisabledFields>([
        'organization',
        'contactProfile',
        'courseLevel',
        'blendedLearning',
        'reaccreditation',
        'deliveryType',
        'usesAOL',
        'aolCountry',
        'aolRegion',
        'minParticipants',
        'maxParticipants',
      ])
    }

    return new Set([])
  }, [acl, course])

  if (
    (courseStatus === LoadingStatus.SUCCESS && !course) ||
    (course && !acl.canCreateCourse(course.type))
  ) {
    return <NotFound />
  }

  const editCourseValid = courseDataValid && trainersDataValid

  const alignedWithProtocol =
    (courseData?.startDateTime &&
      differenceInDays(courseData.startDateTime, new Date()) > 14) ||
    acl.canRescheduleWithoutWarning()

  const hasError = updatingError || auditError
  const fetching = updatingCourse || insertingAudit
  const isCancellable =
    course &&
    [
      Course_Status_Enum.TrainerUnavailable,
      Course_Status_Enum.TrainerPending,
      Course_Status_Enum.Scheduled,
      Course_Status_Enum.ConfirmModules,
    ].indexOf(course.status) !== -1

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
                  />
                </Box>

                {courseData?.maxParticipants &&
                courseData?.startDateTime &&
                courseData.endDateTime ? (
                  <ChooseTrainers
                    maxParticipants={courseData?.maxParticipants ?? 0}
                    courseLevel={courseData.courseLevel || CourseLevel.LEVEL_1}
                    courseSchedule={{
                      start: courseData.startDateTime,
                      end: courseData.endDateTime,
                    }}
                    trainers={course.trainers}
                    onChange={handleTrainersDataChange}
                    autoFocus={false}
                    disabled={!acl.canEditWithoutRestrictions(course.type)}
                  />
                ) : null}

                <Box display="flex" justifyContent="space-between" mt={4}>
                  {isCancellable && acl.canCancelCourses() ? (
                    <Button
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
                    disabled={!editCourseValid}
                    variant="contained"
                    onClick={editCourse}
                    loading={fetching}
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
                navigate(`/courses/${course.id}/details?cancelled=true`)
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
          />
        </>
      ) : null}
    </FullHeightPage>
  )
}
