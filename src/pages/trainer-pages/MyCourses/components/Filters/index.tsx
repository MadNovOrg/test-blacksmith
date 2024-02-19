import { Box, Typography, Stack } from '@mui/material'
import React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import {
  useQueryParam,
  withDefault,
  BooleanParam,
  createEnumArrayParam,
} from 'use-query-params'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterByBlendedLearning } from '@app/components/filters/FilterByBlendedLearning'
import { FilterByCourseDeliveryType } from '@app/components/filters/FilterByCourseDeliveryType'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterByCourseResidingCountry } from '@app/components/filters/FilterByCourseResidingCountry'
import { FilterByCourseState } from '@app/components/filters/FilterByCourseState'
import { FilterByCourseStatus } from '@app/components/filters/FilterByCourseStatus'
import { FilterByCourseStatusWarnings } from '@app/components/filters/FilterByCourseStatusWarnings'
import { FilterByCourseType } from '@app/components/filters/FilterByCourseType'
import { FilterByDates } from '@app/components/filters/FilterByDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { CoursesFilters } from '@app/hooks/useCourses'
import {
  getActionableStatuses,
  getStatusesFromQueryString,
} from '@app/pages/trainer-pages/MyCourses/utils'
import { CourseStatusFilters } from '@app/pages/user-pages/MyCourses/Components/Filters/Filters'
import { UserCourseStatus } from '@app/pages/user-pages/MyCourses/hooks/useUserCourses'
import {
  AdminOnlyCourseStatus,
  AttendeeOnlyCourseStatus,
  CourseState,
} from '@app/types'

const allAccreditors = Object.values(Accreditors_Enum)

type DateFilters = {
  filterStartDate?: Date | undefined
  filterEndDate?: Date | undefined
  filterCreateStartDate?: Date | undefined
  filterCreateEndDate?: Date | undefined
}

type Props = {
  onChange: (filters: CoursesFilters) => void
}

export function Filters({ onChange }: Props) {
  const location = useLocation()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { acl, isOrgAdmin, activeRole } = useAuth()

  const orgAdminStatusOptions = useMemo<
    FilterOption<CourseStatusFilters>[]
  >(() => {
    return [
      {
        id: AttendeeOnlyCourseStatus.AwaitingGrade,
        title: t(`course-statuses.${AttendeeOnlyCourseStatus.AwaitingGrade}`),
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
  }, [t])

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
  const [filterState, setFilterState] = useState<CourseState[]>([])
  const [filterCourseResidingCountries, setFilterCourseResidingCountries] =
    useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [dateFilters, setDateFilters] = useState<DateFilters>()
  const [filterWarningStatuses, setFilterWarningStatuses] = useState<
    Course_Status_Enum[]
  >([])
  const [filterDeliveryType, setFilterDeliveryType] = useState<
    Course_Delivery_Type_Enum[]
  >([])

  const [filterBlendedLearning, setFilterBlendedLearning] = useQueryParam(
    'bl',
    withDefault(BooleanParam, false)
  )

  const [accreditedBy, setAccreditedBy] = useQueryParam(
    'accredited-by',
    React.useMemo(
      () =>
        withDefault(
          createEnumArrayParam<Accreditors_Enum>(
            Object.values(Accreditors_Enum)
          ),
          [] as Accreditors_Enum[]
        ),
      []
    )
  )

  const actionableStatuses = useMemo(() => {
    if (activeRole) {
      return [...getActionableStatuses(activeRole)]
    }

    return []
  }, [activeRole])

  const accreditedByOptions = useMemo(() => {
    return allAccreditors.map(accreditor => ({
      title: accreditor,
      selected: accreditedBy.includes(accreditor),
      id: accreditor,
    }))
  }, [accreditedBy])

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

  const onStatusWarningChange = useCallback((values: Course_Status_Enum[]) => {
    setFilterWarningStatuses(values)
  }, [])

  const onAccreditedByChange = useCallback(
    (values: FilterOption<Accreditors_Enum>[]) => {
      setAccreditedBy(values.flatMap(value => (value.selected ? value.id : [])))
    },
    [setAccreditedBy]
  )
  const orgAdminFilterStatus = useMemo(() => {
    return orgAdminStatusOptions.flatMap(statusOption =>
      statusOption.selected ? statusOption.id : []
    ) as UserCourseStatus[]
  }, [orgAdminStatusOptions])

  useEffectOnce(() => {
    setFilterStatus(orgAdminFilterStatus)
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
      courseResidingCountries: filterCourseResidingCountries,
      statuses: [...filterStatus, ...filterWarningStatuses],
      levels: filterLevel,
      types: filterType,
      go1Integration: filterBlendedLearning,
      keyword,
      excludedStatuses: Array.from(actionableStatuses),
      creation: { start: createStartDate, end: createEndDate },
      schedule: { start: startDate, end: endDate },
      accreditedBy,
      deliveryTypes: filterDeliveryType,
    }

    onChange(filters)
  }, [
    actionableStatuses,
    filterWarningStatuses,
    dateFilters,
    filterBlendedLearning,
    filterLevel,
    filterState,
    filterStatus,
    filterType,
    keyword,
    onChange,
    accreditedBy,
    filterDeliveryType,
    filterCourseResidingCountries,
  ])

  return (
    <>
      <FilterSearch value={keyword} onChange={setKeyword} />
      <FilterByCourseState onChange={setFilterState} />
      <FilterByDates
        onChange={onDatesChange}
        title={t('filters.course-date-range')}
        data-testid={'date-range'}
        queryParam={'Range'}
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
          <FilterByBlendedLearning
            selected={filterBlendedLearning}
            onChange={setFilterBlendedLearning}
          />
          <FilterByCourseResidingCountry
            onChange={setFilterCourseResidingCountries}
          />
          <FilterByCourseLevel
            title={t('course-level')}
            onChange={setFilterLevel}
          />
          <FilterByCourseType onChange={setFilterType} />
          {acl.isOrgAdmin() ? (
            <FilterByCourseStatus
              onChange={setFilterStatus}
              customStatuses={
                new Set([
                  AttendeeOnlyCourseStatus.AwaitingGrade,
                  AdminOnlyCourseStatus.CancellationRequested,
                ])
              }
              excludedStatuses={
                new Set([
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
              }
            />
          ) : (
            <FilterByCourseStatus
              onChange={setFilterStatus}
              customStatuses={
                acl.isTTAdmin() || isOrgAdmin
                  ? new Set([AdminOnlyCourseStatus.CancellationRequested])
                  : undefined
              }
            />
          )}

          <FilterByCourseStatusWarnings onChange={onStatusWarningChange} />
          <FilterAccordion
            title={t('filters.accredited-by')}
            options={accreditedByOptions}
            onChange={onAccreditedByChange}
            data-testid="filter-accredited-by"
          />
          <FilterByCourseDeliveryType onChange={setFilterDeliveryType} />
        </Stack>
      </Box>
    </>
  )
}
