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
import { FilterDates } from '@app/components/FilterDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { Course_Level_Enum, Course_Status_Enum } from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import {
  AdminOnlyCourseStatus,
  AllCourseStatuses,
  AttendeeOnlyCourseStatus,
} from '@app/types'
import { LoadingStatus } from '@app/util'

import { UserCourseStatus, useUserCourses } from './hooks/useUserCourses'

export const AttendeeCourses: React.FC = () => {
  const { t } = useTranslation()

  const sorting = useTableSort('start', 'desc')
  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
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
  const [filterStartDate, setFilterStartDate] = useState<Date>()
  const [filterEndDate, setFilterEndDate] = useState<Date>()
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])

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

  const filters = useMemo(() => {
    let startDate = undefined
    let endDate = undefined
    if (filterStartDate) {
      startDate = new Date(filterStartDate)
      startDate.setHours(0, 0, 0)
    }
    if (filterEndDate) {
      endDate = new Date(filterEndDate)
      endDate.setHours(23, 59, 59)
    }
    return {
      statuses: filterStatus,
      levels: filterLevel,
      keyword,
      schedule: { start: startDate, end: endDate },
    }
  }, [filterEndDate, filterLevel, filterStartDate, filterStatus, keyword])

  const { courses, status, total } = useUserCourses(filters, sorting, {
    perPage,
    currentPage,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const count = courses?.length

  const loading = status === LoadingStatus.FETCHING

  const filtered = Boolean(keyword || filterStatus.length || filterLevel.length)

  const onDatesChange = (from?: Date, to?: Date) => {
    setFilterStartDate(from)
    setFilterEndDate(to)
  }

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
            <FilterDates onChange={onDatesChange} />

            <Box>
              <Typography variant="body2" fontWeight="bold">
                {t('filter-by')}
              </Typography>

              <Stack gap={1}>
                <FilterCourseLevel onChange={setFilterLevel} />
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

              {courses?.map((c, index) => {
                const courseEnded = isPast(new Date(c.schedule[0].end))
                const participant = c.participants[0]
                const evaluated = Boolean(
                  c.evaluation_answers_aggregate.aggregate?.count
                )

                let courseStatus: AllCourseStatuses =
                  Course_Status_Enum.Scheduled
                if (c.status === Course_Status_Enum.Cancelled) {
                  courseStatus = Course_Status_Enum.Cancelled
                } else if (c.cancellationRequest) {
                  courseStatus = AdminOnlyCourseStatus.CancellationRequested
                } else {
                  if (courseEnded) {
                    courseStatus = Course_Status_Enum.Completed
                  }
                  if (participant) {
                    // user participated in the course
                    if (!participant.attended && courseEnded) {
                      courseStatus = AttendeeOnlyCourseStatus.NotAttended
                    } else if (!participant.healthSafetyConsent) {
                      courseStatus = AttendeeOnlyCourseStatus.InfoRequired
                    } else if (!evaluated && courseEnded) {
                      courseStatus = Course_Status_Enum.EvaluationMissing
                    } else if (!participant.grade && courseEnded) {
                      courseStatus = Course_Status_Enum.GradeMissing
                    }
                  }
                }

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
                      <Typography mb={1}>
                        {c.schedule[0].venue?.name}
                      </Typography>
                      <Typography variant="body2">
                        {c.schedule[0].virtualLink
                          ? 'Online'
                          : c.schedule[0].venue?.city}
                      </Typography>
                    </TableCell>
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
                            color="grey.500"
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
                            color="grey.500"
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
                      <TrainerAvatarGroup trainers={c.trainers ?? []} />
                    </TableCell>
                    <TableCell>
                      <CourseStatusChip status={courseStatus} />
                    </TableCell>
                  </TableRow>
                )
              }) ?? null}
            </TableBody>
          </Table>

          {total ? <Pagination total={total} /> : null}
        </Box>
      </Box>
    </Container>
  )
}
