import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns-tz'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { DetailsRow } from '@app/components/DetailsRow'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { sectors } from '@app/pages/common/CourseBooking/components/org-data'
import { LoadingStatus } from '@app/util'

type OrgDetailsTabParams = {
  orgId: string
}

export const OrgDetailsTab: React.FC<
  React.PropsWithChildren<OrgDetailsTabParams>
> = ({ orgId }) => {
  const { t, _t } = useScopedTranslation('pages.org-details.tabs.details')
  const { profile, acl } = useAuth()
  const navigate = useNavigate()

  const { data, status } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  const org = data?.length ? data[0] : null
  const [, sector = org?.sector] =
    Object.entries(sectors).find(
      ([key, value]) => key === org?.sector && value
    ) || []
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
            {t('organization-details-section.title')}
          </Typography>

          <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
            <Grid container>
              <Grid item xs={8}>
                <DetailsRow
                  label={t('organization-details-section.organization-name')}
                  value={org.name}
                />
                <DetailsRow
                  label={t('organization-details-section.organization-sector')}
                  value={sector || ''}
                />
                <DetailsRow
                  label={t('organization-details-section.organization-type')}
                  value={org.organisationType}
                />
                <DetailsRow
                  label={t('organization-details-section.organization-phone')}
                  value={org.attributes.phone}
                />
                <DetailsRow
                  label={t('organization-details-section.organization-email')}
                  value={org.attributes.email}
                />
                <DetailsRow
                  label={t('organization-details-section.organization-website')}
                  value={org.attributes.website}
                />
              </Grid>

              {acl.canEditOrgs() ? (
                <Grid item xs={4}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={() => navigate('./edit')}
                    >
                      {_t('pages.org-details.edit-organization')}
                    </Button>
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </Box>

          <Typography variant="subtitle1" mb={2}>
            {t('organization-address-section.title')}
          </Typography>

          <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
            <DetailsRow
              label={t('organization-address-section.address-line-1')}
              value={org.address.line1}
            />
            <DetailsRow
              label={t('organization-address-section.address-line-2')}
              value={org.address.line2}
            />
            <DetailsRow
              label={t('organization-address-section.town-or-city')}
              value={org.address.city}
            />
            <DetailsRow
              label={t('organization-address-section.postcode')}
              value={org.address.postCode}
            />
            <DetailsRow
              label={t('organization-address-section.country')}
              value={org.address.country}
            />
          </Box>

          <Typography variant="subtitle1" mb={2}>
            {t('additional-details.title')}
          </Typography>

          <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
            <DetailsRow
              label={t('additional-details.head-first-name')}
              value={org.attributes.headFirstName}
            />
            <DetailsRow
              label={t('additional-details.head-surname')}
              value={org.attributes.headSurname}
            />
            <DetailsRow
              label={t('additional-details.head-email')}
              value={org.attributes.headEmailAddress}
            />
            <DetailsRow
              label={t('additional-details.setting')}
              value={org.attributes.settingName}
            />
            <DetailsRow
              label={t('additional-details.local-authority')}
              value={org.attributes.localAuthority}
            />
            <DetailsRow
              label={t('additional-details.ofsted-rating')}
              value={org.attributes.ofstedRating}
            />
            <DetailsRow
              label={t('additional-details.ofsted-last-inspection')}
              value={
                org.attributes.ofstedLastInspection
                  ? format(
                      new Date(org.attributes.ofstedLastInspection),
                      'd MMMM yyyy'
                    )
                  : null
              }
            />
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
