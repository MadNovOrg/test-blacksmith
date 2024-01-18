import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  Course_Level_Enum,
  GetOrganisationProfilesQuery,
  GetOrganisationProfilesQueryVariables,
  Profile,
} from '@app/generated/graphql'
import { CERTIFICATE_CHANGELOG } from '@app/queries/fragments'
import { CertificateStatus } from '@app/types'
import { ALL_ORGS, getProfileCertificationLevels } from '@app/util'

export const GET_PROFILES = gql`
  ${CERTIFICATE_CHANGELOG}
  query GetOrganisationProfiles(
    $where: organization_bool_exp = {}
    $whereProfileCertificates: course_certificate_bool_exp = {}
  ) {
    profiles: profile(
      where: {
        organizations: { organization: $where }
        archived: { _eq: false }
        certificates: $whereProfileCertificates
      }
    ) {
      id
      fullName
      avatar
      archived
      certificates(where: $whereProfileCertificates) {
        id
        courseLevel
        expiryDate
        status
        participant {
          certificateChanges(order_by: { createdAt: desc }) {
            ...CertificateChangelog
          }
        }
      }
      go1Licenses(where: { organization: $where }) {
        id
        expireDate
      }
      upcomingEnrollments {
        orgId
        orgName
        courseLevel
        courseId
        course {
          name
          course_code
        }
      }
      organizations {
        id
        position
        isAdmin
        profile {
          fullName
          avatar
          archived
        }
        organization {
          id
          name
        }
      }
    }
  }
`

type UserOrgProfiles = {
  orgId: string
  profileId?: string
  showAll?: boolean
  certificateFilter?: CertificateStatus[]
}

export default function useOrganisationProfiles({
  orgId,
  profileId,
  showAll,
  certificateFilter,
}: UserOrgProfiles) {
  const whereProfileCertificates = {
    _and: [
      {
        status: certificateFilter?.length
          ? { _in: certificateFilter }
          : { _neq: CertificateStatus.EXPIRED },
        isRevoked: { _eq: false },
      },
      {
        _or: [{ grade: { _is_null: true } }, { grade: { _neq: 'FAIL' } }],
      },
    ],
  }
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

  const [{ data, error, fetching }] = useQuery<
    GetOrganisationProfilesQuery,
    GetOrganisationProfilesQueryVariables
  >({
    query: GET_PROFILES,
    variables: {
      where: conditions,
      whereProfileCertificates,
    },
  })
  const profilesByOrganisation = useMemo(() => {
    const profilesByOrg = new Map<string, Profile[]>()
    data?.profiles.forEach(profile => {
      profile.organizations.forEach(orgMember => {
        const array = profilesByOrg.get(orgMember.organization.id) ?? []
        array.push(profile as Profile)
        profilesByOrg.set(orgMember.organization.id, array)
      })
    })
    return profilesByOrg
  }, [data])

  const profilesByLevel: Map<Course_Level_Enum | null, Profile[]> =
    useMemo(() => {
      const map = new Map<Course_Level_Enum | null, Profile[]>()
      if (data) {
        for (const profile of data.profiles) {
          const levels = getProfileCertificationLevels(
            profile.certificates as {
              courseLevel: string
              status: CertificateStatus
            }[]
          )
          for (const level of levels) {
            const profiles = map.get(level) ?? []
            profiles?.push(profile as Profile)
            map.set(level, profiles as Profile[])
          }
        }
      }
      return map
    }, [data])

  return useMemo(
    () => ({
      profilesByOrganisation,
      profilesByLevel,
      error,
      fetching,
    }),
    [error, fetching, profilesByLevel, profilesByOrganisation]
  )
}
