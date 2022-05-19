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
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import type { FilterOption } from '@app/components/FilterAccordion'
import { FilterAccordion } from '@app/components/FilterAccordion'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
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
      { id: 'name', label: t('pages.my-courses.col-name') },
      { id: 'type', label: t('pages.my-courses.col-type') },
      { id: 'start', label: t('pages.my-courses.col-start') },
      { id: 'end', label: t('pages.my-courses.col-end') },
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

  const { profile } = useAuth()

  const where = useMemo(() => {
    const obj: Record<string, object> = {
      participants: {
        profile_id: { _eq: profile?.id },
      },
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

    const query = keyword.trim()
    if (query.length) {
      obj.name = { _ilike: `%${query}%` }
    }

    return obj
  }, [levelFilter, typeFilter, keyword, profile?.id])

  const { data, error } = useSWR<
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

  const loading = !data && !error
  const count = data?.course?.length

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
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box flex={1}>
          <TableContainer component={Paper} elevation={0}>
            <Table data-testid="courses-table">
              <TableHead
                cols={cols}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                sx={{ '& .MuiTableRow-root': { backgroundColor: 'grey.300' } }}
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
