import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Tab,
  useMediaQuery,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { OrgInvitesTable } from '@app/components/OrgInvitesTable'
import { useAuth } from '@app/context/auth'
import { Certificate_Status_Enum } from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
import { useOrgMembers } from '@app/modules/organisation/hooks/useOrgMembers'
import { OrgStatsTiles } from '@app/modules/organisation/tabs/components/OrgStatsTiles'
import { OrgUsersTable } from '@app/modules/organisation/tabs/components/OrgUsersTable'
import theme from '@app/theme'

import useOrganisationPendingInvites from '../hooks/useOrganisationPendingInvites'

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
    initialTab || OrgIndividualsSubtabs.USERS,
  )
  const statuses = Object.values(
    Certificate_Status_Enum,
  ) as Certificate_Status_Enum[]
  const [certificateStatus, setCertificateStatus] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<Certificate_Status_Enum>(statuses),
      [] as Certificate_Status_Enum[],
    ),
  )

  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

  const { data, fetching, reexecute } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
  })

  const { total: totalMembers, refetch: refetchOrgMembers } = useOrgMembers({
    orgId,
  })

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const org = data?.orgs.length ? data.orgs[0] : null
  const [{ data: pendingInvitesData }] = useOrganisationPendingInvites(orgId)

  const onKPITileSelected = useCallback(
    (status: Certificate_Status_Enum | null) => {
      if (status) {
        setCertificateStatus(currentStatuses => {
          if (currentStatuses?.includes(status)) {
            return currentStatuses.filter(s => s !== status)
          } else {
            return [...(currentStatuses ?? []), status]
          }
        })
      } else {
        setCertificateStatus([])
      }
    },
    [setCertificateStatus],
  )

  return (
    <Box sx={{ pb: 4 }}>
      {fetching ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-users-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      <Grid item xs={12}>
        <OrgStatsTiles
          orgId={orgId}
          selected={certificateStatus}
          onTileSelect={onKPITileSelected}
        />
      </Grid>
      {org && !fetching ? (
        <Grid container>
          <Grid item xs={12} mt={2}>
            <TabContext value={selectedTab}>
              <Box display="flex" justifyContent="space-between" my={2}>
                <TabList
                  onChange={(_, value) => setSelectedTab(value)}
                  variant="scrollable"
                >
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.individuals', {
                      number: totalMembers,
                    })}
                    value={OrgIndividualsSubtabs.USERS}
                    data-testid="tabUsers"
                  />
                  <Tab
                    label={t('pages.org-details.tabs.users.tabs.invites', {
                      number:
                        pendingInvitesData?.organization_invites_aggregate
                          .aggregate?.count ?? 0,
                    })}
                    value={OrgIndividualsSubtabs.INVITES}
                    data-testid="tabInvites"
                  />
                </TabList>
                {acl.canInviteToOrganizations() ? (
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    size={isMobile ? 'small' : 'large'}
                    sx={{
                      fontSize: isMobile ? '10px' : '15px',
                      padding: isMobile ? 0.5 : 2,
                      paddingLeft: isMobile ? 0.7 : 2,
                    }}
                    onClick={() => navigate(`/organisations/${orgId}/invite`)}
                    data-testid="invite-user-to-org"
                  >
                    {t(
                      'pages.org-details.tabs.users.invite-individual-to-organization',
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
                  certificateStatus={certificateStatus}
                  onChange={async () => {
                    refetchOrgMembers()
                    reexecute()
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
