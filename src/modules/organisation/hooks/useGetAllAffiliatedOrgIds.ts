import { gql, useQuery } from 'urql'

import {
  GetAllAffiliatedOrgIdsQuery,
  GetAllAffiliatedOrgIdsQueryVariables,
} from '@app/generated/graphql'

export const GET_ALL_AFFILIATED_ORG_IDS = gql`
  query GetAllAffiliatedOrgIds($organisation_id: uuid!) {
    organization(where: { main_organisation_id: { _eq: $organisation_id } }) {
      id
    }
  }
`

export const useGetAllAffiliatedOrgIds = (
  organisation_id: string | undefined,
) => {
  const [{ data, error, fetching }] = useQuery<
    GetAllAffiliatedOrgIdsQuery,
    GetAllAffiliatedOrgIdsQueryVariables
  >({
    query: GET_ALL_AFFILIATED_ORG_IDS,
    variables: {
      organisation_id,
    },
    pause: !organisation_id,
  })

  return {
    data: data?.organization,
    error,
    fetching,
  }
}
