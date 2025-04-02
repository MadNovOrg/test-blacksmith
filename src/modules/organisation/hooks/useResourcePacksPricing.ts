import { gql, useQuery } from 'urql'

import {
  Course_Type_Enum,
  GetAllResourcePacksPricingsQuery,
  GetAllResourcePacksPricingsQueryVariables,
} from '@app/generated/graphql'

export const GET_ALL_RESOURCE_PACK_PRICINGS = gql`
  query GetAllResourcePacksPricings($courseTypes: [course_type_enum!]) {
    resource_packs_pricing(where: { course_type: { _in: $courseTypes } }) {
      id
      course_type
      course_level
      resource_packs_type
      resource_packs_delivery_type
      reaccred
      AUD_price
      NZD_price
    }
  }
`

export const useResourcePacksPricing = (courseTypes: Course_Type_Enum[]) => {
  const [{ data, error, fetching }] = useQuery<
    GetAllResourcePacksPricingsQuery,
    GetAllResourcePacksPricingsQueryVariables
  >({
    query: GET_ALL_RESOURCE_PACK_PRICINGS,
    variables: {
      courseTypes,
    },
  })
  return {
    data,
    error,
    fetching,
  }
}
