import { gql } from 'graphql-request'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  GetAffiliatedOrganisationsQuery,
  GetAffiliatedOrganisationsQueryVariables,
} from '@app/generated/graphql'

export const GET_AFFILIATED_ORGANISATIONS_QUERY = gql`
  query GetAffiliatedOrganisations(
    $mainOrgId: uuid!
    $limit: Int
    $offset: Int
  ) {
    organizations: organization(
      where: { main_organisation_id: { _eq: $mainOrgId } }
      limit: $limit
      offset: $offset
    ) {
      id
      name
      address
      sector
      createdAt
      updatedAt
    }
  }
`

export default function useAffiliatedOrganisations(
  mainOrgId: string,
  limit: number,
  offset: number,
) {
  const [{ data, error, fetching: loading }, reexecute] = useQuery<
    GetAffiliatedOrganisationsQuery,
    GetAffiliatedOrganisationsQueryVariables
  >({
    query: GET_AFFILIATED_ORGANISATIONS_QUERY,
    variables: { mainOrgId, limit, offset },
  })

  return useMemo(
    () => ({ data, error, loading, reexecute }),
    [data, error, loading, reexecute],
  )
}
