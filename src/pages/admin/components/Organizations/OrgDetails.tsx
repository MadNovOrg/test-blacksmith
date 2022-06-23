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
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { PillTab, PillTabList } from '@app/components/PillTabs'
import { Sticky } from '@app/components/Sticky'
import useOrg from '@app/hooks/useOrg'
import { OrgDetailsTab } from '@app/pages/admin/components/Organizations/tabs/OrgDetailsTab'
import { OrgUsersTab } from '@app/pages/admin/components/Organizations/tabs/OrgUsersTab'
import theme from '@app/theme'
import { LoadingStatus, renderOrgAddress } from '@app/util'

export const OrgDetails: React.FC = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: org, status } = useOrg(id ?? '')

  const [activeTab, setActiveTab] = React.useState('details')

  const handleActiveTabChange = (_: unknown, newValue: string) => {
    setActiveTab(newValue)
  }

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

          <TabContext value={activeTab}>
            <Container maxWidth="lg" sx={{ pt: 2 }}>
              <Container>
                <PillTabList onChange={handleActiveTabChange}>
                  <PillTab
                    label={t('pages.org-details.tabs.details.title')}
                    value="details"
                  />
                  <PillTab
                    label={t('pages.org-details.tabs.users.title')}
                    value="users"
                  />
                </PillTabList>
              </Container>
            </Container>

            <Container
              maxWidth="lg"
              sx={{ pt: 2, bgcolor: theme.palette.grey[100] }}
            >
              <TabPanel sx={{ px: 0 }} value="details">
                <OrgDetailsTab orgId={id ?? ''} />
              </TabPanel>

              <TabPanel sx={{ px: 0 }} value="users">
                <OrgUsersTab orgId={id ?? ''} />
              </TabPanel>
            </Container>
          </TabContext>
        </>
      ) : null}
    </FullHeightPage>
  )
}
