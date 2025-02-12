import { Grid } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateStatus } from '@app/generated/graphql'
import { CountPanel } from '@app/modules/organisation/components/CountPanel'
import { SelectableCountPanel } from '@app/modules/organisation/components/SelectableCountPanel/SelectableCountPanel'
import { ALL_ORGS, noop } from '@app/util'

import { useAllOrganizationProfiles } from '../../hooks/useAllOrgMembersProfiles'
import { useIndividualOrganizationStatistics } from '../../hooks/useIndividualOrganizationStatistics'
import { useAllOrganisationStatistics } from '../../hooks/useOrganizationStatistics'
import { useUpcomingEnrollmentsStats } from '../../hooks/useUpcomingEnrollmentsStats'

export type OrgStatsTilesParams = {
  orgId: string
  selected?: CertificateStatus[]
  onTileSelect?: (selectedTile: CertificateStatus | null) => void
}

export const OrgStatsTiles: React.FC<
  React.PropsWithChildren<OrgStatsTilesParams>
> = ({ orgId, selected = [], onTileSelect = noop }) => {
  const { t } = useTranslation()
  const isAllOrgs = orgId === ALL_ORGS

  const { data: orgMemberIds } = useAllOrganizationProfiles(orgId, isAllOrgs)

  const profileIds = useMemo(() => {
    return orgMemberIds?.organization_member.map(m => m?.profile_id)
  }, [orgMemberIds])

  const where = useMemo(() => {
    const whereCondition: Record<string, object> = {
      profileId: isAllOrgs ? {} : { _in: profileIds },
    }
    return whereCondition
  }, [isAllOrgs, profileIds])

  const { data: enrollmentStats } = useUpcomingEnrollmentsStats({
    where,
  })

  //If all organisations option is selected, fetch the aggregated counts for all organisations
  const { data: globalStatistics, fetching: fetchingAllOrgStats } =
    useAllOrganisationStatistics(!isAllOrgs)

  //If a specific org is selected, fetch the counts for that org
  const { data: orgStats, fetching: fetchingIndividualOrgStats } =
    useIndividualOrganizationStatistics([orgId], isAllOrgs)

  const orgStatistics = useMemo(() => {
    const map = new Map<string, number>()
    if (isAllOrgs) {
      map.set(
        'individuals',
        globalStatistics?.organizations_statistics_aggregate.aggregate?.sum
          ?.individuals ?? 0,
      )
      map.set(
        'active',
        globalStatistics?.organizations_statistics_aggregate.aggregate?.sum
          ?.active_certifications ?? 0,
      )
      map.set(
        'onHold',
        globalStatistics?.organizations_statistics_aggregate.aggregate?.sum
          ?.on_hold_certifications ?? 0,
      )
      map.set(
        'expiringSoon',
        globalStatistics?.organizations_statistics_aggregate.aggregate?.sum
          ?.expiring_soon_certifications ?? 0,
      )
      map.set(
        'expiredRecently',
        globalStatistics?.organizations_statistics_aggregate.aggregate?.sum
          ?.expired_recently_certifications ?? 0,
      )
    } else {
      map.set(
        'individuals',
        orgStats?.organizations_statistics[0]?.individuals ?? 0,
      )
      map.set(
        'active',
        orgStats?.organizations_statistics[0]?.active_certifications ?? 0,
      )
      map.set(
        'onHold',
        orgStats?.organizations_statistics[0]?.on_hold_certifications ?? 0,
      )
      map.set(
        'expiringSoon',
        orgStats?.organizations_statistics[0]?.expiring_soon_certifications ??
          0,
      )
      map.set(
        'expiredRecently',
        orgStats?.organizations_statistics[0]
          ?.expired_recently_certifications ?? 0,
      )
    }
    return map
  }, [
    globalStatistics?.organizations_statistics_aggregate.aggregate?.sum,
    isAllOrgs,
    orgStats?.organizations_statistics,
  ])

  return (
    <Grid container>
      <Grid item xs={12} md={12} p={1} borderRadius={1}>
        <CountPanel
          fetching={
            isAllOrgs ? fetchingAllOrgStats : fetchingIndividualOrgStats
          }
          testid="total-individuals"
          count={orgStatistics.get('individuals') ?? 0}
          label={t('pages.org-details.tabs.overview.total-individuals')}
          tooltip={t(
            'pages.org-details.tabs.overview.all-organisation-members',
          )}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          count={orgStatistics.get('active') ?? 0}
          chip={{
            label: t('pages.org-details.tabs.overview.active'),
            color: 'success',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: enrollmentStats?.active_enrollments.aggregate?.count,
          })}
          tooltip={t(
            'pages.org-details.tabs.overview.members-with-active-certificates',
          )}
          onClick={() => onTileSelect(CertificateStatus.Active)}
          selected={selected.includes(CertificateStatus.Active)}
          testid="active-certifications"
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          testid="on-hold-certifications"
          count={orgStatistics.get('onHold') ?? 0}
          chip={{
            label: t('pages.org-details.tabs.overview.on-hold'),
            color: 'warning',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: enrollmentStats?.on_hold_enrollments.aggregate?.count,
          })}
          onClick={() => onTileSelect(CertificateStatus.OnHold)}
          selected={selected.includes(CertificateStatus.OnHold)}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          testid="expiring-soon-certifications"
          count={orgStatistics.get('expiringSoon') ?? 0}
          chip={{
            label: t('pages.org-details.tabs.overview.expiring-soon'),
            color: 'warning',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: enrollmentStats?.expiring_soon_enrollments.aggregate?.count,
          })}
          tooltip={t(
            'pages.org-details.tabs.overview.members-with-certificates-to-expire',
          )}
          onClick={() => onTileSelect(CertificateStatus.ExpiringSoon)}
          selected={selected.includes(CertificateStatus.ExpiringSoon)}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          testid="expired-recently-certifications"
          count={orgStatistics.get('expiredRecently') ?? 0}
          chip={{
            label: t('pages.org-details.tabs.overview.expired-recently'),
            color: 'error',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count:
              enrollmentStats?.expired_recently_enrollments.aggregate?.count,
          })}
          tooltip={t(
            'pages.org-details.tabs.overview.members-with-expired-certificates',
          )}
          onClick={() => onTileSelect(CertificateStatus.ExpiredRecently)}
          selected={selected.includes(CertificateStatus.ExpiredRecently)}
        />
      </Grid>
    </Grid>
  )
}
