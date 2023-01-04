import {
  Button,
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

import { CreateCourseMenu } from '@app/components/CreateCourseMenu'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseStatus } from '@app/components/FilterCourseStatus'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterSearch } from '@app/components/FilterSearch'
import { ParticipantsCount } from '@app/components/ParticipantsCount'
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
import { RoleName } from '@app/types'
import { findCourseTrainer } from '@app/util'

import { AcceptDeclineCourse } from './AcceptDeclineCourse'
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
      return getActionableStatuses(activeRole)
    }

    return new Set<Course_Status_Enum>()
  }, [activeRole])

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
  const [filterStatus, setFilterStatus] = useState<Course_Status_Enum[]>([])

  const { Pagination, perPage, currentPage } = useTablePagination()
  const {
    Pagination: ActionablePagination,
    perPage: actionablePerPage,
    currentPage: actionableCurrentPage,
  } = useTablePagination(5)

  const [
    { data: actionableCourses, fetching: fetchingActionableCourses },
    refetchActionableCourses,
  ] = useActionableCourses({
    statuses: Array.from(actionableStatuses),
    pagination: {
      perPage: actionablePerPage,
      currentPage: actionableCurrentPage,
    },
    orgId,
  })

  const { courses, loading, mutate, total } = useCourses(
    activeRole ?? RoleName.USER,
    {
      sorting,
      filters: {
        statuses: filterStatus,
        levels: filterLevel,
        types: filterType,
        keyword,
        excludedStatuses: Array.from(actionableStatuses),
      },
      pagination: {
        perPage,
        currentPage,
      },
      orgId,
    }
  )

  const filtered = Boolean(
    keyword || filterStatus.length || filterType.length || filterLevel.length
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

  const fetchingCourses = loading || fetchingActionableCourses

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
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

            <Box>
              <Typography variant="body2" fontWeight="bold">
                {t('filter-by')}
              </Typography>

              <Stack gap={1}>
                <FilterCourseLevel onChange={setFilterLevel} />
                <FilterCourseType onChange={setFilterType} />
                <FilterCourseStatus
                  onChange={setFilterStatus}
                  excludedStatuses={actionableStatuses}
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
                {t([
                  `pages.my-courses.actionable-courses-title-${activeRole}`,
                  'pages.my-courses.actionable-courses-title',
                ])}
              </Typography>
              <Box px={1} pb={1} bgcolor="grey.100" borderRadius={1}>
                <CoursesTable
                  courses={actionableCourses?.courses ?? []}
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
                      {c.status === Course_Status_Enum.TrainerPending ? (
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
                          />
                        </TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                    </TableRow>
                  )}
                />
                {actionableCourses.course_aggregate.aggregate?.count ? (
                  <ActionablePagination
                    total={actionableCourses.course_aggregate.aggregate?.count}
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
