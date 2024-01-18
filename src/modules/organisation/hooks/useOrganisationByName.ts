import { RequestPolicy, gql, useQuery } from 'urql'

import {
  GetOrganisationByNameQuery,
  GetOrganisationByNameQueryVariables,
} from '@app/generated/graphql'
import { SHALLOW_ORGANIZATION } from '@app/queries/fragments'

export const GET_ORGANISATION_BY_NAME = gql`
  ${SHALLOW_ORGANIZATION}
  query GetOrganisationByName($query: String!) {
    organization(where: { name: { _ilike: $query } }) {
      ...ShallowOrganization
    }
  }
`

type useOrganisationByName = {
  query: string
  pause?: boolean
  requestPolicy?: RequestPolicy
}

export default function useOrganisationByName({
  query,
  pause,
  requestPolicy,
}: useOrganisationByName) {
  const formatedQuery = `%${query}%`
  return useQuery<
    GetOrganisationByNameQuery,
    GetOrganisationByNameQueryVariables
  >({
    query: GET_ORGANISATION_BY_NAME,
    variables: {
      query: formatedQuery,
    },
    pause,
    requestPolicy,
  })
}
