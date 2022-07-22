import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { OrgInvitesTable } from '@app/components/OrgInvitesTable'
import { OrgUsersTable } from '@app/components/OrgUsersTable'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import { LoadingStatus } from '@app/util'

export enum OrgIndividualsSubtabs {
  USERS = 'USERS',
  INVITES = 'INVITES',
}

type OrgIndividualsTabParams = {
  orgId: string
}

export const OrgIndividualsTab: React.FC<OrgIndividualsTabParams> = ({
  orgId,
}) => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialTab = searchParams.get('subtab') as OrgIndividualsSubtabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab || OrgIndividualsSubtabs.USERS
  )

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const { data, stats, status, mutate } = useOrg(orgId, profile?.id)

  const org = data?.length ? data[0] : null

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
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
        <>
          <Grid container>
            <Grid item xs={4} bgcolor="common.white" p={3} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {stats.profiles.count}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.total-number-of-users'
                )}
              </Typography>
            </Grid>

            <Grid item xs={4} bgcolor="common.white" p={3} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {stats.certificates.active.count}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.active-certifications'
                )}
              </Typography>
            </Grid>

            <Grid item xs={4} bgcolor="common.white" p={3} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {stats.certificates.expired.count}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.expired-certifications'
                )}
              </Typography>
            </Grid>
          </Grid>

          <Box mt={2}>
            <TabContext value={selectedTab}>
              <Box display="flex" justifyContent="space-between" my={2}>
                <TabList onChange={(_, value) => setSelectedTab(value)}>
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.individuals', {
                      number: stats.profiles.count,
                    })}
                    value={OrgIndividualsSubtabs.USERS}
                    data-testid="tabUsers"
                  />
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.pending', {
                      number: stats.pendingInvites.count,
                    })}
                    value={OrgIndividualsSubtabs.INVITES}
                    data-testid="tabInvites"
                  />
                </TabList>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('../invite')}
                >
                  {t(
                    'pages.org-details.tabs.users.invite-user-to-organization'
                  )}
                </Button>
              </Box>

              <TabPanel
                value={OrgIndividualsSubtabs.USERS}
                sx={{ px: 0, pt: 0, bgcolor: 'common.white' }}
              >
                <OrgUsersTable
                  orgId={orgId}
                  onChange={async () => {
                    await mutate()
                  }}
                />
              </TabPanel>
              <TabPanel value={OrgIndividualsSubtabs.INVITES} sx={{ px: 0 }}>
                <OrgInvitesTable orgId={orgId} />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      ) : null}
    </Container>
  )
}
