import { Button, CircularProgress, Container } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'

import type { FilterOption } from '@app/components/FilterAccordion'
import { FilterAccordion } from '@app/components/FilterAccordion'
import { TableHead } from '@app/components/Table/TableHead'
import {
  ParamsType as GetMyCourseParamsType,
  QUERY as GetMyCourses,
  ResponseType as GetMyCoursesResponseType,
} from '@app/queries/user-queries/get-user-courses'
import { CourseLevel, CourseType, SortOrder } from '@app/types'

type MyCoursesProps = unknown

const sorts: Record<string, object> = {
  'name-asc': { name: 'asc' },
  'name-desc': { name: 'desc' },
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

  const cols = useMemo(
    () => [
      { id: 'name', label: t('course-name') },
      { id: 'type', label: t('course-type') },
      { id: 'start', label: t('start') },
      { id: 'end', label: t('end') },
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

  const [keyword, setKeyword] = useState('')

  const [levelFilter, setLevelFilter] = useState<FilterOption[]>(levelOptions)
  const [typeFilter, setTypeFilter] = useState<FilterOption[]>(typeOptions)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [orderBy, setOrderBy] = useState(cols[0].id)
  const [keywordDebounced] = useDebounce(keyword, 300)

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

    if (keywordDebounced.trim().length) {
      obj.name = { _ilike: `%${keywordDebounced}%` }
    }

    return obj
  }, [levelFilter, typeFilter, keywordDebounced])

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
          </Box>
        </Box>

        <Box flex={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5">{t('my-courses')}</Typography>
              <Typography variant="subtitle2">
                {t('x-items', { num: data?.course?.length })}
              </Typography>
            </Box>
          </Box>

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
                      <Link href={`${c.id}/details`}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t(`course-levels.${c.level}`)}
                        </Typography>
                        <Typography variant="body2">{c.name}</Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                    <TableCell>
                      {c.dates.aggregate.start.date && (
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
                      {c.dates.aggregate.end.date && (
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
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`${c.id}/details`)}
                      >
                        {t('view')}
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
