import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AttendeeCourseStatus } from '@app/components/AttendeeCourseStatus/AttendeeCourseStatus'
import { DateCell } from '@app/components/DateCell/DateCell'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import { ParticipantsCount } from '@app/components/ParticipantsCount'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum as CourseStatuses,
  Course_Type_Enum,
  UserCoursesQuery,
} from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'

export type CoursesTableProps = {
  courses: UserCoursesQuery['courses']
  sorting: ReturnType<typeof useTableSort>
  paginationComponent?: React.ReactNode
  loading?: boolean
  filtered?: boolean
  isManaging?: boolean
}

export const CoursesTable: React.FC<
  React.PropsWithChildren<CoursesTableProps>
> = ({
  courses,
  sorting,
  loading,
  filtered,
  paginationComponent,
  isManaging = false,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
      {
        id: 'type',
        label: t('pages.my-courses.col-type'),
        sorting: false,
      },
      { id: 'start', label: t('pages.my-courses.col-start'), sorting: true },
      { id: 'end', label: t('pages.my-courses.col-end'), sorting: true },
      {
        id: 'createdAt',
        label: t('pages.my-courses.col-created'),
        sorting: true,
      },
      {
        id: 'trainers',
        label: t('pages.my-courses.col-trainers'),
        sorting: false,
      },
      {
        id: 'registrants',
        label: t('pages.my-courses.col-registrations'),
        sorting: false,
      },
      { id: 'status', label: t('pages.my-courses.col-status'), sorting: false },
    ],

    [t]
  )

  return (
    <Box flex={1} sx={{ overflowX: 'auto' }}>
      <Table data-testid="courses-table">
        <TableHead
          cols={cols}
          order={sorting.dir}
          orderBy={sorting.by}
          onRequestSort={sorting.onSort}
        />
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={cols.length} align="center">
                <CircularProgress data-testid="fetching-courses" />
              </TableCell>
            </TableRow>
          )}

          <TableNoRows
            noRecords={!loading && !courses.length}
            filtered={filtered}
            colSpan={cols.length}
            itemsName={t('courses').toLowerCase()}
          />

          {courses?.map((course, index) => {
            const nameCell = (
              <>
                <Typography mb={1}>{course.name}</Typography>
                <Typography variant="body2" data-testid="course-code">
                  {course.course_code}
                </Typography>
              </>
            )

            return (
              <TableRow
                key={course.id}
                className="MyCoursesRow"
                data-testid={`course-row-${course.id}`}
                data-index={index}
              >
                <TableCell>
                  {course.status !== CourseStatuses.Cancelled &&
                  course.schedule?.length > 0 ? (
                    <Link href={`${course.id}/details`}>{nameCell}</Link>
                  ) : (
                    nameCell
                  )}
                </TableCell>
                <TableCell>
                  <Typography mb={1}>
                    {course.schedule?.length > 0 && course.schedule[0].venue
                      ? course.schedule[0].venue?.name
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    {course.schedule?.length > 0 && course.schedule[0].venue?.id
                      ? course.schedule[0].venue?.city
                      : 'Online'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'inherit' }}>
                    {t(`course-types.${course.type}`)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {course?.schedule[0]?.start && (
                    <DateCell
                      date={course.schedule[0].start}
                      timeZone={course.schedule[0].timeZone}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {course?.schedule[0]?.end && (
                    <DateCell
                      date={course.schedule[0].end}
                      timeZone={course.schedule[0].timeZone}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {course.createdAt && (
                    <DateCell
                      date={course.createdAt}
                      timeZone={course.schedule[0].timeZone}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <TrainerAvatarGroup trainers={course.trainers ?? []} />
                </TableCell>
                <TableCell data-testid="participants-cell">
                  {/* For booking contact user display only the number of participants the booking contact has access to */}
                  {acl.isBookingContact() &&
                  isManaging &&
                  course.type === Course_Type_Enum.Open ? (
                    <Typography component="span">
                      {course.courseParticipants.length}
                    </Typography>
                  ) : (
                    <ParticipantsCount
                      participating={
                        (acl.isBookingContact() || acl.isOrgKeyContact()) &&
                        isManaging
                          ? course.courseParticipants.length
                          : course.participantsAgg?.aggregate?.count ?? 0
                      }
                      capacity={course.max_participants}
                      waitlist={course.waitlistAgg?.aggregate?.count}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isManaging && !acl.isUser() ? (
                    <IndividualCourseStatusChip
                      course={course}
                      participants={course.courseParticipants ?? []}
                    />
                  ) : (
                    <AttendeeCourseStatus course={course} />
                  )}
                </TableCell>
              </TableRow>
            )
          }) ?? null}
        </TableBody>
      </Table>

      {paginationComponent}
    </Box>
  )
}
