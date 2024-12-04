import {
  Box,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { ConfirmDialog } from '@app/components/dialogs'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  Course_Type_Enum,
  Scalars,
  SendCourseInformationMutation,
  SendCourseInformationMutationVariables,
} from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import { CourseDetailsFilters } from '@app/modules/course/components/CourseForm/components/CourseDetailsFilters'
import { CancelAttendeeDialog } from '@app/modules/course_details/course_attendees_tab/components/CancelAttendeeDialog'
import { ManageAttendanceMenu } from '@app/modules/course_details/course_attendees_tab/components/ManageAttendanceMenu'
import {
  Mode,
  ReplaceParticipantDialog,
} from '@app/modules/course_details/course_attendees_tab/components/ReplaceParticipantDialog'
import { MUTATION as SEND_COURSE_INFO } from '@app/modules/course_details/course_attendees_tab/queries/send-course-information'
import useCourseParticipants from '@app/modules/course_details/hooks/course-participant/useCourseParticipants'
import { LinkToProfile } from '@app/modules/profile/components/LinkToProfile'
import {
  BlendedLearningStatus,
  Course,
  CourseParticipant,
  SortOrder,
} from '@app/types'
import {
  courseStarted,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
  getParticipantOrgIds,
  LoadingStatus,
} from '@app/util'

import { AttendingToggle } from '../AttendingToggle/AttendingToggle'
import { BulkAttendanceButton } from '../BulkAttendanceButton/BulkAttendanceButton'

type TabProperties = {
  course: Course
  onSendingCourseInformation: (success: boolean) => void
  updateAttendeesHandler: () => void
}

const attendanceDisabledStatuses = [
  Course_Status_Enum.Cancelled,
  Course_Status_Enum.Declined,
  Course_Status_Enum.Draft,
]

