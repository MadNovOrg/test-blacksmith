import { Box, Typography, Stack } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterByDates } from '@app/components/filters/FilterByDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { Course_Level_Enum, Course_Status_Enum } from '@app/generated/graphql'
import { AttendeeOnlyCourseStatus } from '@app/types'

import { UserCourseStatus, CoursesFilters } from '../../hooks/useUserCourses'

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
  const [keyword, setKeyword] = useState('')

  const [filterLevel, setFilterLevel] = useState<Course_Level_Enum[]>([])
  const [dateFilters, setDateFilters] = useState<DateFilters>()

  const [statusOptions, setStatusOptions] = useState<
    FilterOption<UserCourseStatus>[]
  >(() => {
    return [
      {
        id: AttendeeOnlyCourseStatus.InfoRequired,
        title: t(`course-statuses.${AttendeeOnlyCourseStatus.InfoRequired}`),
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
        id: Course_Status_Enum.GradeMissing,
        title: t(`course-statuses.${Course_Status_Enum.GradeMissing}`),
        selected: false,
      },
      {
        id: Course_Status_Enum.Scheduled,
        title: t(`course-statuses.${Course_Status_Enum.Scheduled}`),
        selected: false,
      },
    ]
  })

  const filterStatus = useMemo(
    () =>
      statusOptions.flatMap(o =>
        o.selected ? o.id : []
      ) as UserCourseStatus[],
    [statusOptions]
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
      statuses: filterStatus,
      levels: filterLevel,
      keyword,
      creation: { start: createStartDate, end: createEndDate },
      schedule: { start: startDate, end: endDate },
    }
    onChange(filters)
  }, [onChange, dateFilters, filterLevel, filterStatus, keyword])

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
          <FilterAccordion
            options={statusOptions}
            onChange={opts => {
              setStatusOptions(opts)
            }}
            title={t('course-status')}
            data-testid="FilterByCourseStatus"
          />
        </Stack>
      </Box>
    </>
  )
}
