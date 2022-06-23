import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OrgUsersTable } from '@app/components/OrgUsersTable'
import useOrg from '@app/hooks/useOrg'
import { LoadingStatus } from '@app/util'

type OrgUsersTabParams = {
  orgId: string
}

export const OrgUsersTab: React.FC<OrgUsersTabParams> = ({ orgId }) => {
  const { t } = useTranslation()

  const [selectedTab, setSelectedTab] = useState('users')

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
              <TabList
                onChange={(_, selectedTab: React.SetStateAction<string>) =>
                  setSelectedTab(selectedTab)
                }
              >
                <Tab
                  label={t('pages.org-details.tabs.users.tabs.users', {
                    number: org?.usersCount.aggregate.count,
                  })}
                  value="users"
                  data-testid="tabUsers"
                />
                <Tab
                  label={t('pages.org-details.tabs.users.tabs.pending', {
                    number: org?.invitesCount.aggregate.count,
                  })}
                  value="pending"
                  data-testid="tabPending"
                />
              </TabList>

              <TabPanel
                value="users"
                sx={{ px: 0, pt: 0, bgcolor: 'common.white' }}
              >
                <OrgUsersTable orgId={orgId ?? ''} />
              </TabPanel>
              <TabPanel value="pending" sx={{ px: 0 }}></TabPanel>
            </TabContext>
          </Box>
        </>
      ) : null}
    </Container>
  )
}
