import { gql, useQuery } from 'urql'

import {
  Certificate_Status_Enum,
  Grade_Enum,
  Order_By,
  OrgMembersQuery,
  OrgMembersQueryVariables,
  Organization_Member_Order_By,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'
import { SortOrder } from '@app/types'
import { ALL_ORGS, DEFAULT_PAGINATION_LIMIT } from '@app/util'

export const MEMBERS_QUERY = gql`
  query OrgMembers(
    $offset: Int!
    $limit: Int!
    $orgId: uuid!
    $orderBy: [organization_member_order_by!] = [
      { profile: { createdAt: desc } }
    ]
    $whereProfile: profile_bool_exp = {}
    $withMembers: Boolean = true
    $all: Boolean = true
    $singularOrg: Boolean = false
    $certStatus: certificate_status_enum
  ) {
    members: organization_member(
      limit: $limit
      offset: $offset
      where: { organization_id: { _eq: $orgId }, profile: $whereProfile }
      order_by: $orderBy
    ) @include(if: $withMembers) {
      id
      profile {
        id
        fullName
        lastActivity
        createdAt
        go1Licenses {
          expireDate
        }
        certificates(
          where: {
            _and: [
              {status: { _neq: $certStatus }, isRevoked: { _eq: false } }
              {
                _or: [{ grade: { _is_null: true } }, { grade: { _neq: "${Grade_Enum.Fail}" } }]
              }
              {
              _or: [
                { participant: { completed_evaluation: { _eq: true } } },
                { legacyCourseCode: { _is_null: false, _neq: "" } },
              ],
            },
            ]
          }
        ) {
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

    organization_member_aggregate @include(if: $all) {
      aggregate {
        count
      }
    }
    single_organization_members_count: organization_member_aggregate(where: {organization_id:{_eq: $orgId}}) @include(if: $singularOrg) {
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
  certificateFilter,
  withMembers,
}: {
  perPage?: number
  offset?: number
  orgId: string
  sort?: {
    dir: SortOrder
    by: string
  }
  certificateFilter?: Certificate_Status_Enum[]
  withMembers?: boolean
}) {
  const orderBy = getOrderBy(sort)

  const whereProfile = certificateFilter?.length
    ? { certificates: { _and: [{ status: { _in: certificateFilter } }] } }
    : {}

  const [{ data, fetching }, refetch] = useQuery<
    OrgMembersQuery,
    OrgMembersQueryVariables
  >({
    requestPolicy: 'cache-and-network',
    query: MEMBERS_QUERY,
    variables: {
      limit: perPage,
      offset: offset,
      orgId,
      orderBy,
      whereProfile,
      withMembers,
      all: orgId === ALL_ORGS,
      singularOrg: orgId !== ALL_ORGS,
      certStatus: Certificate_Status_Enum.Expired,
    },
  })

  return {
    members: data?.members,
    fetching,
    total:
      orgId === ALL_ORGS
        ? data?.organization_member_aggregate?.aggregate?.count
        : data?.single_organization_members_count.aggregate?.count,
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
