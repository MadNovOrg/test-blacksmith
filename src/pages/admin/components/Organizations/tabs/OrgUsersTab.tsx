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
import useOrg from '@app/hooks/useOrg'
import { LoadingStatus } from '@app/util'

export enum OrgUsersSubtabs {
  USERS = 'USERS',
  INVITES = 'INVITES',
}

type OrgUsersTabParams = {
  orgId: string
}

export const OrgUsersTab: React.FC<OrgUsersTabParams> = ({ orgId }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialTab = searchParams.get('subtab') as OrgUsersSubtabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab || OrgUsersSubtabs.USERS
  )

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const {
    data: org,
    activeCertificatesCount,
    expiredCertificatesCount,
    status,
  } = useOrg(orgId ?? '')

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
                {org.usersCount.aggregate.count}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.total-number-of-users'
                )}
              </Typography>
            </Grid>

            <Grid item xs={4} bgcolor="common.white" p={3} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {activeCertificatesCount}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.active-certifications'
                )}
              </Typography>
            </Grid>

            <Grid item xs={4} bgcolor="common.white" p={3} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {expiredCertificatesCount}
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
                    label={t('pages.org-details.tabs.users.tabs.users', {
                      number: org?.usersCount.aggregate.count,
                    })}
                    value={OrgUsersSubtabs.USERS}
                    data-testid="tabUsers"
                  />
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.invites', {
                      number: org?.pendingInvitesCount.aggregate.count,
                    })}
                    value={OrgUsersSubtabs.INVITES}
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
                value={OrgUsersSubtabs.USERS}
                sx={{ px: 0, pt: 0, bgcolor: 'common.white' }}
              >
                <OrgUsersTable orgId={orgId ?? ''} />
              </TabPanel>
              <TabPanel value={OrgUsersSubtabs.INVITES} sx={{ px: 0 }}>
                <OrgInvitesTable orgId={orgId ?? ''} />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      ) : null}
    </Container>
  )
}
