import { gql, useQuery } from 'urql'

import {
  Course_Type_Enum,
  GetAllResourcePacksPricingsQuery,
  GetAllResourcePacksPricingsQueryVariables,
} from '@app/generated/graphql'

export const GET_ALL_RESOURCE_PACK_PRICINGS = gql`
  query GetAllResourcePacksPricings(
    $courseTypes: [course_type_enum!]
    $organisation_id: uuid!
  ) {
    resource_packs_pricing(where: { course_type: { _in: $courseTypes } }) {
      id
      course_type
      course_level
      resource_packs_type
      resource_packs_delivery_type
      reaccred
      AUD_price
      NZD_price
      org_resource_packs_pricings(
        where: { organisation_id: { _eq: $organisation_id } }
      ) {
        id
        AUD_price
        NZD_price
      }
    }
  }
`

export const useAllResourcePacksPricing = (
  courseTypes: Course_Type_Enum[],
  organisation_id: string,
) => {
  const [{ data, error, fetching }, refetch] = useQuery<
    GetAllResourcePacksPricingsQuery,
    GetAllResourcePacksPricingsQueryVariables
  >({
    query: GET_ALL_RESOURCE_PACK_PRICINGS,
    variables: {
      courseTypes,
      organisation_id,
    },
  })
  return {
    data,
    error,
    fetching,
    refetch,
  }
}
