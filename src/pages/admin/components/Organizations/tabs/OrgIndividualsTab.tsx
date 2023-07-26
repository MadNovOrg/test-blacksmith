import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, CircularProgress, Grid, Stack, Tab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { OrgInvitesTable } from '@app/components/OrgInvitesTable'
import { OrgUsersTable } from '@app/components/OrgUsersTable'
import { useOrgMembers } from '@app/components/OrgUsersTable/useOrgMembers'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import { OrgStatsTiles } from '@app/pages/admin/components/Organizations/tabs/components/OrgStatsTiles'
import { LoadingStatus } from '@app/util'

export enum OrgIndividualsSubtabs {
  USERS = 'USERS',
  INVITES = 'INVITES',
}

type OrgIndividualsTabParams = {
  orgId: string
}

export const OrgIndividualsTab: React.FC<
  React.PropsWithChildren<OrgIndividualsTabParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialTab = searchParams.get('subtab') as OrgIndividualsSubtabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab || OrgIndividualsSubtabs.USERS
  )

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const { data, stats, status, mutate } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  const { total: totalMembers, refetch: refetchOrgMembers } = useOrgMembers({
    orgId,
  })

  const org = data?.length ? data[0] : null

  return (
    <Box sx={{ pb: 4 }}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-users-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {org && status === LoadingStatus.SUCCESS ? (
        <Grid container>
          <Grid item xs={12}>
            <OrgStatsTiles orgId={orgId} />
          </Grid>

          <Grid item xs={12} mt={2}>
            <TabContext value={selectedTab}>
              <Box display="flex" justifyContent="space-between" my={2}>
                <TabList onChange={(_, value) => setSelectedTab(value)}>
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.individuals', {
                      number: totalMembers,
                    })}
                    value={OrgIndividualsSubtabs.USERS}
                    data-testid="tabUsers"
                  />
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.invites', {
                      number: stats[orgId]?.pendingInvites?.count ?? 0,
                    })}
                    value={OrgIndividualsSubtabs.INVITES}
                    data-testid="tabInvites"
                  />
                </TabList>
                {acl.canInviteToOrganizations() ? (
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate(`/organisations/${orgId}/invite`)}
                    data-testid="invite-user-to-org"
                  >
                    {t(
                      'pages.org-details.tabs.users.invite-individual-to-organization'
                    )}
                  </Button>
                ) : undefined}
              </Box>

              <TabPanel
                value={OrgIndividualsSubtabs.USERS}
                sx={{ px: 0, pt: 0 }}
              >
                <OrgUsersTable
                  orgId={orgId}
                  onChange={async () => {
                    refetchOrgMembers()
                    await mutate()
                  }}
                />
              </TabPanel>
              <TabPanel value={OrgIndividualsSubtabs.INVITES} sx={{ px: 0 }}>
                <OrgInvitesTable orgId={orgId} />
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  )
}
