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

type ProfileType = GetOrgDetailsQuery['profiles'][0]

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

export default function useOrg(orgId?: string, profileId?: string) {
  const { data, error, mutate } = useSWR<
    GetOrgDetailsQuery,
    Error,
    [string, GetOrgDetailsQueryVariables] | null
  >(
    profileId
      ? [
          QUERY,
          orgId !== 'all'
            ? {
                where: { id: { _eq: orgId } },
              }
            : {
                where: {
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

  const stats = useMemo(() => {
    return {
      profiles: {
        count: data?.profiles.length ?? 0,
      },
      certificates: {
        active: getCountByStatus(CertificateStatus.ACTIVE, data?.profiles),
        expiringSoon: getCountByStatus(
          CertificateStatus.EXPIRING_SOON,
          data?.profiles
        ),
        expired: getCountByStatus(
          CertificateStatus.EXPIRED_RECENTLY,
          data?.profiles
        ),
      },
      pendingInvites: {
        count: data?.pendingInvitesCount?.aggregate?.count ?? 0,
      },
    }
  }, [data])

  return {
    data: data?.orgs,
    profiles: data?.profiles,
    profilesByLevel,
    stats,
    error,
    status,
    loading: status === LoadingStatus.FETCHING,
    mutate,
  }
}
