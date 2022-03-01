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
import { Button, Chip } from '@mui/material'

import { FilterAccordion } from '@app/components/FilterAccordion'
import type { FilterOption } from '@app/components/FilterAccordion'
import { TableHead } from '@app/components/Table/TableHead'

import {
  QUERY as GetMyCourses,
  ResponseType as GetMyCoursesResponseType,
  ParamsType as GetMyCourseParamsType,
} from '@app/queries/courses/get-courses'
import { Course, CourseLevel, CourseType } from '@app/types'

type MyCoursesProps = unknown

// TODO: finalize after getting correct statuses from business
function getCourseStatus(c: Course) {
  if (c.submitted) {
    return 'Published'
  }

  if (c.modulesAgg.aggregate.count === 0) {
    return 'Pending'
  }

  return 'Draft'
}

const cols = [
  { id: 'name', label: 'Course name' },
  { id: 'org', label: 'Organization' },
  { id: 'type', label: 'Course type' },
  { id: 'start', label: 'Start' },
  { id: 'end', label: 'End' },
  { id: 'status', label: 'status', sorting: false },
  { id: 'empty', label: '', sorting: false },
]

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
  const { t } = useTranslation()

  const levelOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseLevel).map<FilterOption>(level => ({
      id: level,
      title: t(`common.course-levels.${level}`),
      selected: false,
    }))
  }, [t])

  const typeOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseType).map<FilterOption>(type => ({
      id: type,
      title: t(`common.course-types.${type}`),
      selected: false,
    }))
  }, [t])

  const [keyword, setKeyword] = useState('')
  const [levelFilter, setLevelFilter] = useState<FilterOption[]>(levelOptions)
  const [typeFilter, setTypeFilter] = useState<FilterOption[]>(typeOptions)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
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

    if (keyword.trim().length) {
      obj.name = { _ilike: `%${keyword}%` }
    }

    return obj
  }, [levelFilter, typeFilter, keyword])

  const { data } = useSWR<
    GetMyCoursesResponseType,
    Error,
    [string, GetMyCourseParamsType]
  >([GetMyCourses, { orderBy: sorts[`${orderBy}-${order}`], where }])

  const handleRequestSort = (col: string) => {
    const isAsc = orderBy === col && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(col)
  }

  return (
    <Box display="flex">
      <Box width={250} display="flex" flexDirection="column" pt={8} pr={4}>
        <Typography variant="body2">Filter by</Typography>

        <Box display="flex" flexDirection="column">
          <FilterAccordion
            options={levelFilter}
            title="Level"
            onChange={setLevelFilter}
          />

          <FilterAccordion
            options={typeFilter}
            title="Course type"
            onChange={setTypeFilter}
          />
        </Box>
      </Box>

      <Box flex={1}>
        <Typography variant="h5">My Courses</Typography>
        <Typography variant="subtitle2">6 items</Typography>

        <Box mt={4}>
          <TextField
            hiddenLabel
            value={keyword}
            variant="filled"
            size="small"
            placeholder="Search"
            onChange={e => setKeyword(e.target.value) /* TODO: throttle */}
          />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                    <Link href={`view/${c.id}`}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t(`common.course-levels.${c.level}`)}
                      </Typography>
                      <Typography variant="body2">{c.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{c.organization?.name}</TableCell>
                  <TableCell>{c.type}</TableCell>
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
                      label={getCourseStatus(c)}
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
