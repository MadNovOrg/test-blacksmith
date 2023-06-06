import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  PricingQuery,
  PricingQueryVariables,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/pricing/get-pricing'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type UseCoursePricingProps = {
  filters: {
    type?: Course_Type_Enum[]
    levels?: Course_Level_Enum[]
    blended?: boolean
    reaccreditation?: boolean
  }
  limit: number
  offset: number
}

export const useCoursePricing = ({
  filters,
  limit,
  offset,
}: UseCoursePricingProps) => {
  const levelsWhere = useMemo(() => {
    const levels = filters.levels
    return levels && levels.length ? { level: { _in: levels } } : {}
  }, [filters.levels])

  const typesWhere = useMemo(() => {
    const types = filters.type
    return types && types.length ? { type: { _in: types } } : {}
  }, [filters.type])

  const blendedWhere = useMemo(() => {
    const blended = filters.blended
    return blended ? { blended: { _eq: blended } } : {}
  }, [filters.blended])

  const reaccreditationWhere = useMemo(() => {
    const reaccreditation = filters.reaccreditation
    return reaccreditation ? { reaccreditation: { _eq: reaccreditation } } : {}
  }, [filters.reaccreditation])

  const { data, error, mutate } = useSWR<
    PricingQuery,
    Error,
    [string, PricingQueryVariables]
  >([
    QUERY,
    {
      where: {
        ...levelsWhere,
        ...typesWhere,
        ...blendedWhere,
        ...reaccreditationWhere,
      },
      limit,
      offset,
    },
  ])

  const status = getSWRLoadingStatus(data, error)

  return {
    coursePricing: data?.course_pricing ?? [],
    total: data?.course_pricing_aggregate.aggregate?.count ?? 0,
    error,
    mutate,
    status,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
