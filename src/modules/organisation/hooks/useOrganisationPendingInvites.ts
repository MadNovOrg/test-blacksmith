import { gql, useQuery } from 'urql'

import {
  GetOrganisationPendingInvitesQuery,
  GetOrganisationPendingInvitesQueryVariables,
} from '@app/generated/graphql'

export const GET_ORGANISATION_PENDING_INVITES = gql`
  query GetOrganisationPendingInvites($orgId: uuid!) {
    organization_invites_aggregate(where: { orgId: { _eq: $orgId } }) {
      aggregate {
        count
      }
    }
  }
`

export default function useOrganisationPendingInvites(orgId: string) {
  return useQuery<
    GetOrganisationPendingInvitesQuery,
    GetOrganisationPendingInvitesQueryVariables
  >({
    query: GET_ORGANISATION_PENDING_INVITES,
    variables: {
      orgId,
    },
  })
}
