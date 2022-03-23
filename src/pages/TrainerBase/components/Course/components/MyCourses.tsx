import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Chip, CircularProgress, Container } from '@mui/material'
import { useDebounce } from 'use-debounce'
import { useNavigate } from 'react-router-dom'

import { FilterAccordion } from '@app/components/FilterAccordion'
import type { FilterOption } from '@app/components/FilterAccordion'
import { TableHead } from '@app/components/Table/TableHead'

import { useAuth } from '@app/context/auth'

import {
  QUERY as GetMyCourses,
  ResponseType as GetMyCoursesResponseType,
  ParamsType as GetMyCourseParamsType,
} from '@app/queries/courses/get-courses'
import { CourseLevel, CourseStatus, CourseType, SortOrder } from '@app/types'

type MyCoursesProps = unknown

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
  const { profile } = useAuth()

  const cols = useMemo(
    () => [
      { id: 'name', label: t('course-name') },
      { id: 'org', label: t('organization') },
      { id: 'type', label: t('course-type') },
      { id: 'start', label: t('start') },
      { id: 'end', label: t('end') },
      { id: 'status', label: t('status'), sorting: false },
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

  const [keyword, setKeyword] = useState('')

  const [levelFilter, setLevelFilter] = useState<FilterOption[]>(levelOptions)
  const [typeFilter, setTypeFilter] = useState<FilterOption[]>(typeOptions)
  const [statusFilter, setStatusFilter] =
    useState<FilterOption[]>(statusOptions)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [orderBy, setOrderBy] = useState(cols[0].id)
  const [keywordDebounced] = useDebounce(keyword, 300)

  const where = useMemo(() => {
    const obj: Record<string, object> = {
      _or: [
        { trainer_profile_id: { _eq: profile?.id } },
        { leaders: { profile_id: { _eq: profile?.id } } },
      ],
    }

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

    if (keywordDebounced.trim().length) {
      obj.name = { _ilike: `%${keywordDebounced}%` }
    }

    return obj
  }, [profile, levelFilter, typeFilter, statusFilter, keywordDebounced])

  const { data, error } = useSWR<
    GetMyCoursesResponseType,
    Error,
    [string, GetMyCourseParamsType]
  >([GetMyCourses, { orderBy: sorts[`${orderBy}-${order}`], where }], {
    focusThrottleInterval: 2000,
  })

  const loading = !data && !error

  const handleRequestSort = (col: string) => {
    const isAsc = orderBy === col && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(col)
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box display="flex">
        <Box width={250} display="flex" flexDirection="column" pr={4}>
          <Box display="flex" mb={6}>
            <Button
              variant="text"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
          </Box>
          <Typography variant="body2">{t('filter-by')}</Typography>

          <Box display="flex" flexDirection="column">
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
          </Box>
        </Box>

        <Box flex={1}>
          <Typography variant="h5">{t('my-courses')}</Typography>
          <Typography variant="subtitle2">
            {t('x-items', { num: data?.course?.length })}
          </Typography>

          <Box mt={4}>
            <TextField
              hiddenLabel
              value={keyword}
              variant="filled"
              size="small"
              placeholder={t('search')}
              data-testid="search"
              onChange={e => setKeyword(e.target.value)}
            />
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} data-testid="courses-table">
              <TableHead
                cols={cols}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {data?.course?.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`${c.id}/modules`}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t(`course-levels.${c.level}`)}
                        </Typography>
                        <Typography variant="body2">{c.name}</Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{c.organization?.name}</TableCell>
                    <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                    <TableCell>
                      {c.dates.aggregate.start.date && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {format(
                              new Date(c.dates.aggregate.start.date),
                              'dd MMM'
                            )}
                          </Typography>
                          <Typography variant="body2" color="grey.500">
                            {format(
                              new Date(c.dates.aggregate.start.date),
                              'hh:mm aa'
                            )}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.dates.aggregate.end.date && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {format(
                              new Date(c.dates.aggregate.end.date),
                              'dd MMM'
                            )}
                          </Typography>
                          <Typography variant="body2" color="grey.500">
                            {format(
                              new Date(c.dates.aggregate.end.date),
                              'hh:mm aa'
                            )}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {/* TODO: finalize color */}
                      <Chip
                        label={t(`course-statuses.${c.status}`)}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                          navigate(
                            c.status === CourseStatus.PENDING ||
                              c.status === CourseStatus.DRAFT
                              ? `${c.id}/modules`
                              : `${c.id}/details`
                          )
                        }
                      >
                        {c.status === CourseStatus.PENDING ||
                        c.status === CourseStatus.DRAFT
                          ? t('build')
                          : t('manage')}
                      </Button>
                    </TableCell>
                  </TableRow>
                )) ??
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
