import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { Sticky } from '@app/components/Sticky'
import useOrg from '@app/hooks/useOrg'
import { OrgDetailsTab } from '@app/pages/admin/components/Organizations/tabs/OrgDetailsTab'
import { OrgUsersTab } from '@app/pages/admin/components/Organizations/tabs/OrgUsersTab'
import theme from '@app/theme'
import { LoadingStatus, renderOrgAddress } from '@app/util'

export enum OrgDetailsTabs {
  DETAILS = 'DETAILS',
  USERS = 'USERS',
}

export const OrgDetails: React.FC = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: org, status } = useOrg(id ?? '')

  const initialTab = searchParams.get('tab') as OrgDetailsTabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab || OrgDetailsTabs.DETAILS
  )

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const orgAddress = useMemo(() => renderOrgAddress(org), [org])

  return (
    <FullHeightPage>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-details-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {status === LoadingStatus.ERROR ? (
        <Alert severity="error">{t('pages.org-details.org-not-found')}</Alert>
      ) : null}

      {org && status === LoadingStatus.SUCCESS ? (
        <>
          <Container maxWidth="lg" sx={{ pt: 2 }}>
            <Box display="flex" paddingBottom={5}>
              <Box width="100%" pr={4}>
                <Sticky top={20}>
                  <Grid container justifyContent="space-between">
                    <Grid item mb={2}>
                      <BackButton to="/admin/organizations" />
                    </Grid>

                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate('../edit')}
                      >
                        {t('pages.org-details.edit-organization')}
                      </Button>
                    </Grid>
                  </Grid>
                  <Typography variant="h2" mb={2}>
                    {org.name}
                  </Typography>
                  <Typography variant="body1" color="grey.600">
                    {orgAddress}
                  </Typography>
                </Sticky>
              </Box>
            </Box>
          </Container>

          <TabContext value={selectedTab}>
            <Container maxWidth="lg" sx={{ pt: 2 }}>
              <Container>
                <PillTabList onChange={(_, value) => setSelectedTab(value)}>
                  <PillTab
                    label={t('pages.org-details.tabs.details.title')}
                    value={OrgDetailsTabs.DETAILS}
                  />
                  <PillTab
                    label={t('pages.org-details.tabs.users.title')}
                    value={OrgDetailsTabs.USERS}
                  />
                </PillTabList>
              </Container>
            </Container>

            <Container
              maxWidth="lg"
              sx={{ pt: 2, bgcolor: theme.palette.grey[100] }}
            >
              <TabPanel sx={{ px: 0 }} value={OrgDetailsTabs.DETAILS}>
                <OrgDetailsTab orgId={id ?? ''} />
              </TabPanel>

              <TabPanel sx={{ px: 0 }} value={OrgDetailsTabs.USERS}>
                <OrgUsersTab orgId={id ?? ''} />
              </TabPanel>
            </Container>
          </TabContext>
        </>
      ) : null}
    </FullHeightPage>
  )
}
