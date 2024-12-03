import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  Course_Type_Enum,
  GetOrganisationDetailsQuery,
  GetOrganisationDetailsQueryVariables,
  Organization_Bool_Exp,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'
import {
  SHALLOW_ORGANIZATION,
  ORGANIZATION,
  ESTABLISHMENT,
} from '@app/queries/fragments'
import { RoleName } from '@app/types'
import { ALL_ORGS } from '@app/util'

export const GET_ORGANISATION_DETAILS_QUERY = gql`
  ${SHALLOW_ORGANIZATION}
  ${ORGANIZATION}
  ${ESTABLISHMENT}
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
    $withAggregateData: Boolean = false
    $withDfEEstablishment: Boolean = false
    $withMainOrganisation: Boolean = false
  ) {
    orgs: organization(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $sort
    ) {
      ...ShallowOrganization @include(if: $shallow)
      ...Organization @include(if: $detailed)
      dfeEstablishmentId
      dfeEstablishment: organization_dfe_establishment
        @include(if: $withDfEEstablishment) {
        ...Establishment
      }
      region
      main_organisation @include(if: $withMainOrganisation) {
        id
        name
      }
      members @include(if: $withMembers) {
        profile {
          lastActivity
        }
      }
      members_aggregate @include(if: $withAggregateData) {
        aggregate {
          count
        }
      }
      organization_courses_aggregate @include(if: $withAggregateData) {
        aggregate {
          count
        }
      }
      organization_orders_aggregate @include(if: $withAggregateData) {
        aggregate {
          count
        }
      }
    }
    specificOrg: organization(where: { id: { _eq: $specificOrgId } })
      @include(if: $withSpecificOrganisation) {
      ...ShallowOrganization @include(if: $shallow)
      ...Organization @include(if: $detailed)
      dfeEstablishmentId
      dfeEstablishment: organization_dfe_establishment
        @include(if: $withDfEEstablishment) {
        ...Establishment
      }
      region
      main_organisation @include(if: $withMainOrganisation) {
        id
        name
      }
      members @include(if: $withMembers) {
        profile {
          lastActivity
        }
      }
      members_aggregate @include(if: $withAggregateData) {
        aggregate {
          count
        }
      }
      organization_courses_aggregate @include(if: $withAggregateData) {
        aggregate {
          count
        }
      }
      organization_orders_aggregate @include(if: $withAggregateData) {
        aggregate {
          count
        }
      }
    }
    orgsCount: organization_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
type UseOrgV2Input = {
  contact?: RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
  limit?: number
  offset?: number
  orgId?: string
  profileEmail?: string
  profileId?: string
  shallow?: boolean
  showAll?: boolean
  sorting?: Sorting
  specificOrgId?: string
  where?: Record<string, unknown>
  withAggregateData?: boolean
  withMembers?: boolean
  withSpecificOrganisation?: boolean
  withDfEEstablishment?: boolean
  withMainOrganisation?: boolean
}

export default function useOrgV2({
  contact,
  limit = 24,
  offset,
  orgId = ALL_ORGS,
  profileEmail,
  profileId,
  shallow = false,
  showAll,
  sorting,
  specificOrgId,
  where,
  withAggregateData = false,
  withMembers = false,
  withSpecificOrganisation,
  withDfEEstablishment = false,
  withMainOrganisation = true,
}: UseOrgV2Input) {
  let conditions: Organization_Bool_Exp = {}
  if (orgId !== ALL_ORGS) {
    conditions = { id: { _eq: orgId } }
  } else {
    withAggregateData = false

    if (showAll) {
      conditions = {}
    } else if (!contact) {
      conditions = {
        _or: [
          {
            members: {
              _and: [
                { profile_id: { _eq: profileId } },
                { isAdmin: { _eq: true } },
              ],
            },
          },
          {
            main_organisation: {
              members: {
                _and: [
                  { profile_id: { _eq: profileId } },
                  { isAdmin: { _eq: true } },
                ],
              },
            },
          },
        ],
      }
    } else {
      switch (contact) {
        case RoleName.BOOKING_CONTACT:
          conditions = {
            organization_courses: {
              _or: [
                { bookingContact: { id: { _eq: profileId } } },
                {
                  _and: [
                    { type: { _eq: Course_Type_Enum.Open } },
                    {
                      participants: {
                        order: {
                          bookingContact: {
                            _contains: {
                              email: profileEmail,
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          }
          break
        case RoleName.ORGANIZATION_KEY_CONTACT:
          conditions = {
            organization_courses: {
              organizationKeyContact: { id: { _eq: profileId } },
            },
          }
          break
      }
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
      withAggregateData,
      withDfEEstablishment,
      withMainOrganisation,
    },
  })

  return useMemo(
    () => ({
      data,
      error,
      fetching,
      reexecute,
    }),
    [data, error, fetching, reexecute],
  )
}
