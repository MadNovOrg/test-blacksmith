import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import { ParticipantsCount } from '@app/components/ParticipantsCount'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  TrainerCoursesQuery,
} from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { AdminOnlyCourseStatus, RoleName } from '@app/types'
import { findCourseTrainer } from '@app/util'

type Props = {
  courses: TrainerCoursesQuery['courses']
  sorting?: ReturnType<typeof useTableSort>
  isFiltered?: boolean
  loading?: boolean
  hiddenColumns?: Set<Cols>
  renderRow?: (course: TableCourse, index?: number) => React.ReactElement
}

export const CoursesTable: React.FC<React.PropsWithChildren<Props>> = ({
  courses,
  sorting,
  isFiltered = false,
  loading = false,
  hiddenColumns = new Set<Cols>(),
  renderRow,
  ...props
}) => {
  const { t } = useTranslation()

  const cols = useMemo(() => {
    const columns: ColHead[] = [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
      { id: 'type', label: t('pages.my-courses.col-type'), sorting: true },
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
        align: 'center',
      },
      {
        id: 'registrants',
        label: t('pages.my-courses.col-registrations'),
        sorting: false,
      },
      { id: 'status', label: t('pages.my-courses.col-status') },
      { id: 'actions', label: '' },
    ]

    return columns.filter(col => !hiddenColumns.has(col.id))
  }, [t, hiddenColumns])

  return (
    <Table {...props}>
      <TableHead
        cols={cols}
        order={sorting?.dir}
        orderBy={sorting?.by}
        onRequestSort={sorting?.onSort}
      />
      <TableBody>
        <TableNoRows
          noRecords={!loading && !courses.length}
          filtered={isFiltered}
          colSpan={cols.length}
          itemsName={t('courses').toLowerCase()}
        />

        {courses.map((c, index) => {
          return typeof renderRow === 'function' ? (
            renderRow(c, index)
          ) : (
            <TableRow
              key={c.id}
              className="MyCoursesRow"
              data-testid={`course-row-${c.id}`}
              data-index={index}
            >
              {!hiddenColumns.has('name') ? (
                <CourseTitleCell course={c} />
              ) : null}
              {!hiddenColumns.has('venue') ? <VenueCell course={c} /> : null}
              {!hiddenColumns.has('type') ? <TypeCell course={c} /> : null}
              {!hiddenColumns.has('start') ? (
                <DateCell date={c.dates?.aggregate?.start?.date} />
              ) : null}
              {!hiddenColumns.has('end') ? (
                <DateCell date={c.dates?.aggregate?.end?.date} />
              ) : null}
              {!hiddenColumns.has('createdAt') ? (
                <DateCell date={c.createdAt} />
              ) : null}
              {!hiddenColumns.has('trainers') ? (
                <TableCell>
                  <TrainerAvatarGroup trainers={c.trainers} />
                </TableCell>
              ) : null}
              {!hiddenColumns.has('registrants') ? (
                <TableCell data-testid="participants-cell">
                  <ParticipantsCount
                    participating={c.participantsAgg?.aggregate?.count ?? 0}
                    capacity={c.max_participants}
                    waitlist={c.waitlistAgg?.aggregate?.count}
                  />
                </TableCell>
              ) : null}
              {!hiddenColumns.has('status') ? <StatusCell course={c} /> : null}
            </TableRow>
          )
        }) ?? null}
      </TableBody>
    </Table>
  )
}

export function CourseTitle({
  name,
  code,
}: {
  name: string
  code: string | null | undefined
}) {
  return (
    <>
      <Typography mb={1} data-testid="course-title">
        {name}
      </Typography>
      <Typography variant="body2" data-testid="course-code">
        {code}
      </Typography>
    </>
  )
}

export function CourseTitleCell({ course }: { course: TableCourse }) {
  const { profile, acl, activeRole } = useAuth()

  const courseTrainer =
    profile && activeRole === RoleName.TRAINER
      ? findCourseTrainer(course?.trainers, profile.id)
      : undefined

  const courseHasModules =
    (course.modulesAgg.aggregate?.count &&
      course.modulesAgg.aggregate?.count > 0) ||
    course.bildModules.length ||
    course.curriculum?.length

  const titleLink =
    (course.isDraft || !courseHasModules) && acl.canBuildCourse()
      ? `${course.id}/modules`
      : `${course.id}/details`

  return (
    <TableCell data-testid="course-name-cell">
      {courseTrainer &&
      courseTrainer.status === Course_Invite_Status_Enum.Pending ? (
        <CourseTitle code={course.course_code} name={course.name} />
      ) : (
        <>
          <Link href={titleLink}>
            <CourseTitle code={course.course_code} name={course.name} />
          </Link>
        </>
      )}
      {/* TODO: Delete this after Arlo migration */}
      {course.arloReferenceId && acl.isInternalUser() ? (
        <>
          <Typography variant="body2" data-testid="course-code">
            Arlo reference:
          </Typography>
          <Typography
            variant="body2"
            data-testid="course-code"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '150px',
            }}
          >
            {course.arloReferenceId}
          </Typography>
        </>
      ) : null}
    </TableCell>
  )
}

export function VenueCell({ course }: { course: TableCourse }) {
  return (
    <TableCell>
      <Typography mb={1}>{course.schedule[0]?.venue?.name}</Typography>
      <Typography variant="body2">
        {!course.schedule[0]?.venue?.id
          ? 'Online'
          : course.schedule[0]?.venue?.city}
      </Typography>
    </TableCell>
  )
}

function TypeCell({ course }: { course: TableCourse }) {
  const { t } = useTranslation()

  return (
    <TableCell>
      <Typography
        variant="body2"
        sx={{ color: 'inherit' }}
        gutterBottom={course.go1Integration}
      >
        {t(`course-types.${course.type}`)}
      </Typography>
      {course.go1Integration ? (
        <Typography variant="body2" color="grey.600">
          {t('common.blended-learning')}
        </Typography>
      ) : (
        ''
      )}
    </TableCell>
  )
}

export function DateCell({ date }: { date: Date }) {
  const { t } = useTranslation()

  return (
    <TableCell>
      {date && (
        <Box>
          <Typography variant="body2" gutterBottom>
            {t('dates.defaultShort', {
              date: date,
            })}
          </Typography>
          <Typography variant="body2" whiteSpace="nowrap">
            {t('dates.time', {
              date: date,
            })}
          </Typography>
        </Box>
      )}
    </TableCell>
  )
}

export function StatusCell({ course }: { course: TableCourse }) {
  const { acl } = useAuth()

  return (
    <TableCell>
      {course.status ? (
        acl.isOrgAdmin() ? (
          <IndividualCourseStatusChip
            course={course}
            participants={course.courseParticipants ?? []}
          />
        ) : (
          <CourseStatusChip
            status={
              course.cancellationRequest
                ? AdminOnlyCourseStatus.CancellationRequested
                : course.status
            }
          />
        )
      ) : null}
    </TableCell>
  )
}

export type Cols =
  | 'name'
  | 'venue'
  | 'type'
  | 'start'
  | 'end'
  | 'createdAt'
  | 'trainers'
  | 'registrants'
  | 'status'
  | 'orders'
  | 'actions'

export type ColHead = {
  id: Cols
  label: string
  sorting?: boolean
  align?: TableCellProps['align']
}

export type TableCourse = TrainerCoursesQuery['courses'][0]
