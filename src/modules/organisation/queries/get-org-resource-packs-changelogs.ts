import { gql, useQuery } from 'urql'

type ChangelogUpdateColumns = {
  id: string
  AUD_price: number
  NZD_price: number
  organisation_id: string
  resource_packs_pricing_id: string
  synced_from_main?: boolean
}

export type OrgResourcePacksPricingChangelogUpdatedColumns = {
  new: Partial<ChangelogUpdateColumns>
  old: Partial<ChangelogUpdateColumns>
}

import {
  GetOrgResourcePacksPricingChangelogsQuery,
  GetOrgResourcePacksPricingChangelogsQueryVariables,
} from '@app/generated/graphql'

// Exclude the DELETE operation, as it represents a legacy type of changelog.

export const GET_ORG_RESOURCE_PACKS_PRICING_CHANGELOGS = gql`
  query GetOrgResourcePacksPricingChangelogs(
    $orgId: uuid!
    $resourcePacksPricingIds: [uuid!]!
    $limit: Int = 5
    $offset: Int = 0
  ) {
    changelogs: org_resource_packs_pricing_changelog(
      where: {
        operation: { _neq: DELETE }
        org_id: { _eq: $orgId }
        resource_packs_pricing_id: { _in: $resourcePacksPricingIds }
      }
      order_by: { actioned_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      actioned_at
      actioned_by_profile {
        id
        archived
        avatar
        fullName
      }
      operation
      resource_packs_pricing {
        id
        course_level
        course_type
        reaccred
        resource_packs_delivery_type
        resource_packs_type
      }
      updated_columns
    }

    resourcePacksPricings: resource_packs_pricing(
      where: { id: { _in: $resourcePacksPricingIds } }
    ) {
      id
      course_level
      course_type
      reaccred
    }

    totalChangelogs: org_resource_packs_pricing_changelog_aggregate(
      where: {
        org_id: { _eq: $orgId }
        resource_packs_pricing_id: { _in: $resourcePacksPricingIds }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
export function useGetOrgResourcePacksPricingChangelogs({
  limit,
  offset,
  orgId,
  pause,
  resourcePacksPricingIds,
}: {
  limit?: number
  offset?: number
  orgId: string
  pause: boolean
  resourcePacksPricingIds: string[]
}) {
  const [{ data, error, fetching }, refetch] = useQuery<
    GetOrgResourcePacksPricingChangelogsQuery,
    GetOrgResourcePacksPricingChangelogsQueryVariables
  >({
    query: GET_ORG_RESOURCE_PACKS_PRICING_CHANGELOGS,
    variables: {
      limit,
      offset,
      orgId,
      resourcePacksPricingIds,
    },
    pause,
  })
  return {
    data,
    error,
    fetching,
    refetch,
  }
}
