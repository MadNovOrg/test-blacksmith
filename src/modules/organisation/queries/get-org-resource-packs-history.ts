import { gql, useQuery } from 'urql'

import {
  GetOrgResourcePacksHistoryQuery,
  GetOrgResourcePacksHistoryQueryVariables,
} from '@app/generated/graphql'

export const ORG_RESOURCE_PACKS_HISTORY = gql`
  query GetOrgResourcePacksHistory(
    $limit: Int = 12
    $offset: Int = 0
    $orgId: uuid!
  ) {
    history: org_resource_packs_history(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: { orgId: { _eq: $orgId } }
    ) {
      id
      change
      course {
        id
        code: course_code
        createdBy {
          id
          fullName
        }
      }
      courseId
      created_at
      event
      payload
      reservedBalance
      resourcePacksType
      totalBalance
    }
    total: org_resource_packs_history_aggregate(
      where: { orgId: { _eq: $orgId } }
    ) {
      aggregate {
        count
      }
    }
  }
`
export function useOrgResourcePacksHistory({
  limit,
  offset,
  orgId,
}: GetOrgResourcePacksHistoryQueryVariables) {
  return useQuery<
    GetOrgResourcePacksHistoryQuery,
    GetOrgResourcePacksHistoryQueryVariables
  >({
    query: ORG_RESOURCE_PACKS_HISTORY,
    variables: {
      limit,
      offset,
      orgId,
    },
  })
}
