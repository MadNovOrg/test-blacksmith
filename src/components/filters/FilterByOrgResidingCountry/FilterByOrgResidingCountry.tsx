import { useCallback, useMemo } from 'react'
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
  GetDistinctOrgResidingCountriesQuery,
  GetDistinctOrgResidingCountriesQueryVariables,
} from '@app/generated/graphql'
import { noop } from '@app/util'

import { GET_DISTINCT_ORG_RESIDING_COUNTRIES_QUERY } from './queries/get-distinct-org-countries'

type Props = {
  onChange: (selected: string[]) => void
  countries?: string[]
}

export const FilterByOrgResidingCountry = ({
  countries,
  onChange = noop,
}: Props) => {
  const { getLabel } = useWorldCountries()
  const { t } = useTranslation()

  const { countriesCodesWithUKs } = useWorldCountries()
  const orgResidingCountryParam = withDefault(
    createEnumArrayParam<string>(countriesCodesWithUKs),
    [] as string[],
  )

  const [{ data }] = useQuery<
    GetDistinctOrgResidingCountriesQuery,
    GetDistinctOrgResidingCountriesQueryVariables
  >({
    query: GET_DISTINCT_ORG_RESIDING_COUNTRIES_QUERY,
    requestPolicy: 'cache-and-network',
    pause: Boolean(countries?.length),
  })

  const residingCountryOptions = useMemo(() => {
    const countryCodes =
      countries ??
      data?.org_distinct_country_codes.map(c => c.countrycode) ??
      []

    return (
      countryCodes
        .map(code =>
          code
            ? {
                id: code,
                title: getLabel(code) ?? '',
              }
            : { id: '', title: '' },
        )
        .filter(c => c.title) ?? []
    )
  }, [countries, data?.org_distinct_country_codes, getLabel])

  const [selected, setSelected] = useQueryParam<string[]>(
    'country',
    orgResidingCountryParam,
  )

  const options = useMemo(() => {
    return residingCountryOptions?.map(o => ({
      ...o,
      selected: selected?.includes(o.id),
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
      defaultExpanded={selected?.length > 0}
      onChange={_onChange}
      options={options}
      title={t('filters.residing-country')}
    />
  )
}
