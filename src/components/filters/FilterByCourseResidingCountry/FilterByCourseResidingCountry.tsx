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
  includeAllCountries?: boolean
  onChange: (selected: string[]) => void
  saveOnPageRefresh?: boolean
}

export const FilterByCourseResidingCountry: React.FC<
  React.PropsWithChildren<Props>
> = ({
  includeAllCountries = false,
  onChange = noop,
  saveOnPageRefresh = true,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const {
    ANZCountriesCodes,
    countriesCodesWithUKs,
    getLabel: getCountryLabel,
  } = useWorldCountries()

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
    pause: includeAllCountries,
  })

  const [{ data: CourseVenueCountries }] = useQuery<
    GetDistinctCourseVenueCountriesQuery,
    GetDistinctCourseVenueCountriesQueryVariables
  >({
    query: acl.isAustralia()
      ? GET_ANZ_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY
      : GET_DISTINCT_COURSE_VENUE_COUNTRIES_QUERY,
    requestPolicy: 'cache-and-network',
    pause: includeAllCountries,
  })

  useEffect(() => {
    if (includeAllCountries) {
      setResidingCountries(
        acl.isAustralia() ? ANZCountriesCodes : countriesCodesWithUKs,
      )

      return
    }

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
    includeAllCountries,
    acl,
    ANZCountriesCodes,
    countriesCodesWithUKs,
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
      data-testid="course-residing-country-filter"
      defaultExpanded={
        saveOnPageRefresh
          ? selectedInQueryParams.length > 0
          : selectedOptions.length > 0
      }
      onChange={_onChange}
      options={options}
      sort={!includeAllCountries}
      title={t('filters.residing-country')}
    />
  )
}
