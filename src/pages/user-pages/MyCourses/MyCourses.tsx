import { CircularProgress, Container, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import {
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { AttendeeOnlyCourseStatus } from '@app/types'
import { LoadingStatus } from '@app/util'

import { UserCourseStatus, useUserCourses } from './hooks/useUserCourses'

export const MyCourses: React.FC = () => {
  const { t } = useTranslation()

  const sorting = useTableSort('name', 'asc')
  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
      { id: 'type', label: t('pages.my-courses.col-type'), sorting: true },
      { id: 'start', label: t('pages.my-courses.col-start'), sorting: true },
      { id: 'end', label: t('pages.my-courses.col-end'), sorting: true },
      {
        id: 'trainers',
        label: t('pages.my-courses.col-trainers'),
        sorting: false,
      },
      { id: 'status', label: t('pages.my-courses.col-status'), sorting: false },
    ],
    [t]
  )

  const [keyword, setKeyword] = useState('')
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])

  const [statusOptions, setStatusOptions] = useState<
    FilterOption<UserCourseStatus>[]
  >(() => {
    return [
      {
        id: AttendeeOnlyCourseStatus.InfoRequired,
        title: t(`course-statuses.${AttendeeOnlyCourseStatus.InfoRequired}`),
        selected: false,
      },
      {
        id: Course_Status_Enum.EvaluationMissing,
        title: t(`course-statuses.${Course_Status_Enum.EvaluationMissing}`),
        selected: false,
      },
      {
        id: Course_Status_Enum.Completed,
        title: t(`course-statuses.${Course_Status_Enum.Completed}`),
        selected: false,
      },
      {
        id: AttendeeOnlyCourseStatus.NotAttended,
        title: t(`course-statuses.${AttendeeOnlyCourseStatus.NotAttended}`),
        selected: false,
      },
      {
        id: Course_Status_Enum.GradeMissing,
        title: t(`course-statuses.${Course_Status_Enum.GradeMissing}`),
        selected: false,
      },
      {
        id: Course_Status_Enum.Scheduled,
        title: t(`course-statuses.${Course_Status_Enum.Scheduled}`),
        selected: false,
      },
    ]
  })

  const filterStatus = statusOptions.flatMap(o =>
    o.selected ? o.id : []
  ) as UserCourseStatus[]

  const { Pagination, perPage, currentPage } = useTablePagination()

  const { courses, status, total } = useUserCourses(
    {
      statuses: filterStatus,
      types: filterType,
      levels: filterLevel,
      keyword,
    },
    sorting,
    { perPage, currentPage }
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const count = courses?.length

  const loading = status === LoadingStatus.FETCHING

  const filtered = Boolean(
    keyword || filterStatus.length || filterType.length || filterLevel.length
  )

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('my-courses')}</Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch value={keyword} onChange={setKeyword} />

            <Box>
              <Typography variant="body2" fontWeight="bold">
                {t('filter-by')}
              </Typography>

              <Stack gap={1}>
                <FilterCourseLevel onChange={setFilterLevel} />
                <FilterCourseType onChange={setFilterType} />
                <FilterAccordion
                  options={statusOptions}
                  onChange={opts => {
                    setStatusOptions(opts)
                  }}
                  title={t('course-status')}
                  data-testid="FilterCourseStatus"
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box flex={1}>
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
                noRecords={!loading && !count}
                filtered={filtered}
                colSpan={cols.length}
                itemsName={t('courses').toLowerCase()}
              />

              {courses?.map((c, index) => (
                <TableRow
                  key={c.id}
                  className="MyCoursesRow"
                  data-testid={`course-row-${c.id}`}
                  data-index={index}
                >
                  <TableCell>
                    <Link href={`${c.id}/details`}>
                      <Typography>{t(`course-levels.${c.level}`)}</Typography>
                      <Typography variant="body2">{c.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography mb={1}>{c.schedule[0].venue?.name}</Typography>
                    <Typography variant="body2">
                      {c.schedule[0].virtualLink
                        ? 'Online'
                        : c.schedule[0].venue?.city}
                    </Typography>
                  </TableCell>
                  <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                  <TableCell>
                    {c.dates?.aggregate?.start?.date && (
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {t('dates.short', {
                            date: c.dates.aggregate.start.date,
                          })}
                        </Typography>
                        <Typography variant="body2" color="grey.500">
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
                          {t('dates.short', {
                            date: c.dates.aggregate.end.date,
                          })}
                        </Typography>
                        <Typography variant="body2" color="grey.500">
                          {t('dates.time', {
                            date: c.dates.aggregate.end.date,
                          })}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <TrainerAvatarGroup trainers={c.trainers ?? []} />
                  </TableCell>

                  <TableCell>
                    {!c.participants[0].attended &&
                    isPast(new Date(c.schedule[0].end)) ? (
                      <CourseStatusChip
                        status={AttendeeOnlyCourseStatus.NotAttended}
                      />
                    ) : !c.participants[0].healthSafetyConsent ? (
                      <CourseStatusChip
                        status={AttendeeOnlyCourseStatus.InfoRequired}
                      />
                    ) : c.evaluation_answers_aggregate.aggregate?.count === 0 &&
                      isPast(new Date(c.schedule[0].end)) ? (
                      <CourseStatusChip
                        status={Course_Status_Enum.EvaluationMissing}
                      />
                    ) : !c.participants[0].grade &&
                      isPast(new Date(c.schedule[0].end)) ? (
                      <CourseStatusChip
                        status={Course_Status_Enum.GradeMissing}
                      />
                    ) : (
                      <CourseStatusChip
                        status={
                          isPast(new Date(c.schedule[0].end))
                            ? Course_Status_Enum.Completed
                            : Course_Status_Enum.Scheduled
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              )) ?? null}
            </TableBody>
          </Table>

          {total ? <Pagination total={total} /> : null}
        </Box>
      </Box>
    </Container>
  )
}
