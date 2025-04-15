import { gql, useQuery } from 'urql'

import {
  GetAllOrgResourcePacksHistoryQuery,
  GetAllOrgResourcePacksHistoryQueryVariables,
} from '@app/generated/graphql'

export const ALL_ORG_RESOURCE_PACKS_HISTORY = gql`
  query GetAllOrgResourcePacksHistory($orgId: uuid!) {
    history: org_resource_packs_history(
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
        schedule {
          start
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
  }
`

export function useAllOrgResourcePacksHistory(orgId: string, pause: boolean) {
  const [{ data, error, fetching }, refetch] = useQuery<
    GetAllOrgResourcePacksHistoryQuery,
    GetAllOrgResourcePacksHistoryQueryVariables
  >({
    query: ALL_ORG_RESOURCE_PACKS_HISTORY,
    variables: {
      orgId,
    },
    pause,
  })
  return {
    data,
    fetching,
    error,
    refetch,
  }
}
