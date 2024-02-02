import { useMemo } from 'react'

import {
  CertificateStatus,
  CourseLevel,
  GetOrganisationDetailsQuery,
  OrganizationProfile,
} from '@app/generated/graphql'
import { getProfileCertificationLevels } from '@app/util'

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
  profilesByOrg: Map<string, OrganizationProfile[]>
  organisations?: GetOrganisationDetailsQuery['orgs']
}

export default function useOrganisationStats({
  profilesByOrg,
  organisations,
}: UseOrganisationStats) {
  const profiles = [...profilesByOrg.values()]

  const allOrganisationsProfiles = profiles.flat(1)

  const stats = useMemo(() => {
    const perOrg: { [orgId: string]: OrgStats } = {
      all: {
        ...crunchStats([
          ...new Set(allOrganisationsProfiles),
        ] as OrganizationProfile[]),
      },
    }
    organisations?.forEach(org => {
      perOrg[org.id] = {
        ...crunchStats(profilesByOrg?.get(org.id) ?? []),
      }
    })
    return perOrg
  }, [allOrganisationsProfiles, organisations, profilesByOrg])
  return useMemo(() => ({ stats }), [stats])
}

function crunchStats(profiles: OrganizationProfile[]) {
  return {
    profiles: {
      count: profiles?.length ?? 0,
    },
    certificates: {
      active: getCountByStatus(CertificateStatus.Active, profiles ?? []),
      expiringSoon: getCountByStatus(
        CertificateStatus.ExpiringSoon,
        profiles ?? []
      ),
      expired: getCountByStatus(
        CertificateStatus.ExpiredRecently,
        profiles ?? []
      ),
      hold: getCountByStatus(CertificateStatus.OnHold, profiles ?? []),
      revoked: getCountByStatus(CertificateStatus.Revoked, profiles ?? []),
    },
  }
}

function getCountByStatus(
  status: CertificateStatus,
  profiles: OrganizationProfile[]
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
          certificate?.status === status &&
          levels.indexOf(certificate.courseLevel as CourseLevel) !== -1
      )
      const enrolled = certs?.filter(cert =>
        profile.upcomingEnrollments?.some(
          enrollment => enrollment?.courseLevel === cert?.courseLevel
        )
      )
      return {
        count: acc.count + Number(certs?.length ?? 0),
        enrolled: acc.enrolled + Number(enrolled?.length ?? 0),
      }
    },
    {
      count: 0,
      enrolled: 0,
    }
  )
}
