import {
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  TableCell,
  TableRow,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { CreateCourseMenu } from '@app/components/CreateCourseMenu'
import { FilterByBlendedLearning } from '@app/components/FilterByBlendedLearning'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseStatus } from '@app/components/FilterCourseStatus'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterDates } from '@app/components/FilterDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { ParticipantsCount } from '@app/components/ParticipantsCount'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCourses } from '@app/hooks/useCourses'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { AcceptDeclineCourse } from '@app/pages/trainer-pages/MyCourses/AcceptDeclineCourse'
import { RoleName } from '@app/types'
import { findCourseTrainer } from '@app/util'

import {
  CoursesTable,
  CourseTitleCell,
  DateCell,
  VenueCell,
} from './components/CoursesTable'
import useActionableCourses from './hooks/useActionableCourses'
import { getActionableStatuses } from './utils'

export type Props = {
  title?: string
  orgId?: string
  showAvailableCoursesButton?: boolean
}

type DateFilters = {
  filterStartDate?: Date | undefined
  filterEndDate?: Date | undefined
  filterCreateStartDate?: Date | undefined
  filterCreateEndDate?: Date | undefined
}

export const TrainerCourses: React.FC<Props> = ({
  title,
  orgId,
  showAvailableCoursesButton,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const { activeRole, profile, acl } = useAuth()
  const isTrainer = activeRole === RoleName.TRAINER

  const sorting = useTableSort('start', 'desc')

  const actionableStatuses = useMemo(() => {
    if (activeRole) {
      return [...getActionableStatuses(activeRole)]
    }

    return []
  }, [activeRole])

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
  const [filterStatus, setFilterStatus] = useState<Course_Status_Enum[]>([])
  const [dateFilters, setDateFilters] = useState<DateFilters>()
  const [filterBlendedLearning, setFilterBlendedLearning] = useQueryParam(
    'bl',
    withDefault(BooleanParam, false)
  )

  const { Pagination, perPage, currentPage } = useTablePagination({
    id: 'my-courses',
  })
  const {
    Pagination: ActionablePagination,
    perPage: actionablePerPage,
    currentPage: actionableCurrentPage,
  } = useTablePagination({ initialPerPage: 5, id: 'actionable-courses' })

  const [
    { data: actionableCourses, fetching: fetchingActionableCourses },
    refetchActionableCourses,
  ] = useActionableCourses({
    statuses: actionableStatuses,
    pagination: {
      perPage: actionablePerPage,
      currentPage: actionableCurrentPage,
    },
    orgId,
  })

  const filters = useMemo(() => {
    let startDate = undefined
    let endDate = undefined
    let createStartDate = undefined
    let createEndDate = undefined

    if (dateFilters?.filterStartDate) {
      startDate = new Date(dateFilters.filterStartDate)
      startDate.setHours(0, 0, 0)
    }
    if (dateFilters?.filterEndDate) {
      endDate = new Date(dateFilters.filterEndDate)
      endDate.setHours(23, 59, 59)
    }
    if (dateFilters?.filterCreateStartDate) {
      createStartDate = new Date(dateFilters.filterCreateStartDate)
      createStartDate.setHours(0, 0, 0)
    }
    if (dateFilters?.filterCreateEndDate) {
      createEndDate = new Date(dateFilters.filterCreateEndDate)
      createEndDate.setHours(23, 59, 59)
    }

    return {
      statuses: filterStatus,
      levels: filterLevel,
      types: filterType,
      go1Integration: filterBlendedLearning,
      keyword,
      excludedStatuses: Array.from(actionableStatuses),
      creation: { start: createStartDate, end: createEndDate },
      schedule: { start: startDate, end: endDate },
    }
  }, [
    actionableStatuses,
    dateFilters,
    filterBlendedLearning,
    filterLevel,
    filterStatus,
    filterType,
    keyword,
  ])

  const { courses, loading, mutate, total } = useCourses(
    activeRole ?? RoleName.USER,
    {
      sorting,
      filters,
      pagination: {
        perPage,
        currentPage,
      },
      orgId,
    }
  )

  const isDateEmpty = Object.values(dateFilters || {}).every(
    x => x === undefined || x === null
  )

  const filtered = Boolean(
    keyword ||
      filterStatus.length ||
      filterType.length ||
      filterLevel.length ||
      filterBlendedLearning ||
      !isDateEmpty
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const count = courses.length

  const onAcceptedOrDeclined = useCallback(
    (course, trainer, status) => {
      const isLead = trainer.type === Course_Trainer_Type_Enum.Leader
      const isAccepted = status === Course_Invite_Status_Enum.Accepted
      setKeyword('')

      if (isLead && isAccepted) {
        navigate(`./${course.id}/modules`)
      } else {
        mutate()
        refetchActionableCourses({ requestPolicy: 'network-only' })
      }
    },
    [mutate, navigate, refetchActionableCourses]
  )

  const onDatesChange = useCallback((from?: Date, to?: Date) => {
    setDateFilters(prev => {
      return { ...prev, filterStartDate: from, filterEndDate: to }
    })
  }, [])

  const onCreateDatesChange = useCallback((from?: Date, to?: Date) => {
    setDateFilters(prev => {
      return { ...prev, filterCreateStartDate: from, filterCreateEndDate: to }
    })
  }, [])

  const fetchingCourses = loading || fetchingActionableCourses

  return (
    <Container maxWidth="lg" sx={{ py: 5, position: 'relative' }}>
      <SnackbarMessage
        messageKey="course-created"
        sx={{ position: 'absolute' }}
      />
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">
            {title ?? t(isTrainer ? 'courses' : 'pages.my-courses.h1')}
          </Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {fetchingCourses ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch value={keyword} onChange={setKeyword} />
            <FilterDates
              onChange={onDatesChange}
              title={t('filters.date-range')}
              testId={'Range'}
              queryParam={'Range'}
            />
            <FilterDates
              onChange={onCreateDatesChange}
              title={t('filters.created-range')}
              testId={'Created'}
              queryParam={'Created'}
            />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {t('filter-by')}
              </Typography>
              <Stack gap={1}>
                <FilterByBlendedLearning
                  selected={filterBlendedLearning}
                  onChange={setFilterBlendedLearning}
                />
                <FilterCourseLevel onChange={setFilterLevel} />
                <FilterCourseType onChange={setFilterType} />
                <FilterCourseStatus
                  onChange={setFilterStatus}
                  excludedStatuses={new Set(actionableStatuses)}
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
            <Box display="flex" gap={1}>
              {acl.canCreateCourses() ? <CreateCourseMenu /> : null}
              {showAvailableCoursesButton ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/organisations/${orgId}/courses`)}
                >
                  {t('pages.my-courses.find-available-courses')}
                </Button>
              ) : null}
            </Box>
          </Box>

          {fetchingCourses && !courses.length ? (
            <Stack direction="row" alignItems="center" justifyContent="center">
              <CircularProgress />
            </Stack>
          ) : null}

          {actionableCourses?.courses.length ? (
            <Box mb={3}>
              <Typography variant="h6" mb={1}>
                {t('pages.my-courses.actionable-courses-title')}
              </Typography>
              <Box px={1} pb={1} bgcolor="grey.100" borderRadius={1}>
                <CoursesTable
                  courses={actionableCourses?.courses}
                  hiddenColumns={new Set(['status'])}
                  data-testid="actionable-courses-table"
                  loading={fetchingActionableCourses}
                  renderRow={c => (
                    <TableRow
                      key={c.id}
                      data-testid={`actionable-course-${c.id}`}
                    >
                      <CourseTitleCell course={c} />
                      <VenueCell course={c} />
                      <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                      <DateCell date={c.dates?.aggregate?.start?.date} />
                      <DateCell date={c.dates?.aggregate?.end?.date} />
                      <DateCell date={c.createdAt} />
                      <TableCell>
                        <TrainerAvatarGroup trainers={c.trainers} />
                      </TableCell>
                      <TableCell data-testid="participants-cell">
                        <ParticipantsCount
                          participating={
                            c.participantsAgg?.aggregate?.count ?? 0
                          }
                          capacity={c.max_participants}
                          waitlist={c.waitlistAgg?.aggregate?.count}
                        />
                      </TableCell>
                      <TableCell>
                        {c.status === Course_Status_Enum.TrainerPending ? (
                          <AcceptDeclineCourse
                            trainer={
                              profile
                                ? findCourseTrainer(c.trainers, profile.id)
                                : undefined
                            }
                            onUpdate={(trainer, status) =>
                              onAcceptedOrDeclined(c, trainer, status)
                            }
                          />
                        ) : null}
                        {c.status &&
                        [
                          Course_Status_Enum.ApprovalPending,
                          Course_Status_Enum.ExceptionsApprovalPending,
                        ].indexOf(c.status) !== -1 ? (
                          <CourseStatusChip status={c.status} hideIcon={true} />
                        ) : null}
                        {c.status === Course_Status_Enum.TrainerMissing ? (
                          <CourseStatusChip status={c.status} />
                        ) : null}
                        {c.cancellationRequest ? (
                          <Chip
                            size="small"
                            color="warning"
                            label={t('common.cancellation-requested')}
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )}
                />
                {actionableCourses?.course_aggregate?.aggregate?.count ? (
                  <ActionablePagination
                    total={
                      actionableCourses?.course_aggregate?.aggregate?.count
                    }
                    rowsPerPage={[5, 10, 15]}
                    testId="actionable-courses-pagination"
                  />
                ) : null}
              </Box>
            </Box>
          ) : null}

          {actionableCourses?.courses.length ? (
            <Typography variant="h6" mb={1}>
              {t('pages.my-courses.courses-title')}
            </Typography>
          ) : null}
          <CoursesTable
            courses={courses}
            isFiltered={filtered}
            sorting={sorting}
            loading={loading}
            data-testid="courses-table"
            hiddenColumns={new Set(['actions'])}
          />

          {total ? (
            <Pagination testId="courses-pagination" total={total} />
          ) : null}
        </Box>
      </Box>
    </Container>
  )
}
