import { useQuery } from 'urql'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetResourcePackPricingsQuery,
  GetResourcePackPricingsQueryVariables,
} from '@app/generated/graphql'

import { GET_RESOURCE_PACK_PRICINGS } from '../queries'

export type UseResourcePackPricingProps = {
  course_type: Course_Type_Enum
  course_level: Course_Level_Enum
  course_delivery_type: Course_Delivery_Type_Enum
  reaccreditation: boolean
  currency: string
  pause?: boolean
}

export const useResourcePackPricing = ({
  course_type,
  course_level,
  course_delivery_type,
  reaccreditation,
  currency,
  pause = false,
}: UseResourcePackPricingProps) => {
  const [{ data, error, fetching }] = useQuery<
    GetResourcePackPricingsQuery,
    GetResourcePackPricingsQueryVariables
  >({
    query: GET_RESOURCE_PACK_PRICINGS,
    variables: {
      course_type,
      course_level,
      course_delivery_type,
      reaccreditation,
      currency,
    },
    requestPolicy: 'network-only',
    pause: pause,
  })
  return {
    data,
    error,
    fetching,
  }
}