export const AttendingTab = ({
  course,
  onSendingCourseInformation,
  updateAttendeesHandler,
}: TabProperties) => {
  const { isOrgAdmin, acl } = useAuth()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [attendeeToCancel, setAttendeeToCancel] = useState<CourseParticipant>()
  const [attendeeToReplace, setAttendeeToReplace] =
    useState<CourseParticipant>()
  const [attendeeToResendInfo, setAttendeeToResendInfo] =
    useState<CourseParticipant>()
  const [where, setWhere] = useState<Record<string, object>>({})
  const handleWhereConditionChange = (
    whereCondition: Record<string, object>,
  ) => {
    setWhere(whereCondition)
  }

  const isBlendedCourse = course.go1Integration
  const isOpenCourse = course.type === Course_Type_Enum.Open
  const navigate = useNavigate()
  const [, sendCourseInfoMutation] = useMutation<
    SendCourseInformationMutation,
    SendCourseInformationMutationVariables
  >(SEND_COURSE_INFO)

  const canToggleAttendance =
    acl.canGradeParticipants(course.trainers ?? []) && courseStarted(course)

  const isAttendanceDisabled = attendanceDisabledStatuses.includes(
    course.status,
  )

  const {
    data: courseParticipants,
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
    mutate: refreshParticipants,
  } = useCourseParticipants(course?.id, {
    sortBy: sortColumn,
    where,
    order,
    pagination: {
      limit: perPage,
      offset: perPage * currentPage,
    },
    alwaysShowArchived: true,
  })
  useEffect(() => {
    refreshParticipants({ requestPolicy: 'network-only' })
  }, [refreshParticipants, where])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  const handleSortChange = useCallback(
    (columnName: string) => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn],
  )

  const { selected, checkbox, isSelected } = useTableChecks()

  const canViewEvaluationSubmittedColumn = useMemo(() => {
    switch (course.type) {
      case Course_Type_Enum.Open:
        return acl.canViewOpenCourseEvaluationSubmitted()
      case Course_Type_Enum.Closed:
        return acl.canViewClosedCourseEvaluationSubmitted()
      case Course_Type_Enum.Indirect:
        return acl.canViewIndirectCourseEvaluationSubmitted()
      default:
        return false
    }
  }, [acl, course.type])

  const canViewRowActions = useCallback(
    (cp: CourseParticipant) =>
      [
        !cp.profile.archived,
        acl.canManageParticipantAttendance(getParticipantOrgIds(cp), course),
      ].every(Boolean),
    [acl, course],
  )

  const cols = useMemo(
    () =>
      [
        checkbox.headCol(
          courseParticipants
            ?.filter(
              p =>
                !p.grade &&
                (p.course.type === Course_Type_Enum.Indirect &&
                p.course.go1Integration
                  ? !p.completed
                  : true),
            )
            .map(p => p.id) ?? [],
        ),
        {
          id: 'name',
          label: t('pages.course-participants.name'),
          sorting: true,
        },
        {
          id: 'email',
          label: t('common.email'),
          sorting: true,
        },
        {
          id: 'organisation',
          label: t('pages.course-participants.organisation'),
          sorting: false,
        },
        isBlendedCourse
          ? {
              id: 'bl-status',
              label: t('bl-status'),
              sorting: true,
            }
          : null,
        {
          id: 'hs-consent',
          label: t('pages.course-participants.hs-consent'),
          sorting: false,
        },
        canViewEvaluationSubmittedColumn
          ? {
              id: 'evaluation-submitted',
              label: t('pages.course-participants.evaluation-submitted'),
              sorting: false,
            }
          : null,
        canToggleAttendance ||
        (courseParticipants?.some(participant =>
          canViewRowActions(participant),
        ) &&
          courseStarted(course) &&
          (acl.isOrgAdmin() || acl.isOrgKeyContact()))
          ? {
              id: 'attendance',
              label: 'Attendance',
              sorting: false,
            }
          : null,
        isOpenCourse && acl.canViewOrders()
          ? {
              id: 'orders',
              label: t('pages.course-participants.orders'),
              sorting: false,
            }
          : null,
        acl.canManageParticipantAttendance(
          courseParticipants?.reduce(
            (acc, cp) => [...acc, ...getParticipantOrgIds(cp)],
            [] as string[],
          ) ?? [],
          course,
        )
          ? {
              id: 'actions',
              label: t('pages.course-participants.actions'),
              sorting: false,
            }
          : null,
      ].filter(Boolean),
    [
      checkbox,
      courseParticipants,
      t,
      isBlendedCourse,
      canViewEvaluationSubmittedColumn,
      canToggleAttendance,
      isOpenCourse,
      acl,
      course,
      canViewRowActions,
    ],
  )

  const handleTransferAttendee = useCallback(
    (participant: CourseParticipant) => {
      navigate(`../transfer/${participant.id}`, { replace: true })
    },
    [navigate],
  )

  const canToggleParticipantAttendance = useCallback(
    ({
      completed,
      grade,
      course: { go1Integration, type },
    }: CourseParticipant) =>
      (type === Course_Type_Enum.Indirect && go1Integration
        ? !completed
        : true) &&
      canToggleAttendance &&
      !isAttendanceDisabled &&
      !grade,
    [canToggleAttendance, isAttendanceDisabled],
  )

  const sendCourseInfo = useCallback(
    async (
      courseId: SendCourseInformationMutationVariables['courseId'],
      attendeeIds: SendCourseInformationMutationVariables['attendeeIds'],
    ) => {
      setAttendeeToResendInfo(undefined)
      try {
        const { data: response } = await sendCourseInfoMutation({
          courseId,
          attendeeIds,
        })

        if (response?.sendCourseInformation.success) {
          onSendingCourseInformation(true)
        } else {
          console.log('Error! ', response?.sendCourseInformation)
          onSendingCourseInformation(false)
        }
      } catch (err) {
        onSendingCourseInformation(false)
      }
    },
    [onSendingCourseInformation, sendCourseInfoMutation],
  )

  const rowActions = useMemo(
    () => ({
      onTransferClick: handleTransferAttendee,
      onReplaceClick: setAttendeeToReplace,
      onCancelClick: setAttendeeToCancel,
      onResendInformationClick: setAttendeeToResendInfo,
    }),
    [handleTransferAttendee],
  )

  const isOpenTypeCourse = course.type === Course_Type_Enum.Open
  return (
    <>
      {courseParticipantsLoadingStatus === LoadingStatus.SUCCESS ? (
        <>
          <Box sx={{ overflowX: 'auto' }}>
            <SnackbarMessage
              messageKey="attendance-toggle-error"
              sx={{ position: 'absolute' }}
              severity="error"
              autoHideDuration={5000}
            />
            <SnackbarMessage
              messageKey="bulk-attendance-error"
              sx={{ position: 'absolute' }}
              severity="error"
              autoHideDuration={5000}
            />
            <CourseDetailsFilters
              canViewEvaluationSubmittedColumn={
                canViewEvaluationSubmittedColumn
              }
              courseId={course.id}
              handleWhereConditionChange={handleWhereConditionChange}
            />
            {canToggleAttendance ? (
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <BulkAttendanceButton
                  courseId={course.id}
                  participantIds={Array.from(selected)}
                  disabled={isAttendanceDisabled}
                  onSuccess={refreshParticipants}
                />
              </Box>
            ) : null}
            <Box sx={{ overflowX: 'auto' }}>
              <Table data-testid="attending-table">
                <TableHead
                  cols={cols}
                  order={order}
                  orderBy={sortColumn}
                  onRequestSort={handleSortChange}
                />
                <TableBody>
                  {courseParticipants?.map(courseParticipant => {
                    return (
                      <TableRow
                        key={courseParticipant.id}
                        data-testid={`course-participant-row-${courseParticipant.id}`}
                        sx={{
                          backgroundColor: isSelected(courseParticipant.id)
                            ? 'grey.50'
                            : '',
                        }}
                      >
                        {checkbox.rowCell(
                          courseParticipant.id,
                          !canToggleParticipantAttendance(courseParticipant),
                        )}
                        <TableCell>
                          <LinkToProfile
                            profileId={courseParticipant.profile.id}
                            isProfileArchived={
                              courseParticipant.profile.archived
                            }
                            courseId={course.id}
                          >
                            {courseParticipant.profile.archived
                              ? t('common.archived-profile')
                              : courseParticipant.profile.fullName}
                          </LinkToProfile>
                        </TableCell>
                        <TableCell>
                          <LinkToProfile
                            profileId={courseParticipant.profile.id}
                            isProfileArchived={
                              courseParticipant.profile.archived
                            }
                            courseId={course.id}
                          >
                            {courseParticipant.profile.email}
                            {courseParticipant.profile.contactDetails.map(
                              (contact: Scalars['jsonb']) => contact.value,
                            )}
                          </LinkToProfile>
                        </TableCell>
                        <TableCell>
                          {courseParticipant.profile.organizations.map(org =>
                            acl.canViewOrganizations() ? (
                              <Link
                                href={`/organisations/${org.organization.id}`}
                                key={org.organization.id}
                              >
                                <Typography>{org.organization.name}</Typography>
                              </Link>
                            ) : (
                              <Typography key={org.organization.id}>
                                {org.organization.name}
                              </Typography>
                            ),
                          )}
                        </TableCell>
                        {isBlendedCourse && (
                          <TableCell>
                            {courseParticipant.go1EnrolmentStatus && (
                              <Chip
                                label={t(
                                  `blended-learning-status.${courseParticipant.go1EnrolmentStatus}`,
                                )}
                                color={
                                  courseParticipant.go1EnrolmentStatus ===
                                  BlendedLearningStatus.COMPLETED
                                    ? 'success'
                                    : 'warning'
                                }
                              />
                            )}
                          </TableCell>
                        )}
                        <TableCell style={{ textAlign: 'center' }}>
                          {courseParticipant.healthSafetyConsent
                            ? t('common.yes')
                            : t('common.no')}
                        </TableCell>
                        {canViewEvaluationSubmittedColumn ? (
                          <TableCell style={{ textAlign: 'center' }}>
                            {courseParticipant.completed_evaluation &&
                            (courseParticipant.profile
                              .course_evaluation_answers_aggregate?.aggregate
                              .count ?? 0) > 0
                              ? t('common.yes')
                              : t('common.no')}
                          </TableCell>
                        ) : null}
                        {canToggleAttendance ||
                        (canViewRowActions(courseParticipant) &&
                          courseStarted(course) &&
                          (acl.isOrgAdmin() || acl.isOrgKeyContact())) ? (
                          <TableCell width={180}>
                            <AttendingToggle
                              participant={{
                                ...courseParticipant,
                                course_id: courseParticipant.course.id,
                                profile_id: courseParticipant.profile.id,
                              }}
                              disabled={
                                !canToggleParticipantAttendance(
                                  courseParticipant,
                                )
                              }
                            />
                          </TableCell>
                        ) : null}
                        {isOpenCourse && acl.canViewOrders() ? (
                          <TableCell>
                            {courseParticipant.order ? (
                              <Link
                                href={`/orders/${courseParticipant.order.id}`}
                                data-testid="order-item-link"
                                key="order-item-link"
                              >
                                {courseParticipant.order.xeroInvoiceNumber}
                              </Link>
                            ) : (
                              <Typography
                                color="InactiveCaption"
                                style={{ userSelect: 'none' }}
                              >
                                -
                              </Typography>
                            )}
                          </TableCell>
                        ) : null}
                        {canViewRowActions(courseParticipant) ? (
                          <TableCell>
                            <ManageAttendanceMenu
                              course={course}
                              courseParticipant={courseParticipant}
                              data-testid="manage-attendance"
                              {...rowActions}
                            />
                          </TableCell>
                        ) : null}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Box>
          <TablePagination
            component="div"
            count={courseParticipantsTotal ?? 0}
            page={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={perPage}
            rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
            data-testid="course-participants-pagination"
            sx={{
              '.MuiTablePagination-toolbar': { pl: 0 },
              '.MuiTablePagination-spacer': { flex: 0 },
              '.MuiTablePagination-displayedRows': {
                flex: 1,
                textAlign: 'center',
              },
            }}
          />

          {attendeeToCancel ? (
            <CancelAttendeeDialog
              variant={isOpenTypeCourse ? 'complete' : 'minimal'}
              participant={attendeeToCancel}
              course={course}
              onClose={() => setAttendeeToCancel(undefined)}
              onSave={() => {
                refreshParticipants({ requestPolicy: 'network-only' })
                updateAttendeesHandler()
              }}
            />
          ) : null}

          {attendeeToReplace ? (
            <ReplaceParticipantDialog
              course={course}
              participant={{
                id: attendeeToReplace.id,
                fullName: attendeeToReplace.profile.fullName,
                avatar: attendeeToReplace.profile.avatar,
              }}
              onClose={() => setAttendeeToReplace(undefined)}
              onSuccess={() => {
                refreshParticipants()
                updateAttendeesHandler()
              }}
              mode={isOrgAdmin ? Mode.ORG_ADMIN : Mode.TT_ADMIN}
            />
          ) : null}

          {attendeeToResendInfo ? (
            <ConfirmDialog
              open={Boolean(attendeeToResendInfo)}
              title={t(
                'pages.course-participants.resend-course-info.modal.title',
              )}
              message={t(
                'pages.course-participants.resend-course-info.modal.message',
                { fullName: attendeeToResendInfo?.profile.fullName },
              )}
              onCancel={() => setAttendeeToResendInfo(undefined)}
              onOk={() => sendCourseInfo(course.id, [attendeeToResendInfo?.id])}
            />
          ) : null}
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={4}
          data-testid="course-participants-zero-message"
        >
          <Typography variant="body1" color="grey.600">
            {t(
              `pages.course-participants.${
                course.type === Course_Type_Enum.Open
                  ? 'no-attendees'
                  : 'none-registered-message'
              }`,
            )}
          </Typography>
        </Box>
      )}
    </>
  )
}
