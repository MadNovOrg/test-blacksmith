import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gql, useQuery } from 'urql'

import {
  CertificateStatus,
  GetOrganizationProfilesQuery,
  GetOrganizationProfilesQueryVariables,
} from '@app/generated/graphql'
import { ALL_ORGS } from '@app/util'

import {
  filterOrganisationProfilesById,
  filterProfilesByEnrollments,
  profilesByLevelType,
} from '../utils'

export const GET_ORG_PROFILES = gql`
  query GetOrganizationProfiles($input: OrganizationProfilesInput!) {
    profiles: getOrganizationProfiles(input: $input) {
      profilesByOrganisation {
        orgId
        profiles {
          id
          fullName
          archived
          avatar
          certificates {
            courseLevel
            status
            expiryDate
          }
        }
      }
      profilesByLevel {
        level
        profiles {
          id
          fullName
          certificates {
            courseLevel
            status
            expiryDate
          }
          upcomingEnrollments {
            orgId
            orgName
            courseLevel
            course {
              id
              course_code
              schedule {
                start
                end
              }
            }
          }
          organizations {
            id
            position
            organization {
              id
              name
            }
          }
        }
      }
    }
  }
`

type UserOrgProfiles = {
  orgId: string
  profileId?: string
  showAll?: boolean
  withUpcomingEnrollmentsOnly?: boolean
  limit?: number
  offset?: number
  pause?: boolean
}

export const useOrganisationProfiles = ({
  orgId,
  profileId,
  showAll,
  withUpcomingEnrollmentsOnly,
  limit,
  offset,
  pause,
}: UserOrgProfiles) => {
  const [params] = useSearchParams()
  const certificateFilter = params.getAll('status') as CertificateStatus[]
  const useEffectDependency = JSON.stringify(certificateFilter)
  const [{ data, error, fetching }, reexecute] = useQuery<
    GetOrganizationProfilesQuery,
    GetOrganizationProfilesQueryVariables
  >({
    query: GET_ORG_PROFILES,
    variables: {
      input: {
        orgId: orgId === ALL_ORGS ? undefined : orgId,
        profileId,
        certificateFilter,
        showAll,
        limit,
        offset,
      },
    },
    pause: pause ?? false,
  })

  useEffect(() => {
    reexecute()
  }, [useEffectDependency, reexecute])

  const profilesByLvl = useMemo(() => {
    const profiles = new Map(
      (data?.profiles?.profilesByLevel ?? []).map(profile => [
        profile?.level,
        profile?.profiles,
      ]),
    )

    if (withUpcomingEnrollmentsOnly)
      return filterProfilesByEnrollments(profiles as profilesByLevelType)

    return profiles
  }, [data?.profiles?.profilesByLevel, withUpcomingEnrollmentsOnly])

  const profilesByOrganisation = useMemo(() => {
    const orgs = new Map(
      data?.profiles?.profilesByOrganisation?.map(profile => [
        profile?.orgId,
        profile?.profiles,
      ]),
    )

    if (withUpcomingEnrollmentsOnly)
      return filterOrganisationProfilesById(
        orgs as profilesByLevelType,
        profilesByLvl as profilesByLevelType,
      )

    return orgs
  }, [
    data?.profiles?.profilesByOrganisation,
    profilesByLvl,
    withUpcomingEnrollmentsOnly,
  ])

  return useMemo(
    () => ({
      profilesByOrganisation: profilesByOrganisation,
      profilesByLevel: profilesByLvl,
      error,
      fetching,
    }),
    [error, fetching, profilesByLvl, profilesByOrganisation],
  )
}
