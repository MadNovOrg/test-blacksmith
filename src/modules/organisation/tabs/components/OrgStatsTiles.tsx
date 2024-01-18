import { Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CountPanel } from '@app/components/CountPanel'
import { useOrgMembers } from '@app/components/OrgUsersTable/useOrgMembers'
import { SelectableCountPanel } from '@app/components/SelectableCountPanel/SelectableCountPanel'
import { useAuth } from '@app/context/auth'
import useOrganisationProfiles from '@app/modules/organisation/hooks/useOrganisationProfiles'
import useOrganisationStats from '@app/modules/organisation/hooks/useOrganisationStats'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { CertificateStatus } from '@app/types'
import { noop } from '@app/util'

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
  })

  const { data } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: showAllOrgs,
    shallow: true,
  })

  const { stats } = useOrganisationStats({
    profilesByOrg: profilesByOrganisation,
    organisations: data?.orgs,
    orgId,
    profileId: profile?.id,
    showAll: showAllOrgs,
  })

  const { total } = useOrgMembers({ orgId })

  return (
    <Grid container>
      <Grid item xs={12} md={12} p={1} borderRadius={1}>
        <CountPanel
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
          onClick={() => onTileSelect(CertificateStatus.ACTIVE)}
          selected={selected.includes(CertificateStatus.ACTIVE)}
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
          onClick={() => onTileSelect(CertificateStatus.ON_HOLD)}
          selected={selected.includes(CertificateStatus.ON_HOLD)}
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
          onClick={() => onTileSelect(CertificateStatus.EXPIRING_SOON)}
          selected={selected.includes(CertificateStatus.EXPIRING_SOON)}
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
          onClick={() => onTileSelect(CertificateStatus.EXPIRED_RECENTLY)}
          selected={selected.includes(CertificateStatus.EXPIRED_RECENTLY)}
        />
      </Grid>
    </Grid>
  )
}
