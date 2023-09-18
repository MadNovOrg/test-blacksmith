import { gql, useQuery } from 'urql'

import {
  Order_By,
  OrgMembersQuery,
  OrgMembersQueryVariables,
  Organization_Member_Order_By,
  Course_Certificate_Bool_Exp,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'
import { CertificateStatus, SortOrder } from '@app/types'
import { DEFAULT_PAGINATION_LIMIT } from '@app/util'

export const MEMBERS_QUERY = gql`
  query OrgMembers(
    $offset: Int!
    $limit: Int!
    $orgId: uuid!
    $orderBy: [organization_member_order_by!] = [
      { profile: { createdAt: desc } }
    ]
    $whereProfileCertificates: course_certificate_bool_exp = {}
  ) {
    members: organization_member(
      limit: $limit
      offset: $offset
      where: {
        organization_id: { _eq: $orgId }
        profile: { certificates: $whereProfileCertificates }
      }
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
  certificateFilter,
}: {
  perPage?: number
  offset?: number
  orgId: string
  sort?: {
    dir: SortOrder
    by: string
  }
  certificateFilter?: CertificateStatus[]
}) {
  const orderBy = getOrderBy(sort)

  const whereProfileCertificates = {
    _and: [
      certificateFilter?.length
        ? { _and: [{ status: { _in: certificateFilter } }] }
        : {},
      {
        participant: {
          _or: [
            { id: { _is_null: true } },
            { grade: { _neq: 'FAIL' } },
          ] as Course_Certificate_Bool_Exp[],
        },
      },
    ],
  }

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
      whereProfileCertificates,
    },
  })

  return {
    members: data?.members,
    fetching,
    total: data?.organization_member_aggregate?.aggregate?.count,
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
