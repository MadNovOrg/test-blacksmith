import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  Course_Level_Enum,
  GetOrganisationDetailsQuery,
  GetOrganisationStatsQuery,
  GetOrganisationStatsQueryVariables,
  Profile,
} from '@app/generated/graphql'
import { CERTIFICATE_CHANGELOG } from '@app/queries/fragments'
import { CertificateStatus } from '@app/types'
import { ALL_ORGS, getProfileCertificationLevels } from '@app/util'

export const GET_ORGANISATION_STATS = gql`
  ${CERTIFICATE_CHANGELOG}
  query GetOrganisationStats(
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
    }
    pendingInvitesCount: organization_invites_aggregate(
      where: {
        _and: [{ status: { _eq: "PENDING" } }, { organization: $where }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`

type OrgStats = {
  profiles: {
    count: number
  }
  certificates: {
    active: { count: number; enrolled: number }
    expiringSoon: { count: number; enrolled: number }
    expired: { count: number; enrolled: number }
    hold: { count: number; enrolled: number }
    revoked: { count: number; enrolled: number }
  }
  pendingInvites?: {
    count: number
  }
}

type UseOrganisationStats = {
  orgId?: string
  profilesByOrg?: Map<string, Profile[]>
  organisations?: GetOrganisationDetailsQuery['orgs']
  showAll?: boolean
  profileId?: string
  certificateFilter?: CertificateStatus[]
}

export default function useOrganisationStats({
  orgId = ALL_ORGS,
  profilesByOrg,
  organisations,
  showAll,
  profileId,
  certificateFilter,
}: UseOrganisationStats) {
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

  const [{ data, fetching, error }] = useQuery<
    GetOrganisationStatsQuery,
    GetOrganisationStatsQueryVariables
  >({
    query: GET_ORGANISATION_STATS,
    variables: { where: conditions, whereProfileCertificates },
    pause: !profilesByOrg || !organisations || !profileId,
  })

  const stats = useMemo(() => {
    const perOrg: { [orgId: string]: OrgStats } = {
      all: {
        ...crunchStats(data?.profiles as GetOrganisationStatsQuery['profiles']),
        pendingInvites: {
          count: data?.pendingInvitesCount.aggregate?.count ?? 0,
        },
      },
    }
    organisations?.forEach(org => {
      perOrg[org.id] = {
        ...crunchStats(profilesByOrg?.get(org.id) ?? []),
        pendingInvites: {
          count: data?.pendingInvitesCount.aggregate?.count ?? 0,
        },
      }
    })
    return perOrg
  }, [
    data?.pendingInvitesCount.aggregate?.count,
    data?.profiles,
    organisations,
    profilesByOrg,
  ])
  return useMemo(() => ({ stats, fetching, error }), [error, fetching, stats])
}

function crunchStats(profiles: GetOrganisationStatsQuery['profiles']) {
  return {
    profiles: {
      count: profiles?.length ?? 0,
    },
    certificates: {
      active: getCountByStatus(CertificateStatus.ACTIVE, profiles ?? []),
      expiringSoon: getCountByStatus(
        CertificateStatus.EXPIRING_SOON,
        profiles ?? []
      ),
      expired: getCountByStatus(
        CertificateStatus.EXPIRED_RECENTLY,
        profiles ?? []
      ),
      hold: getCountByStatus(CertificateStatus.ON_HOLD, profiles ?? []),
      revoked: getCountByStatus(CertificateStatus.REVOKED, profiles ?? []),
    },
  }
}

function getCountByStatus(
  status: CertificateStatus,
  profiles: GetOrganisationStatsQuery['profiles']
) {
  return profiles.reduce(
    (acc, profile) => {
      const levels = getProfileCertificationLevels(
        profile.certificates as {
          courseLevel: string
          status: CertificateStatus
        }[]
      )
      const certs = profile.certificates?.filter(
        certificate =>
          certificate.status === status &&
          levels.indexOf(certificate.courseLevel as Course_Level_Enum) !== -1
      )
      const enrolled = certs?.filter(cert =>
        profile.upcomingEnrollments.some(
          enrollment => enrollment.courseLevel === cert.courseLevel
        )
      )
      return {
        count: acc.count + certs?.length,
        enrolled: acc.enrolled + enrolled?.length,
      }
    },
    {
      count: 0,
      enrolled: 0,
    }
  )
}
