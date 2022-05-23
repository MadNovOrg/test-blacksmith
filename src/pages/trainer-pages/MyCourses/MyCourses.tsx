import { Button, CircularProgress, Container, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { CreateCourseMenu } from '@app/components/CreateCourseMenu'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseStatus } from '@app/components/FilterCourseStatus'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterSearch } from '@app/components/FilterSearch'
import { StatusChip, StatusChipType } from '@app/components/StatusChip'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { useCourses } from '@app/hooks/useCourses'
import { useTableSort } from '@app/hooks/useTableSort'
import {
  Course,
  CourseLevel,
  CourseStatus,
  InviteStatus,
  CourseTrainerType,
  RoleName,
} from '@app/types'
import { findCourseTrainer } from '@app/util'

import { AcceptDeclineCourse, AcceptDeclineProps } from './AcceptDeclineCourse'

const CourseTitle: React.FC<{ name: string; level: CourseLevel }> = ({
  name,
  level,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography>{t(`course-levels.${level}`)}</Typography>
      <Typography variant="body2">{name}</Typography>
    </>
  )
}

export const MyCourses: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const { profile, activeRole } = useAuth()
  const isTrainer = activeRole === RoleName.TRAINER

  const sorting = useTableSort('name', 'asc')
  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'org', label: t('pages.my-courses.col-org'), sorting: true },
      { id: 'type', label: t('pages.my-courses.col-type'), sorting: true },
      { id: 'start', label: t('pages.my-courses.col-start'), sorting: true },
      { id: 'end', label: t('pages.my-courses.col-end'), sorting: true },
      { id: 'status', label: t('pages.my-courses.col-status') },
      { id: 'empty', label: '' },
    ],
    [t]
  )

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [filterLevel, setFilterLevel] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string[]>([])

  const [where, filtered] = useMemo(() => {
    let isFiltered = false

    const obj: Record<string, object> = {}

    if (filterLevel.length) {
      obj.level = { _in: filterLevel }
      isFiltered = true
    }

    if (filterType.length) {
      obj.type = { _in: filterType }
      isFiltered = true
    }

    if (filterStatus.length) {
      obj.status = { _in: filterStatus }
      isFiltered = true
    }

    const query = keyword.trim()
    if (query.length) {
      const onlyDigits = /^\d+$/.test(query)
      if (onlyDigits) {
        obj.id = { _eq: Number(query) }
      } else {
        obj.name = { _ilike: `%${query}%` }
      }
      isFiltered = true
    }

    return [obj, isFiltered]
  }, [filterLevel, filterType, filterStatus, keyword])

  const { courses, loading, mutate } = useCourses(RoleName.TRAINER, {
    sorting,
    where,
  })
  const count = courses.length

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
                <FilterCourseLevel onChange={setFilterLevel} />
                <FilterCourseType onChange={setFilterType} />
                <FilterCourseStatus onChange={setFilterStatus} />
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
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              <TableNoRows
                noRecords={!loading && !count}
                filtered={filtered}
                colSpan={cols.length}
                itemsName={t('courses').toLowerCase()}
              />

              {courses.map(c => {
                const courseTrainer = profile
                  ? findCourseTrainer(c?.trainers, profile.id)
                  : undefined

                return (
                  <TableRow
                    key={c.id}
                    className="MyCoursesRow"
                    data-testid={`course-row-${c.id}`}
                  >
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
              }) ?? null}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Container>
  )
}
