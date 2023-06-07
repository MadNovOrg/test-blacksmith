import { Box, Typography, Stack } from '@mui/material'
import React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  useQueryParam,
  withDefault,
  BooleanParam,
  createEnumArrayParam,
} from 'use-query-params'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterByBlendedLearning } from '@app/components/FilterByBlendedLearning'
import { FilterByCourseStatusWarnings } from '@app/components/FilterByCourseStatusWarnings'
import { FilterCourseDeliveryType } from '@app/components/FilterCourseDeliveryType'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseStatus } from '@app/components/FilterCourseStatus'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterDates } from '@app/components/FilterDates'
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
import { AdminOnlyCourseStatus } from '@app/types'

import { getActionableStatuses } from '../../utils'

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
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { acl, isOrgAdmin, activeRole } = useAuth()

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
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
    filterStatus,
    filterType,
    keyword,
    onChange,
    accreditedBy,
    filterDeliveryType,
  ])

  return (
    <>
      <FilterSearch value={keyword} onChange={setKeyword} />
      <FilterDates
        onChange={onDatesChange}
        title={t('filters.course-date-range')}
        data-testid={'date-range'}
        queryParam={'Range'}
      />
      <FilterDates
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
          <FilterCourseLevel
            title={t('course-level')}
            onChange={setFilterLevel}
          />
          <FilterCourseType onChange={setFilterType} />
          <FilterCourseStatus
            onChange={setFilterStatus}
            customStatuses={
              acl.isTTAdmin() || isOrgAdmin
                ? new Set([AdminOnlyCourseStatus.CancellationRequested])
                : undefined
            }
          />
          <FilterByCourseStatusWarnings onChange={onStatusWarningChange} />
          <FilterAccordion
            title={t('filters.accredited-by')}
            options={accreditedByOptions}
            onChange={onAccreditedByChange}
            data-testid="filter-accredited-by"
          />
          <FilterCourseDeliveryType onChange={setFilterDeliveryType} />
        </Stack>
      </Box>
    </>
  )
}
