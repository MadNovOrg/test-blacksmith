import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  GetOrganisationDetailsQuery,
  GetOrganisationDetailsQueryVariables,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'
import { SHALLOW_ORGANIZATION, ORGANIZATION } from '@app/queries/fragments'
import { ALL_ORGS } from '@app/util'
export const GET_ORGANISATION_DETAILS_QUERY = gql`
  ${SHALLOW_ORGANIZATION}
  ${ORGANIZATION}
  query GetOrganisationDetails(
    $where: organization_bool_exp = {}
    $shallow: Boolean! = false
    $detailed: Boolean! = false
    $limit: Int
    $offset: Int
    $sort: [organization_order_by!] = { name: asc }
    $specificOrgId: uuid
    $withSpecificOrganisation: Boolean = false
    $withMembers: Boolean = false
  ) {
    orgs: organization(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $sort
    ) {
      ...ShallowOrganization @include(if: $shallow)
      ...Organization @include(if: $detailed)
      region
      members @include(if: $withMembers) {
        profile {
          lastActivity
        }
      }
    }
    specificOrg: organization(where: { id: { _eq: $specificOrgId } })
      @include(if: $withSpecificOrganisation) {
      ...ShallowOrganization @include(if: $shallow)
      ...Organization @include(if: $detailed)
    }
    orgsCount: organization_aggregate {
      aggregate {
        count
      }
    }
  }
`
type UseOrgV2Input = {
  orgId?: string
  shallow?: boolean
  showAll?: boolean
  profileId?: string
  limit?: number
  offset?: number
  specificOrgId?: string
  withSpecificOrganisation?: boolean
  where?: Record<string, unknown>
  sorting?: Sorting
  withMembers?: boolean
}

export default function useOrgV2({
  orgId = ALL_ORGS,
  shallow = false,
  showAll,
  profileId,
  limit = 24,
  offset,
  specificOrgId,
  withSpecificOrganisation,
  where,
  sorting,
  withMembers = false,
}: UseOrgV2Input) {
  let conditions
  if (orgId !== ALL_ORGS) {
    conditions = { id: { _eq: orgId } }
  } else {
    conditions = showAll
      ? {}
      : {
          members: {
            _and: [
              {
                profile_id: {
                  _eq: profileId,
                },
              },
              { isAdmin: { _eq: true } },
            ],
          },
        }
  }

  const orderBy = sorting ? { [sorting.by]: sorting.dir } : undefined

  const [{ data, error, fetching }, reexecute] = useQuery<
    GetOrganisationDetailsQuery,
    GetOrganisationDetailsQueryVariables
  >({
    query: GET_ORGANISATION_DETAILS_QUERY,
    variables: {
      where: where ?? conditions,
      shallow,
      detailed: !shallow,
      limit,
      offset,
      specificOrgId,
      withSpecificOrganisation,
      sort: orderBy,
      withMembers,
    },
  })

  return useMemo(
    () => ({
      data,
      error,
      fetching,
      reexecute,
    }),
    [data, error, fetching, reexecute]
  )
}
