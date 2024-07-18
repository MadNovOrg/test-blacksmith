import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DateCell } from '@app/components/DateCell/DateCell'
import { ParticipantsCount } from '@app/components/ParticipantsCount'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { TrainerCoursesQuery } from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { ColHead, Cols, TableCourse } from '@app/modules/trainer_courses/utils'

import {
  TypeCell,
  CourseTitleCell,
  VenueCell,
  StatusCell,
} from '../../components'

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

        {courses.map((course, index) => {
          const timeZone = course?.schedule[0]?.timeZone ?? 'Europe/London'

          if (renderRow) return renderRow(course, index)

          return (
            <TableRow
              key={course.id}
              className="MyCoursesRow"
              data-testid={`course-row-${course.id}`}
              data-index={index}
            >
              {!hiddenColumns.has('name') && (
                <CourseTitleCell course={course} />
              )}
              {!hiddenColumns.has('venue') && <VenueCell course={course} />}
              {!hiddenColumns.has('type') && <TypeCell course={course} />}
              {!hiddenColumns.has('start') && (
                <DateCell
                  date={course?.schedule[0]?.start}
                  timeZone={timeZone}
                />
              )}
              {!hiddenColumns.has('end') && (
                <DateCell date={course?.schedule[0]?.end} timeZone={timeZone} />
              )}
              {!hiddenColumns.has('createdAt') && (
                <DateCell date={course.createdAt} timeZone={timeZone} />
              )}
              {!hiddenColumns.has('trainers') && (
                <TableCell>
                  <TrainerAvatarGroup trainers={course.trainers} />
                </TableCell>
              )}
              {!hiddenColumns.has('registrants') && (
                <TableCell data-testid="participants-cell">
                  <ParticipantsCount
                    participating={
                      course.participantsAgg?.aggregate?.count ?? 0
                    }
                    capacity={course.max_participants}
                    waitlist={course.waitlistAgg?.aggregate?.count}
                  />
                </TableCell>
              )}
              {!hiddenColumns.has('status') && <StatusCell course={course} />}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
