import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import { useQuery } from 'urql'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import {
  GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
  GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
} from '@app/components/filters/FilterByCourseResidingCountry/queries/get-distinct-course-countries'
import {
  GetDistinctCourseResidingCountriesQuery,
  GetDistinctCourseResidingCountriesQueryVariables,
  GetDistinctCourseVenueCountriesQuery,
  GetDistinctCourseVenueCountriesQueryVariables,
} from '@app/generated/graphql'
import { noop } from '@app/util'

type Props = {
  onChange: (selected: string[]) => void
}

export const FilterByCourseResidingCountry: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()
  const { getLabel: getCountryLabel } = useWorldCountries()

  const { countriesCodesWithUKs } = useWorldCountries()
  const CourseResidingCountryParam = withDefault(
    createEnumArrayParam<string>(countriesCodesWithUKs),
    [] as string[],
  )
  const [venueCountries, setVenueCountries] = useState<string[]>([])
  const [residingCountries, setResidingCountries] = useState<string[]>([])
  const [{ data: CourseResidingCountries }] = useQuery<
    GetDistinctCourseResidingCountriesQuery,
    GetDistinctCourseResidingCountriesQueryVariables
  >({
    query: GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
    requestPolicy: 'cache-and-network',
  })

  const [{ data: CourseVenueCountries }] = useQuery<
    GetDistinctCourseVenueCountriesQuery,
    GetDistinctCourseVenueCountriesQueryVariables
  >({
    query: GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
    requestPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (
      CourseResidingCountries &&
      CourseResidingCountries?.course?.length > 0
    ) {
      setResidingCountries(
        CourseResidingCountries.course.map(c => c?.residingCountry ?? ''),
      )
    }
    if (CourseVenueCountries && CourseVenueCountries?.venue?.length > 0) {
      setVenueCountries(
        CourseVenueCountries.venue.map(c => c?.countryCode ?? ''),
      )
    }
  }, [
    CourseResidingCountries,
    CourseVenueCountries,
    setVenueCountries,
    setResidingCountries,
  ])

  const setOfUniqueCountries = new Set([
    ...venueCountries,
    ...residingCountries,
  ])

  const countries = Array.from(setOfUniqueCountries)

  const residingCountryOptions = useMemo(() => {
    return countries
      .map(c =>
        c
          ? {
              id: c,
              title: getCountryLabel(c) ?? '',
            }
          : { id: '', title: '' },
      )
      .filter(c => c.title)
  }, [countries, getCountryLabel])

  const [selected, setSelected] = useQueryParam(
    'country',
    CourseResidingCountryParam,
  )

  const options = useMemo(() => {
    return residingCountryOptions?.map(o => ({
      ...o,
      selected: selected.includes(o.id),
    }))
  }, [residingCountryOptions, selected])

  const _onChange = useCallback(
    (opts: FilterOption<string>[]) => {
      const sel = opts?.flatMap(o => (o.selected ? o.id : []))
      setSelected(sel)
      onChange(sel)
    },
    [onChange, setSelected],
  )

  useEffectOnce(() => {
    onChange(selected)
  })

  return (
    <FilterAccordion
      defaultExpanded={selected.length > 0}
      options={options}
      title={t('filters.residing-country')}
      onChange={_onChange}
      data-testid="course-residing-country-filter"
    />
  )
}
