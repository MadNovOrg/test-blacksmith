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
import { ParticipantsCount } from '@app/components/ParticipantsCount'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { Course_Status_Enum, UserCoursesQuery } from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { Cols } from '@app/pages/trainer-pages/MyCourses/components/CoursesTable'

export type CoursesTableProps = {
  additionalColumns?: Set<Extract<Cols, 'type' | 'registrants'>>
  courses: UserCoursesQuery['courses']
  sorting: ReturnType<typeof useTableSort>
  paginationComponent?: React.ReactNode
  loading?: boolean
  filtered?: boolean
}

export const CoursesTable: React.FC<
  React.PropsWithChildren<CoursesTableProps>
> = ({
  courses,
  sorting,
  loading,
  filtered,
  paginationComponent,
  additionalColumns,
}) => {
  const { t } = useTranslation()

  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
      ...(additionalColumns?.has('type')
        ? [
            {
              id: 'type',
              label: t('pages.my-courses.col-type'),
              sorting: false,
            },
          ]
        : []),
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
      ...(additionalColumns?.has('registrants')
        ? [
            {
              id: 'registrants',
              label: t('pages.my-courses.col-registrations'),
              sorting: false,
            },
          ]
        : []),
      { id: 'status', label: t('pages.my-courses.col-status'), sorting: false },
    ],

    [additionalColumns, t]
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

          {courses?.map((c, index) => {
            const nameCell = (
              <>
                <Typography mb={1}>{c.name}</Typography>
                <Typography variant="body2" data-testid="course-code">
                  {c.course_code}
                </Typography>
              </>
            )

            return (
              <TableRow
                key={c.id}
                className="MyCoursesRow"
                data-testid={`course-row-${c.id}`}
                data-index={index}
              >
                <TableCell>
                  {c.status !== Course_Status_Enum.Cancelled ? (
                    <Link href={`${c.id}/details`}>{nameCell}</Link>
                  ) : (
                    nameCell
                  )}
                </TableCell>
                <TableCell>
                  <Typography mb={1}>{c.schedule[0].venue?.name}</Typography>
                  <Typography variant="body2">
                    {!c.schedule[0].venue?.id
                      ? 'Online'
                      : c.schedule[0].venue?.city}
                  </Typography>
                </TableCell>
                {additionalColumns?.has('type') ? (
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                      {t(`course-types.${c.type}`)}
                    </Typography>
                  </TableCell>
                ) : null}
                <TableCell>
                  {c.dates?.aggregate?.start?.date && (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {t('dates.defaultShort', {
                          date: c.dates.aggregate.start.date,
                        })}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="grey.600"
                        whiteSpace="nowrap"
                      >
                        {t('dates.time', {
                          date: c.dates.aggregate.start.date,
                        })}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {c.dates?.aggregate?.end?.date && (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {t('dates.defaultShort', {
                          date: c.dates.aggregate.end.date,
                        })}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="grey.600"
                        whiteSpace="nowrap"
                      >
                        {t('dates.time', {
                          date: c.dates.aggregate.end.date,
                        })}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {c.createdAt && (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {t('dates.defaultShort', {
                          date: c.createdAt,
                        })}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="grey.600"
                        whiteSpace="nowrap"
                      >
                        {t('dates.time', {
                          date: c.createdAt,
                        })}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <TrainerAvatarGroup trainers={c.trainers ?? []} />
                </TableCell>
                {additionalColumns?.has('registrants') ? (
                  <TableCell data-testid="participants-cell">
                    <ParticipantsCount
                      participating={c.participantsAgg?.aggregate?.count ?? 0}
                      capacity={c.max_participants}
                      waitlist={c.waitlistAgg?.aggregate?.count}
                    />
                  </TableCell>
                ) : null}
                <TableCell>
                  <AttendeeCourseStatus course={c} />
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
