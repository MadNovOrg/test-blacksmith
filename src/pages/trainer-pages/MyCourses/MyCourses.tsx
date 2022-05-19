import { Button, CircularProgress, Container, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'

import { CreateCourseMenu } from '@app/components/CreateCourseMenu'
import type { FilterOption } from '@app/components/FilterAccordion'
import { FilterAccordion } from '@app/components/FilterAccordion'
import { FilterSearch } from '@app/components/FilterSearch'
import { StatusChip, StatusChipType } from '@app/components/StatusChip'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  ParamsType as GetMyCourseParamsType,
  QUERY as GetMyCourses,
  ResponseType as GetMyCoursesResponseType,
} from '@app/queries/courses/get-trainer-courses'
import {
  Course,
  CourseLevel,
  CourseStatus,
  CourseType,
  InviteStatus,
  SortOrder,
  CourseTrainerType,
  RoleName,
} from '@app/types'
import { findCourseTrainer } from '@app/util'

import { AcceptDeclineCourse, AcceptDeclineProps } from './AcceptDeclineCourse'

type MyCoursesProps = unknown

const CourseTitle: React.FC<{ name: string; level: CourseLevel }> = ({
  name,
  level,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        {t(`course-levels.${level}`)}
      </Typography>
      <Typography variant="body2">{name}</Typography>
    </>
  )
}

const sorts: Record<string, object> = {
  'name-asc': { name: 'asc' },
  'name-desc': { name: 'desc' },
  'org-asc': { organization: { name: 'asc' } },
  'org-desc': { organization: { name: 'desc' } },
  'type-asc': { name: 'asc' },
  'type-desc': { type: 'desc' },
  'start-asc': { schedule_aggregate: { min: { start: 'asc' } } },
  'start-desc': { schedule_aggregate: { min: { start: 'desc' } } },
  'end-asc': { schedule_aggregate: { min: { end: 'asc' } } },
  'end-desc': { schedule_aggregate: { min: { end: 'desc' } } },
}

export const MyCourses: React.FC<MyCoursesProps> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { profile, activeRole } = useAuth()
  const isTrainer = activeRole === RoleName.TRAINER

  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name') },
      { id: 'org', label: t('pages.my-courses.col-organization') },
      { id: 'type', label: t('pages.my-courses.col-type') },
      { id: 'start', label: t('pages.my-courses.col-start') },
      { id: 'end', label: t('pages.my-courses.col-end') },
      { id: 'status', label: t('pages.my-courses.col-status'), sorting: false },
      { id: 'empty', label: '', sorting: false },
    ],
    [t]
  )

  const levelOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseLevel).map<FilterOption>(level => ({
      id: level,
      title: t(`course-levels.${level}`),
      selected: false,
    }))
  }, [t])

  const typeOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseType).map<FilterOption>(type => ({
      id: type,
      title: t(`course-types.${type}`),
      selected: false,
    }))
  }, [t])

  const statusOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseStatus).map<FilterOption>(s => ({
      id: s,
      title: t(`course-statuses.${s}`),
      selected: false,
    }))
  }, [t])

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')

  const [levelFilter, setLevelFilter] = useState<FilterOption[]>(levelOptions)
  const [typeFilter, setTypeFilter] = useState<FilterOption[]>(typeOptions)
  const [statusFilter, setStatusFilter] =
    useState<FilterOption[]>(statusOptions)

  const [order, setOrder] = useState<SortOrder>('asc')
  const [orderBy, setOrderBy] = useState(cols[0].id)

  const where = useMemo(() => {
    const obj: Record<string, object> = {}

    const selectedLevels = levelFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    if (selectedLevels.length) {
      obj.level = { _in: selectedLevels }
    }

    const selectedTypes = typeFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    if (selectedTypes.length) {
      obj.type = { _in: selectedTypes }
    }

    const selectedStatuses = statusFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    if (selectedStatuses.length) {
      obj.status = { _in: selectedStatuses }
    }

    const query = keyword.trim()
    if (query.length) {
      const onlyDigits = /^\d+$/.test(query)
      if (onlyDigits) {
        obj.id = { _eq: Number(query) }
      } else {
        obj.name = { _ilike: `%${query}%` }
      }
    }

    return obj
  }, [levelFilter, typeFilter, statusFilter, keyword])

  const { data, error, mutate } = useSWR<
    GetMyCoursesResponseType,
    Error,
    [string, GetMyCourseParamsType]
  >([GetMyCourses, { orderBy: sorts[`${orderBy}-${order}`], where }], {
    focusThrottleInterval: 2000,
  })

  const handleRequestSort = (col: string) => {
    const isAsc = orderBy === col && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(col)
  }

  const handleNavigation = (course: Course) => {
    if (
      course.status === CourseStatus.DRAFT ||
      course.status === CourseStatus.PENDING
    ) {
      return `${course.id}/modules`
    }
    return `${course.id}/details`
  }

  const onAcceptedOrDeclined = useCallback<AcceptDeclineProps['onUpdate']>(
    (course, trainer, status) => {
      const isLead = trainer.type === CourseTrainerType.LEADER
      const isAccepted = status === InviteStatus.ACCEPTED
      setKeyword('')
      isLead && isAccepted ? navigate(handleNavigation(course)) : mutate()
    },
    [mutate, navigate]
  )

  const loading = !data && !error
  const count = data?.course?.length

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">
            {t(isTrainer ? 'my-courses' : 'pages.my-courses.h1')}
          </Typography>
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
                <FilterAccordion
                  options={levelFilter}
                  title={t('level')}
                  onChange={setLevelFilter}
                />

                <FilterAccordion
                  options={typeFilter}
                  title={t('course-type')}
                  onChange={setTypeFilter}
                />

                <FilterAccordion
                  options={statusFilter}
                  title={t('course-status')}
                  onChange={setStatusFilter}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box flex={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box></Box>
            <CreateCourseMenu />
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table data-testid="courses-table">
              <TableHead
                cols={cols}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {data?.course?.map(c => {
                  const courseTrainer = profile
                    ? findCourseTrainer(c?.trainers, profile.id)
                    : undefined

                  return (
                    <TableRow key={c.id} data-testid={`course-row-${c.id}`}>
                      <TableCell>
                        {courseTrainer &&
                        courseTrainer.status !== InviteStatus.ACCEPTED ? (
                          <CourseTitle level={c.level} name={c.name} />
                        ) : (
                          <Link href={handleNavigation(c)}>
                            <CourseTitle level={c.level} name={c.name} />
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>{c.organization?.name}</TableCell>
                      <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                      <TableCell>
                        {c.dates.aggregate.start.date && (
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              {t('dates.short', {
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
                        {c.dates.aggregate.end.date && (
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              {t('dates.short', {
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
                        <StatusChip
                          status={c.status}
                          type={StatusChipType.COURSE}
                          data-testid="course-status-chip"
                        />
                      </TableCell>
                      <TableCell>
                        <AcceptDeclineCourse
                          course={c}
                          onUpdate={onAcceptedOrDeclined}
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => navigate(handleNavigation(c))}
                          >
                            {c.status === CourseStatus.PENDING ||
                            c.status === CourseStatus.DRAFT
                              ? t('build')
                              : t('manage')}
                          </Button>
                        </AcceptDeclineCourse>
                      </TableCell>
                    </TableRow>
                  )
                }) ??
                  (loading && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  )
}
