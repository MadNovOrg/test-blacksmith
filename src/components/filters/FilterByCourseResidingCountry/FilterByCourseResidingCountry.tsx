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
  GET_ANZ_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
  GET_ANZ_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
  GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
  GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
} from '@app/components/filters/FilterByCourseResidingCountry/queries/get-distinct-course-countries'
import { useAuth } from '@app/context/auth'
import {
  GetDistinctCourseResidingCountriesQuery,
  GetDistinctCourseResidingCountriesQueryVariables,
  GetDistinctCourseVenueCountriesQuery,
  GetDistinctCourseVenueCountriesQueryVariables,
} from '@app/generated/graphql'
import { noop } from '@app/util'

type Props = {
  onChange: (selected: string[]) => void
  saveOnPageRefresh?: boolean
}

export const FilterByCourseResidingCountry: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop, saveOnPageRefresh = true }) => {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const { getLabel: getCountryLabel } = useWorldCountries()

  const { ANZCountriesCodes, countriesCodesWithUKs } = useWorldCountries()
  const CourseResidingCountryParam = withDefault(
    createEnumArrayParam<string>(
      acl.isAustralia() ? ANZCountriesCodes : countriesCodesWithUKs,
    ),
    [] as string[],
  )
  const [venueCountries, setVenueCountries] = useState<string[]>([])
  const [residingCountries, setResidingCountries] = useState<string[]>([])
  const [{ data: CourseResidingCountries }] = useQuery<
    GetDistinctCourseResidingCountriesQuery,
    GetDistinctCourseResidingCountriesQueryVariables
  >({
    query: acl.isAustralia()
      ? GET_ANZ_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY
      : GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY,
    requestPolicy: 'cache-and-network',
  })

  const [{ data: CourseVenueCountries }] = useQuery<
    GetDistinctCourseVenueCountriesQuery,
    GetDistinctCourseVenueCountriesQueryVariables
  >({
    query: acl.isAustralia()
      ? GET_ANZ_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY
      : GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
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

  const [selectedInQueryParams, setSelectedInQueryParams] = useQueryParam(
    'country',
    CourseResidingCountryParam,
  )

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const options = useMemo(() => {
    return residingCountryOptions?.map(o => ({
      ...o,
      selected: saveOnPageRefresh
        ? selectedInQueryParams.includes(o.id)
        : selectedOptions.includes(o.id),
    }))
  }, [
    residingCountryOptions,
    saveOnPageRefresh,
    selectedInQueryParams,
    selectedOptions,
  ])

  const _onChange = useCallback(
    (opts: FilterOption<string>[]) => {
      const sel = opts?.flatMap(o => (o.selected ? o.id : []))
      if (saveOnPageRefresh) {
        setSelectedInQueryParams(sel)
      } else {
        setSelectedOptions(sel)
      }

      onChange(sel)
    },
    [onChange, saveOnPageRefresh, setSelectedInQueryParams],
  )

  useEffectOnce(() => {
    if (saveOnPageRefresh) {
      onChange(selectedInQueryParams)
    }
  })

  return (
    <FilterAccordion
      defaultExpanded={
        saveOnPageRefresh
          ? selectedInQueryParams.length > 0
          : selectedOptions.length > 0
      }
      options={options}
      title={t('filters.residing-country')}
      onChange={_onChange}
      data-testid="course-residing-country-filter"
    />
  )
}
