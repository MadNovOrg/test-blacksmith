import { Stack, Typography } from '@mui/material'
import { FC, PropsWithChildren, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterByCourseType } from '@app/components/filters/FilterByCourseType'
import { FilterByDates } from '@app/components/filters/FilterByDates'
import { FilterSearch } from '@app/components/FilterSearch'
import { useAuth } from '@app/context/auth'
import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

export type FilterChangeEvent =
  | { source: 'search'; value: string }
  | {
      source: 'dates'
      value: [Date | undefined, Date | undefined]
    }
  | { source: 'course-level'; value: Course_Level_Enum[] }
  | { source: 'course-type'; value: Course_Type_Enum[] }

type Props = {
  onChange: (e: FilterChangeEvent) => void
  count: number
}

export const CourseExceptionsLogFilters: FC<PropsWithChildren<Props>> = ({
  onChange,
  count,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const { acl } = useAuth()

  return (
    <Stack gap={4} sx={{ minWidth: { md: 250, xs: 1 } }}>
      <Typography variant="body2" color="grey.600" mt={1}>
        {t('common.x-items', { count })}
      </Typography>
      <FilterSearch
        value={query}
        onChange={value => {
          setQuery(value)
          onChange({ source: 'search', value })
        }}
      />
      <FilterByDates
        onChange={useCallback(
          (from, to) => onChange({ source: 'dates', value: [from, to] }),
          [onChange],
        )}
        title={t('pages.audits.filter-by-event-date')}
        data-testid={'date-range'}
        queryParam={'Range'}
      />
      <FilterByCourseLevel
        excludedStatuses={
          acl.isAustralia()
            ? new Set([
                Course_Level_Enum.BildAdvancedTrainer,
                Course_Level_Enum.BildIntermediateTrainer,
                Course_Level_Enum.BildRegular,
                Course_Level_Enum.Advanced,
                Course_Level_Enum.AdvancedTrainer,
              ])
            : new Set([
                Course_Level_Enum.FoundationTrainer,
                Course_Level_Enum.Level_1Np,
              ])
        }
        title={t('course-level')}
        onChange={useCallback(
          level => onChange({ source: 'course-level', value: level }),
          [onChange],
        )}
      />
      <FilterByCourseType
        courseTypeBlacklist={Course_Type_Enum.Open}
        onChange={useCallback(
          type => onChange({ source: 'course-type', value: type }),
          [onChange],
        )}
      />
    </Stack>
  )
}
