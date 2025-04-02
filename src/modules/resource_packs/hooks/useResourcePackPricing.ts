import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetResourcePackPricingsQuery,
  GetResourcePackPricingsQueryVariables,
  Resource_Packs_Delivery_Type_Enum,
  Resource_Packs_Pricing_Bool_Exp,
} from '@app/generated/graphql'
import { Resource_Pack_Course_Delivery_Type } from '@app/util'

import { GET_RESOURCE_PACK_PRICINGS } from '../queries'

export type UseResourcePackPricingProps = {
  course_type: Course_Type_Enum
  course_level: Course_Level_Enum
  course_delivery_type: Course_Delivery_Type_Enum
  reaccreditation: boolean
  resource_packs_delivery_type?: Resource_Packs_Delivery_Type_Enum
  pause?: boolean
}

export const useResourcePackPricing = ({
  course_type,
  course_level,
  course_delivery_type,
  reaccreditation,
  resource_packs_delivery_type,
  pause = false,
}: UseResourcePackPricingProps) => {
  const where = useMemo(() => {
    return {
      _and: [
        {
          course_level: {
            _eq: course_level,
          },
        },
        {
          course_type: {
            _eq: course_type,
          },
        },
        {
          resource_packs_type: {
            _eq: Resource_Pack_Course_Delivery_Type[course_delivery_type],
          },
        },
        {
          reaccred: {
            _eq: reaccreditation,
          },
        },
        resource_packs_delivery_type
          ? {
              resource_packs_delivery_type: resource_packs_delivery_type,
            }
          : {},
      ],
    } as Resource_Packs_Pricing_Bool_Exp
  }, [
    course_delivery_type,
    course_level,
    course_type,
    reaccreditation,
    resource_packs_delivery_type,
  ])

  const [{ data, error, fetching }] = useQuery<
    GetResourcePackPricingsQuery,
    GetResourcePackPricingsQueryVariables
  >({
    query: GET_RESOURCE_PACK_PRICINGS,
    variables: {
      where,
    },
    pause: pause,
    requestPolicy: 'network-only',
  })
  return {
    data,
    error,
    fetching,
  }
}
