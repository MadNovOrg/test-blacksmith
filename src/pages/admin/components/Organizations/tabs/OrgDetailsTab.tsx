import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { DetailsRow } from '@app/components/DetailsRow'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import { LoadingStatus } from '@app/util'

type OrgDetailsTabParams = {
  orgId: string
}

export const OrgDetailsTab: React.FC<
  React.PropsWithChildren<OrgDetailsTabParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const navigate = useNavigate()

  const { data, status } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  const org = data?.length ? data[0] : null

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-details-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {org && status === LoadingStatus.SUCCESS ? (
        <Box>
          <Typography variant="subtitle1" mb={2}>
            {t('pages.org-details.tabs.details.org-details-section.title')}
          </Typography>

          <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
            <Grid container>
              <Grid item xs={8}>
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.name'
                  )}
                  value={org.name}
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.org-email'
                  )}
                  value={org.attributes.email}
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.sector'
                  )}
                  value={org.sector}
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.trust-type'
                  )}
                  value={
                    org.trustType
                      ? t(`trust-type.${org.trustType.toLowerCase()}`)
                      : ''
                  }
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.trust'
                  )}
                  value={org.trustName}
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.local-authority'
                  )}
                  value={org.attributes.localAuthority}
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.ofsted-rating'
                  )}
                  value={
                    org.attributes.ofstedRating
                      ? t(
                          `ofsted-rating.${org.attributes.ofstedRating.toLowerCase()}`
                        )
                      : ''
                  }
                />
                <DetailsRow
                  label={t(
                    'pages.org-details.tabs.details.org-details-section.ofsted-last-inspection'
                  )}
                  value={
                    org.attributes.ofstedLastInspection
                      ? t('dates.default', {
                          date: new Date(org.attributes.ofstedLastInspection),
                        })
                      : ''
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('./edit')}
                  >
                    {t('pages.org-details.edit-organization')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="subtitle1" mb={2}>
            {t('pages.org-details.tabs.details.organization-address.title')}
          </Typography>

          <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
            <DetailsRow
              label={t('common.addr.line1')}
              value={org.address.line1}
            />
            <DetailsRow
              label={t('common.addr.line2')}
              value={org.address.line2}
            />
            <DetailsRow
              label={t('common.addr.city')}
              value={org.address.city}
            />
            <DetailsRow
              label={t('common.addr.country')}
              value={org.address.country}
            />
            <DetailsRow
              label={t('common.addr.postCode')}
              value={org.address.postCode}
            />
          </Box>

          <Typography variant="subtitle1" mb={2}>
            {t('pages.org-details.tabs.details.additional-details.title')}
          </Typography>

          <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
            <DetailsRow
              label={t(
                'pages.org-details.tabs.details.additional-details.head-first-name'
              )}
              value={org.attributes.headFirstName}
            />
            <DetailsRow
              label={t(
                'pages.org-details.tabs.details.additional-details.head-last-name'
              )}
              value={org.attributes.headLastName}
            />
            <DetailsRow
              label={t(
                'pages.org-details.tabs.details.additional-details.head-title'
              )}
              value={org.attributes.headTitle}
            />
            <DetailsRow
              label={t(
                'pages.org-details.tabs.details.additional-details.head-preferred-job-title'
              )}
              value={org.attributes.headPreferredJobTitle}
            />
            <DetailsRow
              label={t(
                'pages.org-details.tabs.details.additional-details.website'
              )}
              value={org.attributes.website}
            />
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
