import { useMemo } from 'react'
import useSWR from 'swr'

import {
  GetOrgDetailsQuery,
  GetOrgDetailsQueryVariables,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/organization/get-org-details'
import { CertificateStatus, CourseLevel } from '@app/types'
import {
  getProfileCertificationLevels,
  getSWRLoadingStatus,
  LoadingStatus,
} from '@app/util'

export type ProfileType = GetOrgDetailsQuery['profiles'][0]

export const ALL_ORGS = 'all'

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

function crunchStats(profiles: ProfileType[] | undefined) {
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
  profiles?: GetOrgDetailsQuery['profiles']
) {
  if (!profiles) return { count: 0, enrolled: 0 }

  return profiles.reduce(
    (acc, profile) => {
      const levels = getProfileCertificationLevels(
        profile.certificates as {
          courseLevel: string
          status: CertificateStatus
        }[]
      )
      const certs = profile.certificates.filter(
        c =>
          c.status === status &&
          levels.indexOf(c.courseLevel as CourseLevel) !== -1
      )
      const enrolled = certs.filter(c =>
        profile.upcomingEnrollments.some(
          enrollment => enrollment.courseLevel === c.courseLevel
        )
      )
      return {
        count: acc.count + certs.length,
        enrolled: acc.enrolled + enrolled.length,
      }
    },
    {
      count: 0,
      enrolled: 0,
    }
  )
}

export default function useOrg(
  orgId: string,
  profileId?: string,
  showAll?: boolean,
  certificateFilter?: CertificateStatus[]
) {
  const whereProfileCertificates = certificateFilter?.length
    ? { _and: [{ status: { _in: certificateFilter } }] }
    : { status: { _neq: CertificateStatus.EXPIRED } }

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

  const { data, error, mutate } = useSWR<
    GetOrgDetailsQuery,
    Error,
    [string, GetOrgDetailsQueryVariables] | null
  >(
    profileId
      ? [
          QUERY,
          {
            where: conditions,
            whereProfileCertificates,
            certificates: whereProfileCertificates,
          },
        ]
      : null
  )

  const status = getSWRLoadingStatus(data, error)

  const profilesByLevel: Map<CourseLevel | null, ProfileType[]> =
    useMemo(() => {
      const map = new Map<CourseLevel | null, ProfileType[]>()
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
            profiles.push(profile)
            map.set(level, profiles)
          }
        }
      }
      return map
    }, [data])

  const profilesByOrg = useMemo(() => {
    const profilesByOrg = new Map<string, ProfileType[]>()
    data?.profiles.forEach(profile => {
      profile.organizations.forEach(orgMember => {
        const array = profilesByOrg.get(orgMember.organization.id) ?? []
        array.push(profile)
        profilesByOrg.set(orgMember.organization.id, array)
      })
    })
    return profilesByOrg
  }, [data])

  const stats = useMemo(() => {
    const perOrg: { [orgId: string]: OrgStats } = {
      all: {
        ...crunchStats(data?.profiles),
        pendingInvites: {
          count: data?.pendingInvitesCount.aggregate?.count ?? 0,
        },
      },
    }
    data?.orgs.forEach(org => {
      perOrg[org.id] = {
        ...crunchStats(profilesByOrg.get(org.id) ?? []),
        pendingInvites: {
          count: data?.pendingInvitesCount.aggregate?.count ?? 0,
        },
      }
    })
    return perOrg
  }, [data, profilesByOrg])

  return {
    data: data?.orgs,
    profiles: data?.profiles,
    profilesByLevel,
    profilesByOrg,
    stats,
    error,
    status,
    loading: status === LoadingStatus.FETCHING,
    mutate,
  }
}
