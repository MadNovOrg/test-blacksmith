import { Box, Typography, Stack } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { FilterOption } from '@app/components/FilterAccordion'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterByCourseState } from '@app/components/filters/FilterByCourseState'
import { FilterByCourseStatus } from '@app/components/filters/FilterByCourseStatus'
import { FilterByCourseType } from '@app/components/filters/FilterByCourseType'
import { FilterByDates } from '@app/components/filters/FilterByDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { useAuth } from '@app/context/auth'
import {
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { getStatusesFromQueryString } from '@app/pages/trainer-pages/MyCourses/utils'
import {
  UserCourseStatus,
  CoursesFilters,
} from '@app/pages/user-pages/MyCourses/hooks/useUserCourses'
import {
  AdminOnlyCourseStatus,
  AttendeeOnlyCourseStatus,
  CourseState,
} from '@app/types'

export type CourseStatusFilters = UserCourseStatus

type DateFilters = {
  filterStartDate?: Date | undefined
  filterEndDate?: Date | undefined
  filterCreateStartDate?: Date | undefined
  filterCreateEndDate?: Date | undefined
}

type Props = {
  forManaging?: boolean
  onChange: (filters: CoursesFilters) => void
}

export function Filters({ forManaging = false, onChange }: Props) {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const location = useLocation()
  const { acl } = useAuth()

  const [filterState, setFilterState] = useState<CourseState[]>([])
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
  const [dateFilters, setDateFilters] = useState<DateFilters>()
  const [filterStatus, setFilterStatus] = useState<string[]>([])

  const statusOptions = useMemo<FilterOption<CourseStatusFilters>[]>(() => {
    return forManaging
      ? [
          {
            id: AttendeeOnlyCourseStatus.AwaitingGrade,
            title: t(
              `course-statuses.${AttendeeOnlyCourseStatus.AwaitingGrade}`
            ),
            selected: false,
          },
          {
            id: Course_Status_Enum.Scheduled,
            title: t(`course-statuses.${Course_Status_Enum.Scheduled}`),
            selected: false,
          },
          {
            id: Course_Status_Enum.Completed,
            title: t(`course-statuses.${Course_Status_Enum.Completed}`),
            selected: false,
          },
          {
            id: AdminOnlyCourseStatus.CancellationRequested,
            title: t(
              `course-statuses.${AdminOnlyCourseStatus.CancellationRequested}`
            ),
            selected: false,
          },
          {
            id: Course_Status_Enum.Cancelled,
            title: t(`course-statuses.${Course_Status_Enum.Cancelled}`),
            selected: false,
          },
        ]
      : [
          {
            id: AttendeeOnlyCourseStatus.InfoRequired,
            title: t(
              `course-statuses.${AttendeeOnlyCourseStatus.InfoRequired}`
            ),
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
            id: AttendeeOnlyCourseStatus.AwaitingGrade,
            title: t(
              `course-statuses.${AttendeeOnlyCourseStatus.AwaitingGrade}`
            ),
            selected: false,
          },
          {
            id: Course_Status_Enum.Scheduled,
            title: t(`course-statuses.${Course_Status_Enum.Scheduled}`),
            selected: false,
          },
        ]
  }, [forManaging, t])

  const statusFilter = useMemo(
    () =>
      statusOptions.flatMap(statusOption =>
        statusOption.selected ? statusOption.id : []
      ) as UserCourseStatus[],
    [statusOptions]
  )
  useEffectOnce(() => {
    setFilterStatus(statusFilter)
  })

  useEffect(() => {
    // This useEffect is here in order to make sure that when we go back to the courses page, the status filters from query parameters are applied

    const statuses = getStatusesFromQueryString(location.search)
    setFilterStatus(statuses)
  }, [location.search])

  useEffect(() => {
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

    const filters = {
      states: filterState,
      statuses: filterStatus as UserCourseStatus[],
      levels: filterLevel,
      types: filterType,
      keyword,
      creation: { start: createStartDate, end: createEndDate },
      schedule: { start: startDate, end: endDate },
    }
    onChange(filters)
  }, [
    onChange,
    dateFilters,
    filterLevel,
    filterType,
    filterState,
    filterStatus,
    keyword,
  ])

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

  return (
    <>
      <FilterSearch value={keyword} onChange={setKeyword} />
      <FilterByCourseState onChange={setFilterState} />
      <FilterByDates
        onChange={onDatesChange}
        title={t('filters.course-date-range')}
        data-testid={'date-range'}
        queryParam={'date-range'}
      />
      <FilterByDates
        onChange={onCreateDatesChange}
        title={t('filters.created-range')}
        data-testid={'date-created'}
        queryParam={'Created'}
      />
      <Box>
        <Typography variant="body2" fontWeight="bold">
          {t('filter-by')}
        </Typography>

        <Stack gap={1}>
          <FilterByCourseLevel
            title={t('course-level')}
            onChange={setFilterLevel}
          />
          <FilterByCourseStatus
            onChange={setFilterStatus}
            customStatuses={
              forManaging
                ? new Set([
                    AttendeeOnlyCourseStatus.AwaitingGrade,
                    AdminOnlyCourseStatus.CancellationRequested,
                  ])
                : new Set([
                    AttendeeOnlyCourseStatus.InfoRequired,
                    AttendeeOnlyCourseStatus.NotAttended,
                    AttendeeOnlyCourseStatus.AwaitingGrade,
                  ])
            }
            excludedStatuses={
              forManaging
                ? new Set([
                    Course_Status_Enum.ConfirmModules,
                    Course_Status_Enum.Declined,
                    Course_Status_Enum.Draft,
                    Course_Status_Enum.EvaluationMissing,
                    Course_Status_Enum.ExceptionsApprovalPending,
                    Course_Status_Enum.GradeMissing,
                    Course_Status_Enum.TrainerDeclined,
                    Course_Status_Enum.TrainerMissing,
                    Course_Status_Enum.TrainerPending,
                    Course_Status_Enum.VenueMissing,
                  ])
                : new Set([
                    Course_Status_Enum.ConfirmModules,
                    Course_Status_Enum.Declined,
                    Course_Status_Enum.Draft,
                    Course_Status_Enum.Cancelled,
                    Course_Status_Enum.ExceptionsApprovalPending,
                    Course_Status_Enum.GradeMissing,
                    Course_Status_Enum.TrainerDeclined,
                    Course_Status_Enum.TrainerMissing,
                    Course_Status_Enum.TrainerPending,
                    Course_Status_Enum.VenueMissing,
                  ])
            }
          />
          {acl.isBookingContact() && forManaging && (
            <FilterByCourseType
              courseTypeBlacklist={Course_Type_Enum.Indirect}
              onChange={setFilterType}
            />
          )}
        </Stack>
      </Box>
    </>
  )
}
