import {
  Box,
  Table,
  TableBody,
  TablePagination,
  Typography,
} from '@mui/material'
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { ConfirmDialog } from '@app/components/dialogs'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  Course_Type_Enum,
  SendCourseInformationMutation,
  SendCourseInformationMutationVariables,
} from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import { CourseDetailsFilters } from '@app/modules/course/components/CourseForm/components/CourseDetailsFilters'
import { CancelAttendeeDialog } from '@app/modules/course_details/course_attendees_tab/components/CancelAttendeeDialog'
import {
  Mode,
  ReplaceParticipantDialog,
} from '@app/modules/course_details/course_attendees_tab/components/ReplaceParticipantDialog'
import { MUTATION as SEND_COURSE_INFO } from '@app/modules/course_details/course_attendees_tab/queries/send-course-information'
import useCourseParticipants from '@app/modules/course_details/hooks/course-participant/useCourseParticipants'
import { Course, SortOrder } from '@app/types'
import {
  courseStarted,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
  getParticipantOrgIds,
  LoadingStatus,
} from '@app/util'

import { BulkAttendanceButton } from '../BulkAttendanceButton/BulkAttendanceButton'

import {
  ManageParticipantActionsProvider,
  useManageParticipantActions,
} from './context/manageParticipantActions'
import { useCanViewRowActions } from './hooks'
import { ParticipantRow } from './ParticipantRow'
import { getAttendanceDisabled } from './utils'

type TabProperties = {
  course: Course
  onSendingCourseInformation: (success: boolean) => void
  updateAttendeesHandler: () => void
}

const Tab = ({
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

  const {
    attendeeToReplace,
    attendeeToCancel,
    attendeeToResendInfo,
    setAttendeeToCancel,
    setAttendeeToReplace,
    setAttendeeToResendInfo,
  } = useManageParticipantActions()

  const [where, setWhere] = useState<Record<string, object>>({})
  const handleWhereConditionChange = (
    whereCondition: Record<string, object>,
  ) => {
    setWhere(whereCondition)
  }

  const isBlendedCourse = course.go1Integration
  const isOpenCourse = course.type === Course_Type_Enum.Open

  const [, sendCourseInfoMutation] = useMutation<
    SendCourseInformationMutation,
    SendCourseInformationMutationVariables
  >(SEND_COURSE_INFO)

  const trainers = course.trainers || []

  const canToggleAttendance =
    acl.canGradeParticipants(trainers) && courseStarted(course)

  const isAttendanceDisabled = getAttendanceDisabled(course.status)

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

  const canViewRowActions = useCanViewRowActions(course)
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
    [
      onSendingCourseInformation,
      sendCourseInfoMutation,
      setAttendeeToResendInfo,
    ],
  )

  const isOpenTypeCourse = course.type === Course_Type_Enum.Open

  const AttendeeActions = () => {
    if (attendeeToCancel) {
      return (
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
      )
    }
    if (attendeeToReplace) {
      return (
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
      )
    }
    if (attendeeToResendInfo) {
      return (
        <ConfirmDialog
          open={Boolean(attendeeToResendInfo)}
          title={t('pages.course-participants.resend-course-info.modal.title')}
          message={t(
            'pages.course-participants.resend-course-info.modal.message',
            { fullName: attendeeToResendInfo?.profile.fullName },
          )}
          onCancel={() => setAttendeeToResendInfo(undefined)}
          onOk={() => sendCourseInfo(course.id, [attendeeToResendInfo?.id])}
        />
      )
    }
  }

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
                  {courseParticipants?.map(courseParticipant => (
                    <ParticipantRow
                      key={courseParticipant.id}
                      participant={courseParticipant}
                      checkbox={checkbox}
                      isSelected={isSelected}
                      course={course}
                    />
                  ))}
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
          <AttendeeActions />
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

export const AttendingTab: FC<TabProperties> = props => {
  return (
    <ManageParticipantActionsProvider>
      <Tab {...props} />
    </ManageParticipantActionsProvider>
  )
}
