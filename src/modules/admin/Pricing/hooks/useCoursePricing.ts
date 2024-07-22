import { gql } from 'graphql-request'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  GetPricingQuery,
  GetPricingQueryVariables,
} from '@app/generated/graphql'

export const GET_PRICING = gql`
  query GetPricing(
    $where: course_pricing_bool_exp
    $limit: Int = 20
    $offset: Int = 0
  ) {
    course_pricing(
      order_by: [
        { level: asc }
        { type: desc }
        { reaccreditation: asc }
        { blended: asc }
      ]
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      level
      priceAmount
      priceCurrency
      reaccreditation
      type
      xeroCode
      blended
      updatedAt
      pricingSchedules(order_by: { effectiveFrom: asc }) {
        id
        coursePricingId
        effectiveFrom
        effectiveTo
        priceAmount
        priceCurrency
      }
      pricingSchedules_aggregate {
        aggregate {
          count
        }
        nodes {
          id
          coursePricingId
          effectiveFrom
          effectiveTo
          priceAmount
          priceCurrency
        }
      }
    }
    course_pricing_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

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

  const [{ data, error, fetching }, mutate] = useQuery<
    GetPricingQuery,
    GetPricingQueryVariables
  >({
    query: GET_PRICING,
    variables: {
      where: {
        ...levelsWhere,
        ...typesWhere,
        ...blendedWhere,
        ...reaccreditationWhere,
      },
      limit,
      offset,
    },
  })

  return {
    coursePricing: data?.course_pricing ?? [],
    total: data?.course_pricing_aggregate.aggregate?.count ?? 0,
    error,
    mutate,
    isLoading: fetching,
  }
}
