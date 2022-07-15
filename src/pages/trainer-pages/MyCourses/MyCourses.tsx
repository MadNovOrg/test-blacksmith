import {
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Stack,
} from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { CreateCourseMenu } from '@app/components/CreateCourseMenu'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseStatus } from '@app/components/FilterCourseStatus'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'
import { useCourses } from '@app/hooks/useCourses'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { RoleName } from '@app/types'
import { findCourseTrainer } from '@app/util'

import { AcceptDeclineCourse } from './AcceptDeclineCourse'

const CourseTitle: React.FC<{
  name: string
  level: Course_Level_Enum | undefined | null
}> = ({ name, level }) => {
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
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
      { id: 'type', label: t('pages.my-courses.col-type'), sorting: true },
      { id: 'start', label: t('pages.my-courses.col-start'), sorting: true },
      { id: 'end', label: t('pages.my-courses.col-end'), sorting: true },
      {
        id: 'trainers',
        label: t('pages.my-courses.col-trainers'),
        sorting: false,
      },
      {
        id: 'registrants',
        label: t('pages.my-courses.col-registrants'),
        sorting: false,
      },
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

  const { Pagination, perPage, currentPage } = useTablePagination()

  const { courses, loading, mutate, total } = useCourses(RoleName.TRAINER, {
    sorting,
    where,
    pagination: {
      perPage,
      currentPage,
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const count = courses.length

  const handleNavigation = (course: {
    id: number
    status?: Course_Status_Enum | null
  }) => {
    if (
      course.status === Course_Status_Enum.Draft ||
      course.status === Course_Status_Enum.ConfirmModules
    ) {
      return `${course.id}/modules`
    }
    return `${course.id}/details`
  }

  const onAcceptedOrDeclined = useCallback(
    (course, trainer, status) => {
      const isLead = trainer.type === Course_Trainer_Type_Enum.Leader
      const isAccepted = status === Course_Invite_Status_Enum.Accepted
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

              {courses.map((c, index) => {
                const courseTrainer = profile
                  ? findCourseTrainer(c?.trainers, profile.id)
                  : undefined

                return (
                  <TableRow
                    key={c.id}
                    className="MyCoursesRow"
                    data-testid={`course-row-${c.id}`}
                    data-index={index}
                  >
                    <TableCell>
                      {courseTrainer &&
                      courseTrainer.status !==
                        Course_Invite_Status_Enum.Pending ? (
                        <CourseTitle level={c.level} name={c.name} />
                      ) : (
                        <Link href={handleNavigation(c)}>
                          <CourseTitle level={c.level} name={c.name} />
                        </Link>
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
                    <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                    <TableCell>
                      {c.dates?.aggregate?.start?.date && (
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
                      {c.dates?.aggregate?.end?.date && (
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
                      <TrainerAvatarGroup trainers={c.trainers} />
                    </TableCell>
                    <TableCell>
                      <Typography mb={1}>
                        <Typography component="span">
                          {c.participantsAgg?.aggregate?.count}
                        </Typography>
                        <Typography component="span" variant="body2">
                          /{c.max_participants}
                        </Typography>
                      </Typography>
                      {c.participantsAgg?.aggregate ? (
                        <LinearProgress
                          variant="determinate"
                          value={
                            (c.participantsAgg?.aggregate?.count /
                              c.max_participants) *
                            100
                          }
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {c.status ? <CourseStatusChip status={c.status} /> : null}
                    </TableCell>
                    <TableCell>
                      <AcceptDeclineCourse
                        trainer={
                          profile
                            ? findCourseTrainer(c.trainers, profile.id)
                            : undefined
                        }
                        onUpdate={(trainer, status) =>
                          onAcceptedOrDeclined(c, trainer, status)
                        }
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => navigate(handleNavigation(c))}
                        >
                          {c.status === Course_Status_Enum.ConfirmModules ||
                          c.status === Course_Status_Enum.Draft
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

          {total ? <Pagination total={total} /> : null}
        </Box>
      </Box>
    </Container>
  )
}
