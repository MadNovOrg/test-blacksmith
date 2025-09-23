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
    $withActiveIndirectBLCourses: Boolean = false
    $withMembers: Boolean = false
  ) {
    organizations: organization(
      where: { main_organisation_id: { _eq: $mainOrgId } }
      limit: $limit
      offset: $offset
    ) {
      id
      activeIndirectBLCourses: organization_courses(
        where: {
          _or: [
            { status: { _neq: COMPLETED } }
            { course_invites: { status: { _eq: PENDING } } }
          ]
          go1Integration: { _eq: true }
          type: { _eq: INDIRECT }
        }
      ) @include(if: $withActiveIndirectBLCourses) {
        id
        course_code
        status
        pendingInvites: course_invites_aggregate(
          where: { status: { _eq: PENDING } }
        ) {
          aggregate {
            count
          }
        }
      }
      address
      createdAt
      members @include(if: $withMembers) {
        profile {
          lastActivity
        }
      }
      name
      sector
    }
  }
`

export default function useAffiliatedOrganisations({
  limit,
  mainOrgId,
  offset,
  withActiveIndirectBLCourses,
  withMembers,
}: {
  limit: number
  mainOrgId: string
  offset: number
  withActiveIndirectBLCourses: boolean
  withMembers: boolean
}) {
  const [{ data, error, fetching: loading }, reexecute] = useQuery<
    GetAffiliatedOrganisationsQuery,
    GetAffiliatedOrganisationsQueryVariables
  >({
    query: GET_AFFILIATED_ORGANISATIONS_QUERY,
    variables: {
      limit,
      mainOrgId,
      offset,
      withActiveIndirectBLCourses,
      withMembers,
    },
  })

  return useMemo(
    () => ({ data, error, loading, reexecute }),
    [data, error, loading, reexecute],
  )
}
