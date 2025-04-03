import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetProfilesWithOrganisationsQuery,
  GetProfilesWithOrganisationsQueryVariables,
} from '@app/generated/graphql'

export const GET_PROFILES_WITH_ORGANISATIONS = gql`
  query GetProfilesWithOrganisations(
    $ids: [uuid!]!
    $whereOrganizations: organization_bool_exp
  ) {
    profiles: profile(where: { id: { _in: $ids } }) {
      id
      organizations(where: { organization: $whereOrganizations }) {
        id
        position
        organization {
          id
          name
        }
      }
    }
  }
`

export const useProfilesWithOrganisations = ({ ids }: { ids: string[] }) => {
  const {
    profile,
    acl: { canViewAllOrganizations },
  } = useAuth()
  const { id: orgId } = useParams()

  const profileId = profile?.id
  const showAll = canViewAllOrganizations()

  const organizationsCondition = useMemo(() => {
    if (orgId && orgId !== 'all') return { id: { _eq: orgId } }
    if (showAll) return {}
    return {
      _or: [
        {
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
        },
        {
          main_organisation: {
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
          },
        },
      ],
    }
  }, [orgId, profileId, showAll])

  const [{ data, fetching }] = useQuery<
    GetProfilesWithOrganisationsQuery,
    GetProfilesWithOrganisationsQueryVariables
  >({
    query: GET_PROFILES_WITH_ORGANISATIONS,
    variables: {
      ids,
      whereOrganizations: organizationsCondition,
    },
  })

  const profiles = data?.profiles
  const profileWithOrganisationsMap = new Map<
    string,
    GetProfilesWithOrganisationsQuery['profiles'][0]
  >()

  profiles?.forEach(profile =>
    profileWithOrganisationsMap.set(profile.id, profile),
  )

  return { fetching, profileWithOrganisations: profileWithOrganisationsMap }
}
