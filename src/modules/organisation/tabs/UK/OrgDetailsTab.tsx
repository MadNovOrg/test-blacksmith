import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { isValid } from 'date-fns'
import { format } from 'date-fns-tz'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { DetailsRow } from '@app/components/DetailsRow'
import { useAuth } from '@app/context/auth'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { sectors } from '@app/modules/course_booking/utils'
import DeleteOrgModal from '@app/modules/organisation/components/DeleteOrgModal/UK/DeleteOrgModal'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'

type OrgDetailsTabParams = {
  orgId: string
}

export const OrgDetailsTab: React.FC<
  React.PropsWithChildren<OrgDetailsTabParams>
> = ({ orgId }) => {
  const { t, _t } = useScopedTranslation('pages.org-details.tabs.details')
  const { profile, acl } = useAuth()
  const navigate = useNavigate()
  const { checkUKsCountryName } = useWorldCountries()
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

  const { data, fetching, error } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    withAggregateData: acl.canDeleteOrgs(),
  })

  const { width } = useWindowSize()
  const isMobile = width <= 425

  const org = data?.orgs.length ? data.orgs[0] : null
  const [, sector = org?.sector] =
    Object.entries(sectors).find(
      ([key, value]) => key === org?.sector && value,
    ) || []

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      {fetching ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-details-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {!fetching && !error && org ? (
        <Box>
          <Typography variant="subtitle1" mb={2}>
            {t('organization-details-section.title')}
          </Typography>

          <Box
            bgcolor="common.white"
            p={isMobile ? 1 : 3}
            mb={4}
            borderRadius={1}
          >
            <Grid container>
              <Grid item xs={8}>
                <DetailsRow
                  label={t('organization-details-section.organization-name')}
                  value={org.name}
                />
                <DetailsRow
                  label={t('organization-details-section.organization-sector')}
                  value={sector ?? ''}
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
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems={'flex-end'}
                    flexDirection={'column'}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size={isMobile ? 'medium' : 'large'}
                      sx={{
                        fontSize: isMobile ? '10px' : '12px',
                        width: '50%',
                      }}
                      onClick={() => navigate('./edit')}
                    >
                      {_t('pages.org-details.edit-organization')}
                    </Button>
                    {acl.canDeleteOrgs() ? (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size={isMobile ? 'medium' : 'large'}
                          sx={{
                            fontSize: isMobile ? '10px' : '12px',
                            width: '50%',
                            mt: 1,
                          }}
                          onClick={() => setOpenDeleteDialog(true)}
                          startIcon={<DeleteIcon />}
                        >
                          {t('delete-organisation')}
                        </Button>
                        {data?.orgs.length ? (
                          <DeleteOrgModal
                            onClose={() => setOpenDeleteDialog(false)}
                            open={openDeleteDialog}
                            org={data?.orgs[0]}
                          />
                        ) : null}
                      </>
                    ) : null}
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </Box>

          <Typography variant="subtitle1" mb={2}>
            {t('organization-address-section.title')}
          </Typography>

          <Box
            bgcolor="common.white"
            p={isMobile ? 1 : 3}
            mb={4}
            borderRadius={1}
          >
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
              label={t(
                `organization-address-section.${
                  !org.address.country ||
                  checkUKsCountryName(org.address.country)
                    ? 'postcode'
                    : 'zip-code'
                }`,
              )}
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

          <Box
            bgcolor="common.white"
            p={isMobile ? 1 : 3}
            mb={4}
            borderRadius={1}
          >
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
            {!org.address.country ||
            checkUKsCountryName(org.address.country) ? (
              <>
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
                    isValid(new Date(org.attributes.ofstedLastInspection))
                      ? format(
                          new Date(org.attributes.ofstedLastInspection),
                          'd MMMM yyyy',
                        )
                      : org.attributes.ofstedLastInspection || ''
                  }
                />
              </>
            ) : null}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
