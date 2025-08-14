import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { gql, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Certificate_Status_Enum,
  Course_Level_Enum,
  CourseLevel,
  GetProfilesWithCertificationsQuery,
  GetProfilesWithCertificationsQueryVariables,
} from '@app/generated/graphql'
import { getCertificatesChain } from '@app/util'

export const GET_PROFILES_WITH_CERTIFICATIONS = gql`
  query GetProfilesWithCertifications(
    $whereOrganizations: organization_bool_exp = {}
    $whereProfileCertificates: course_certificate_bool_exp = {}
    $limit: Int
    $offset: Int
  ) {
    profiles: profile(
      where: {
        organizations: { organization: $whereOrganizations }
        archived: { _eq: false }
        certificates: $whereProfileCertificates
      }
      limit: $limit
      offset: $offset
    ) {
      id
      fullName
      avatar
      archived
      certificates(where: $whereProfileCertificates) {
        id
        courseLevel
        status
        expiryDate
      }
    }
    profiles_aggregate: profile_aggregate(
      where: {
        organizations: { organization: $whereOrganizations }
        archived: { _eq: false }
        certificates: $whereProfileCertificates
      }
    ) {
      aggregate {
        count
      }
    }
  }
`

export const useOrganisationProfilesByCertificateLevel = () => {
  const {
    profile,
    acl: { canViewAllOrganizations },
  } = useAuth()
  const [params] = useSearchParams()
  const { id: organisationId } = useParams()

  const certificateFilter = params.getAll('status') as Certificate_Status_Enum[]

  const showAll = canViewAllOrganizations()

  const certificatesCondition = useMemo(() => {
    return {
      _and: [
        {
          status: certificateFilter?.length
            ? { _in: certificateFilter }
            : { _neq: Certificate_Status_Enum.Expired },
          isRevoked: { _eq: false },
        },
        {
          _or: [{ grade: { _is_null: true } }, { grade: { _neq: 'FAIL' } }],
        },
        {
          _or: [
            { participant: { completed_evaluation: { _eq: true } } },
            { legacyCourseCode: { _is_null: false, _neq: '' } },
          ],
        },
      ],
    }
  }, [certificateFilter])

  const organisationsCondition = useMemo(() => {
    if (organisationId && organisationId !== 'all') {
      return { id: { _eq: organisationId } }
    }
    if (showAll) return {}
    return {
      _or: [
        {
          members: {
            _and: [
              {
                profile_id: {
                  _eq: profile?.id,
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
                    _eq: profile?.id,
                  },
                },
                { isAdmin: { _eq: true } },
              ],
            },
          },
        },
      ],
    }
  }, [organisationId, profile, showAll])

  const [{ data, fetching }] = useQuery<
    GetProfilesWithCertificationsQuery,
    GetProfilesWithCertificationsQueryVariables
  >({
    query: GET_PROFILES_WITH_CERTIFICATIONS,
    variables: {
      whereOrganizations: organisationsCondition,
      whereProfileCertificates: certificatesCondition,
    },
    requestPolicy: 'cache-first',
  })

  const profiles = data?.profiles

  const profilesByLevel = useMemo(() => {
    const map = new Map<
      Course_Level_Enum | CourseLevel | null,
      GetProfilesWithCertificationsQuery['profiles'][0][]
    >()
    if (profiles) {
      for (const profile of profiles) {
        const certificatesChain = getCertificatesChain(
          profile.certificates.map(cert => ({
            id: cert.id,
            level: cert.courseLevel as Course_Level_Enum,
            status: cert.status as Certificate_Status_Enum,
          })),
        )

        const levelsSet = new Set(certificatesChain.map(cert => cert.level))

        for (const level of levelsSet) {
          const profiles = map.get(level) ?? []
          profiles?.push(profile)
          map.set(level, profiles)
        }
      }
    }
    return map
  }, [profiles])

  return { profilesByLevel, fetching }
}
