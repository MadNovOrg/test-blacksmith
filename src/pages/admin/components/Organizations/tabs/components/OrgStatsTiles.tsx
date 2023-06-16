import { Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CountPanel } from '@app/components/CountPanel'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'

export type OrgStatsTilesParams = {
  orgId: string
}

export const OrgStatsTiles: React.FC<
  React.PropsWithChildren<OrgStatsTilesParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()

  const { stats } = useOrg(orgId, profile?.id, acl.canViewAllOrganizations())

  return (
    <Grid container>
      <Grid item xs={12} md={12} p={1} borderRadius={1}>
        <CountPanel
          count={stats[orgId]?.profiles.count}
          label={t('pages.org-details.tabs.overview.total-individuals')}
          tooltip={t(
            'pages.org-details.tabs.overview.all-organisation-members'
          )}
        />
      </Grid>

      <Grid item xs={3} md={3} p={1} borderRadius={1}>
        <CountPanel
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
        />
      </Grid>

      <Grid item xs={3} md={3} p={1} borderRadius={1}>
        <CountPanel
          count={stats[orgId]?.certificates.hold.count}
          chip={{
            label: t('pages.org-details.tabs.overview.on-hold'),
            color: 'warning',
          }}
          label={t('pages.org-details.tabs.overview.currently-enrolled', {
            count: stats[orgId]?.certificates.hold.enrolled,
          })}
        />
      </Grid>
      <Grid item xs={3} md={3} p={1} borderRadius={1}>
        <CountPanel
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
        />
      </Grid>
      <Grid item xs={3} md={3} p={1} borderRadius={1}>
        <CountPanel
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
        />
      </Grid>
    </Grid>
  )
}
