import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CountPanel } from '@app/components/CountPanel'
import { SelectableCountPanel } from '@app/components/SelectableCountPanel/SelectableCountPanel'
import { useAuth } from '@app/context/auth'
import { CertificateStatus, OrganizationProfile } from '@app/generated/graphql'
import { useOrganisationProfiles } from '@app/modules/organisation/hooks/useOrganisationProfiles'
import { useOrgMembers } from '@app/modules/organisation/hooks/useOrgMembers'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { noop } from '@app/util'

import useOrganisationStats from '../../hooks/useOrganisationStats'

export type OrgStatsTilesParams = {
  orgId: string
  selected?: CertificateStatus[]
  onTileSelect?: (selectedTile: CertificateStatus | null) => void
}

export const OrgStatsTiles: React.FC<
  React.PropsWithChildren<OrgStatsTilesParams>
> = ({ orgId, selected = [], onTileSelect = noop }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const showAllOrgs = acl.canViewAllOrganizations()

  const { profilesByOrganisation } = useOrganisationProfiles({
    orgId,
    profileId: profile?.id,
    showAll: showAllOrgs,
    withUpcomingEnrollmentsOnly: true,
  })

  const { data } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: showAllOrgs,
    shallow: true,
  })

  const { stats } = useOrganisationStats({
    profilesByOrg: profilesByOrganisation as Map<string, OrganizationProfile[]>,
    organisations: data?.orgs,
  })

  const { total, fetching: totalMembersFetching } = useOrgMembers({
    orgId,
    withMembers: false,
  })

  return (
    <Grid container>
      <Grid item xs={12} md={12} p={1} borderRadius={1}>
        <CountPanel
          fetching={totalMembersFetching}
          count={total ?? 0}
          label={t('pages.org-details.tabs.overview.total-individuals')}
          tooltip={t(
            'pages.org-details.tabs.overview.all-organisation-members'
          )}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          count={stats[orgId]?.certificates.active.count}
          chip={{
            label: t('pages.org-details.tabs.overview.active'),
            color: 'success',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: stats[orgId]?.certificates.active.enrolled,
          })}
          tooltip={t(
            'pages.org-details.tabs.overview.members-with-active-certificates'
          )}
          onClick={() => onTileSelect(CertificateStatus.Active)}
          selected={selected.includes(CertificateStatus.Active)}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          count={stats[orgId]?.certificates.hold.count}
          chip={{
            label: t('pages.org-details.tabs.overview.on-hold'),
            color: 'warning',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: stats[orgId]?.certificates.hold.enrolled,
          })}
          onClick={() => onTileSelect(CertificateStatus.OnHold)}
          selected={selected.includes(CertificateStatus.OnHold)}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          count={stats[orgId]?.certificates.expiringSoon.count}
          chip={{
            label: t('pages.org-details.tabs.overview.expiring-soon'),
            color: 'warning',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: stats[orgId]?.certificates.expiringSoon.enrolled,
          })}
          tooltip={t(
            'pages.org-details.tabs.overview.members-with-certificates-to-expire'
          )}
          onClick={() => onTileSelect(CertificateStatus.ExpiringSoon)}
          selected={selected.includes(CertificateStatus.ExpiringSoon)}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3} p={1} borderRadius={1}>
        <SelectableCountPanel
          count={stats[orgId]?.certificates.expired.count}
          chip={{
            label: t('pages.org-details.tabs.overview.expired-recently'),
            color: 'error',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: stats[orgId]?.certificates.expired.enrolled,
          })}
          tooltip={t(
            'pages.org-details.tabs.overview.members-with-expired-certificates'
          )}
          onClick={() => onTileSelect(CertificateStatus.ExpiredRecently)}
          selected={selected.includes(CertificateStatus.ExpiredRecently)}
        />
      </Grid>
    </Grid>
  )
}
