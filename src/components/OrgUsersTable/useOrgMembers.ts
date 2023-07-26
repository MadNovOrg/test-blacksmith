import { gql, useQuery } from 'urql'

import {
  Order_By,
  OrgMembersQuery,
  OrgMembersQueryVariables,
  Organization_Member_Order_By,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'
import { SortOrder } from '@app/types'
import { DEFAULT_PAGINATION_LIMIT } from '@app/util'

const QUERY = gql`
  query OrgMembers(
    $offset: Int!
    $limit: Int!
    $orgId: uuid!
    $orderBy: [organization_member_order_by!] = { profile: { createdAt: desc } }
  ) {
    members: organization_member(
      limit: $limit
      offset: $offset
      where: { organization_id: { _eq: $orgId } }
      order_by: $orderBy
    ) {
      id
      profile {
        id
        fullName
        lastActivity
        createdAt
        go1Licenses {
          expireDate
        }
        certificates(where: { status: { _neq: "EXPIRED" } }) {
          id
          courseLevel
          status
          participant {
            certificateChanges {
              payload
            }
          }
        }
      }
      isAdmin
      position
    }

    organization_member_aggregate(where: { organization_id: { _eq: $orgId } }) {
      aggregate {
        count
      }
    }
  }
`

export function useOrgMembers({
  perPage = DEFAULT_PAGINATION_LIMIT,
  offset = 0,
  sort = { dir: 'asc', by: 'createdAt' },
  orgId,
}: {
  perPage?: number
  offset?: number
  orgId: string
  sort?: {
    dir: SortOrder
    by: string
  }
}) {
  const orderBy = getOrderBy(sort)

  const [{ data, fetching }, refetch] = useQuery<
    OrgMembersQuery,
    OrgMembersQueryVariables
  >({
    requestPolicy: 'cache-and-network',
    query: QUERY,
    variables: {
      limit: perPage,
      offset: offset,
      orgId,
      orderBy,
    },
  })

  return {
    members: data?.members,
    fetching,
    total: data?.organization_member_aggregate.aggregate?.count,
    refetch,
  }
}

function getOrderBy({
  by,
  dir,
}: Pick<Sorting, 'by' | 'dir'>): Organization_Member_Order_By {
  const direction = dir === 'asc' ? Order_By.Asc : Order_By.Desc

  switch (by) {
    case 'lastActivity':
      return {
        profile: {
          lastActivity: direction,
        },
      }
    case 'createdAt':
      return { profile: { createdAt: direction } }

    case 'fullName': {
      return { profile: { fullName: direction } }
    }

    default: {
      return { profile: { createdAt: Order_By.Asc } }
    }
  }
}
