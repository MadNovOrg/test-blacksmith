import { Box, CircularProgress, Container, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DetailsRow } from '@app/components/DetailsRow'
import useOrg from '@app/hooks/useOrg'
import { LoadingStatus, renderOrgAddress } from '@app/util'

type OrgDetailsTabParams = {
  orgId: string
}

export const OrgDetailsTab: React.FC<OrgDetailsTabParams> = ({ orgId }) => {
  const { t } = useTranslation()

  const {
    data: org,
    activeCertificatesCount,
    expiredCertificatesCount,
    status,
  } = useOrg(orgId ?? '')

  const orgAddress = useMemo(() => renderOrgAddress(org), [org])

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
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
        <Grid container direction="row">
          <Grid item xs={12} md={8} pr={4}>
            <Typography variant="subtitle1" mb={2}>
              {t('pages.org-details.tabs.details.org-details-section.title')}
            </Typography>

            <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
              <DetailsRow
                label={t(
                  'pages.org-details.tabs.details.org-details-section.name'
                )}
                value={org.name}
              />
              <DetailsRow
                label={t(
                  'pages.org-details.tabs.details.org-details-section.address'
                )}
                value={orgAddress}
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
            </Box>

            <Typography variant="subtitle1" mb={2}>
              {t('pages.org-details.tabs.details.additional-details.title')}
            </Typography>

            <Box bgcolor="common.white" p={3} pb={4} borderRadius={1}>
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" mb={1}>
              {t('pages.org-details.tabs.details.user-details.title')}
            </Typography>

            <Box bgcolor="common.white" p={3} mb={1} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {org.usersCount.aggregate.count}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.total-number-of-users'
                )}
              </Typography>
            </Box>

            <Box bgcolor="common.white" p={3} mb={1} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {activeCertificatesCount}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.active-certifications'
                )}
              </Typography>
            </Box>

            <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
              <Typography variant="h2" mb={1}>
                {expiredCertificatesCount}
              </Typography>
              <Typography variant="body2" mb={1}>
                {t(
                  'pages.org-details.tabs.details.user-details.expired-certifications'
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ) : null}
    </Container>
  )
}
