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
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  CancelAttendeeDialog,
  ConfirmDialog,
  Mode,
  ReplaceParticipantDialog,
} from '@app/components/dialogs'
import { LinkToProfile } from '@app/components/LinkToProfile'
import { ManageAttendanceMenu } from '@app/components/ManageAttendanceMenu'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  Course_Type_Enum,
  Scalars,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useMatchMutate } from '@app/hooks/useMatchMutate'
import { useTableChecks } from '@app/hooks/useTableChecks'
import {
  MUTATION as SEND_COURSE_INFO,
  ParamsType as SendCourseInfoParamType,
  ResponseType as SendCourseInfoResponseType,
} from '@app/queries/courses/send-course-information'
import { Matcher } from '@app/queries/participants/get-course-participants'
import {
  BlendedLearningStatus,
  Course,
  CourseParticipant,
  SortOrder,
} from '@app/types'
import {
  courseEnded,
  courseStarted,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
  getParticipantOrgIds,
  LoadingStatus,
} from '@app/util'

import { AttendingToggle } from './AttendingToggle/AttendingToggle'
import { BulkAttendanceButton } from './BulkAttendanceButton/BulkAttendanceButton'

type TabProperties = {
  course: Course
  onSendingCourseInformation: (success: boolean) => void
}

export const AttendingTab = ({
  course,
  onSendingCourseInformation,
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

  const isBlendedCourse = course.go1Integration
  const isOpenCourse = course.type === Course_Type_Enum.Open
  const hasCourseEnded = courseEnded(course)
  const navigate = useNavigate()
  const fetcher = useFetcher()

  const courseInProgress = courseStarted(course) && !hasCourseEnded

  const canToggleAttendance =
    acl.canGradeParticipants(course.trainers ?? []) &&
    (courseInProgress || courseEnded(course))

  const {
    data: courseParticipants,
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
    mutate: mutateParticipants,
  } = useCourseParticipants(course?.id ?? '', {
    sortBy: sortColumn,
    order,
    pagination: {
      limit: perPage,
      offset: perPage * currentPage,
    },
    alwaysShowArchived: true,
  })

  const matchMutate = useMatchMutate()

  const invalidateCache = useCallback(() => matchMutate(Matcher), [matchMutate])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
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
    [sortColumn]
  )

  const { selected, checkbox, isSelected } = useTableChecks()

  const cols = useMemo(
    () =>
      [
        checkbox.headCol(
          courseParticipants?.filter(p => !p.grade).map(p => p.id) ?? []
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
        canToggleAttendance
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
            [] as string[]
          ) ?? [],
          course
        )
          ? {
              id: 'actions',
              label: t('pages.course-participants.actions'),
              sorting: false,
            }
          : null,
      ].filter(Boolean),
    [
      t,
      isBlendedCourse,
      isOpenCourse,
      acl,
      courseParticipants,
      course,
      canToggleAttendance,
      checkbox,
    ]
  )

  const handleTransferAttendee = useCallback(
    (participant: CourseParticipant) => {
      navigate(`../transfer/${participant.id}`, { replace: true })
    },
    [navigate]
  )

  const canViewRowActions = useCallback(
    (cp: CourseParticipant) =>
      [
        !cp.profile.archived,
        acl.canManageParticipantAttendance(getParticipantOrgIds(cp), course),
      ].every(Boolean),
    [acl, course]
  )

  const sendCourseInfo = useCallback(
    async (
      courseId: SendCourseInfoParamType['courseId'],
      attendeeIds: SendCourseInfoParamType['attendeeIds']
    ) => {
      setAttendeeToResendInfo(undefined)
      try {
        const response = await fetcher<
          SendCourseInfoResponseType,
          SendCourseInfoParamType
        >(SEND_COURSE_INFO, { courseId, attendeeIds })

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
    [fetcher, onSendingCourseInformation]
  )

  const rowActions = useMemo(
    () => ({
      onTransferClick: handleTransferAttendee,
      onReplaceClick: setAttendeeToReplace,
      onCancelClick: setAttendeeToCancel,
      onResendInformationClick: setAttendeeToResendInfo,
    }),
    [handleTransferAttendee]
  )

  const isOpenTypeCourse = course.type === Course_Type_Enum.Open

  return (
    <>
      {courseParticipantsLoadingStatus === LoadingStatus.SUCCESS &&
      courseParticipants?.length ? (
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

            {canToggleAttendance ? (
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <BulkAttendanceButton
                  courseId={course.id}
                  participantIds={Array.from(selected)}
                  disabled={
                    courseEnded(course) &&
                    course.status !== Course_Status_Enum.GradeMissing
                  }
                  onSuccess={mutateParticipants}
                />
              </Box>
            ) : null}
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
                        Boolean(courseParticipant.grade)
                      )}
                      <TableCell>
                        <LinkToProfile
                          profileId={courseParticipant.profile.id}
                          isProfileArchived={courseParticipant.profile.archived}
                        >
                          {courseParticipant.profile.archived
                            ? t('common.archived-profile')
                            : courseParticipant.profile.fullName}
                        </LinkToProfile>
                      </TableCell>
                      <TableCell>
                        <LinkToProfile
                          profileId={courseParticipant.profile.id}
                          isProfileArchived={courseParticipant.profile.archived}
                        >
                          {courseParticipant.profile.email}
                          {courseParticipant.profile.contactDetails.map(
                            (contact: Scalars['jsonb']) => contact.value
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
                          )
                        )}
                      </TableCell>
                      {isBlendedCourse && (
                        <TableCell>
                          {courseParticipant.go1EnrolmentStatus && (
                            <Chip
                              label={t(
                                `blended-learning-status.${courseParticipant.go1EnrolmentStatus}`
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
                      <TableCell>
                        {courseParticipant.healthSafetyConsent
                          ? t('common.yes')
                          : t('common.no')}
                      </TableCell>
                      {canToggleAttendance ? (
                        <TableCell width={180}>
                          <AttendingToggle
                            participant={courseParticipant}
                            disabled={
                              Boolean(courseParticipant.grade) ||
                              (courseEnded(course) &&
                                course.status !==
                                  Course_Status_Enum.GradeMissing)
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
          {courseParticipantsTotal ? (
            <TablePagination
              component="div"
              count={courseParticipantsTotal}
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
          ) : null}

          {attendeeToCancel ? (
            <CancelAttendeeDialog
              variant={isOpenTypeCourse ? 'complete' : 'minimal'}
              participant={attendeeToCancel}
              course={course}
              onClose={() => setAttendeeToCancel(undefined)}
              onSave={invalidateCache}
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
              onSuccess={invalidateCache}
              mode={isOrgAdmin ? Mode.ORG_ADMIN : Mode.TT_ADMIN}
            />
          ) : null}

          {attendeeToResendInfo ? (
            <ConfirmDialog
              open={Boolean(attendeeToResendInfo)}
              title={t(
                'pages.course-participants.resend-course-info.modal.title'
              )}
              message={t(
                'pages.course-participants.resend-course-info.modal.message',
                { fullName: attendeeToResendInfo?.profile.fullName }
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
            {course?.type === Course_Type_Enum.Open
              ? t('pages.course-participants.no-attendees')
              : t('pages.course-participants.none-registered-message')}
          </Typography>
        </Box>
      )}
    </>
  )
}
