import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  GetOrganisationDetailsQuery,
  GetOrganisationDetailsQueryVariables,
} from '@app/generated/graphql'
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
  ) {
    orgs: organization(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $sort
    ) {
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
}

export default function useOrgV2({
  orgId = ALL_ORGS,
  shallow = false,
  showAll,
  profileId,
  limit = 24,
  offset,
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

  const [{ data, error, fetching }, reexecute] = useQuery<
    GetOrganisationDetailsQuery,
    GetOrganisationDetailsQueryVariables
  >({
    query: GET_ORGANISATION_DETAILS_QUERY,
    variables: {
      where: conditions,
      shallow,
      detailed: !shallow,
      limit,
      offset,
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
