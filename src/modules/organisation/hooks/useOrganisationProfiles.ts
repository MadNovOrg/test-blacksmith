import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gql, useQuery } from 'urql'

import {
  CertificateStatus,
  GetOrganizationProfilesQuery,
  GetOrganizationProfilesQueryVariables,
} from '@app/generated/graphql'
import { ALL_ORGS } from '@app/util'

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
          upcomingEnrollments {
            orgId
            orgName
            courseLevel
          }
          organizations {
            id
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
            participant {
              certificateChanges {
                payload {
                  note
                }
              }
            }
          }
          upcomingEnrollments {
            orgId
            orgName
            courseLevel
            course {
              id
              course_code
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
}

export default function useOrganisationProfiles({
  orgId,
  profileId,
  showAll,
}: UserOrgProfiles) {
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
      },
    },
  })

  useEffect(() => {
    reexecute()
  }, [useEffectDependency, reexecute])

  return useMemo(
    () => ({
      profilesByOrganisation: new Map(
        data?.profiles?.profilesByOrganisation?.map(profile => [
          profile?.orgId,
          profile?.profiles,
        ])
      ),
      profilesByLevel: new Map(
        (data?.profiles?.profilesByLevel ?? []).map(profile => [
          profile?.level,
          profile?.profiles,
        ])
      ),
      error,
      fetching,
    }),
    [
      data?.profiles?.profilesByLevel,
      data?.profiles?.profilesByOrganisation,
      error,
      fetching,
    ]
  )
}
