import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { isValid } from 'date-fns'
import { format } from 'date-fns-tz'
import { TFunction } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { DetailsRow } from '@app/components/DetailsRow'
import { useAuth } from '@app/context/auth'
import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { sectors } from '@app/modules/course_booking/utils'
import DeleteOrgModal from '@app/modules/organisation/components/DeleteOrgModal/DeleteOrgModal'
import ANZhook from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import UKhook from '@app/modules/organisation/hooks/UK/useOrgV2'

type OrgDetailsTabParams = {
  orgId: string
}

const responsiveCSSProps = (isMobile: boolean) => {
  return {
    padding: isMobile ? 1 : 3,
    buttonSize: isMobile ? 'medium' : ('large' as ButtonProps['size']),
    buttonFontSize: isMobile ? '10px' : '12px',
  }
}

const UKRows = (
  isAustralia: boolean,
  isUKCountry: boolean,
  org: GetOrganisationDetailsQuery['orgs'][0],
  t: TFunction<'translation', undefined, 'translation'>,
) => {
  if (isAustralia) return null
  if (!org) return null
  if (!org?.address.country || isUKCountry)
    return (
      <>
        <DetailsRow
          label={t('additional-details.local-authority')}
          value={org.attributes.localAuthority}
          data-testid="local-authority-row"
        />
        <DetailsRow
          label={t('additional-details.ofsted-rating')}
          value={org.attributes.ofstedRating}
          data-testid="ofsted-rating-row"
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
          data-testid="ofsted-last-inspection-row"
        />
      </>
    )
}

export const OrgDetailsTab: React.FC<
  React.PropsWithChildren<OrgDetailsTabParams>
> = ({ orgId }) => {
  const { t, _t } = useScopedTranslation('pages.org-details.tabs.details')
  const { profile, acl } = useAuth()
  const navigate = useNavigate()
  const { checkUKsCountryName } = useWorldCountries()
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

  const viewConnectIdEnabled = useFeatureFlagEnabled(
    'view-organization-connect-id-enabled',
  )

  const canViewConnectId = useMemo(
    () => acl.isUK() && viewConnectIdEnabled && acl.canViewTTConnectId(),
    [acl, viewConnectIdEnabled],
  )

  const { data, fetching, error } = acl.isUK()
    ? UKhook({
        orgId,
        profileId: profile?.id,
        showAll: acl.canViewAllOrganizations(),
        withAggregateData: acl.canDeleteOrgs(),
        withTTConnectId: canViewConnectId,
      })
    : ANZhook({
        orgId,
        profileId: profile?.id,
        showAll: acl.canViewAllOrganizations(),
        withAggregateData: acl.canDeleteOrgs(),
      })

  const { width } = useWindowSize()
  const isMobile = width <= 425

  const org = data?.orgs[0] ?? null
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
          {canViewConnectId && Boolean(org.tt_connect_id) ? (
            <Box
              bgcolor="common.white"
              p={responsiveCSSProps(isMobile).padding}
              mb={4}
              borderRadius={1}
              data-testid="org-connect-id-section"
            >
              <Grid container>
                <Grid item xs={8}>
                  <DetailsRow
                    data-testid="org-connect-id-row"
                    label={
                      <Box display={'flex'} gap={1}>
                        <Typography>
                          {t('organization-details-section.connect-id')}
                        </Typography>
                        <Tooltip
                          title={t(
                            'organization-details-section.connect-id-tooltip',
                          )}
                        >
                          <InfoIcon />
                        </Tooltip>
                      </Box>
                    }
                    labelProps={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                    value={org.tt_connect_id}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : null}
          <Typography
            variant="subtitle1"
            mb={2}
            data-testid="org-details-section"
          >
            {t('organization-details-section.title')}
          </Typography>

          <Box
            bgcolor="common.white"
            p={responsiveCSSProps(isMobile).padding}
            mb={4}
            borderRadius={1}
          >
            <Grid container>
              <Grid item xs={8}>
                <DetailsRow
                  label={t('organization-details-section.organization-name')}
                  value={org.name}
                  data-testid="org-name-row"
                />
                <DetailsRow
                  label={t('organization-details-section.organization-sector')}
                  value={sector ?? ''}
                  data-testid="org-sector-row"
                />
                <DetailsRow
                  label={t('organization-details-section.organization-type')}
                  value={org.organisationType}
                  data-testid="org-type-row"
                />
                <DetailsRow
                  label={t('organization-details-section.organization-phone')}
                  value={org.attributes.phone}
                  data-testid="org-phone-row"
                />
                <DetailsRow
                  label={t('organization-details-section.organization-email')}
                  value={org.attributes.email}
                  data-testid="org-email-row"
                />
                <DetailsRow
                  label={t('organization-details-section.organization-website')}
                  value={org.attributes.website}
                  data-testid="org-website-row"
                />
              </Grid>

              {acl.canEditOrgs() && (
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
                      size={responsiveCSSProps(isMobile).buttonSize}
                      data-testid="edit-org-button"
                      sx={{
                        fontSize: responsiveCSSProps(isMobile).buttonFontSize,
                        width: '50%',
                      }}
                      onClick={() => navigate('./edit')}
                    >
                      {_t('pages.org-details.edit-organization')}
                    </Button>
                    {acl.canDeleteOrgs() && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size={responsiveCSSProps(isMobile).buttonSize}
                          data-testid="delete-org-button"
                          sx={{
                            fontSize:
                              responsiveCSSProps(isMobile).buttonFontSize,
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
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Typography
            variant="subtitle1"
            mb={2}
            data-testid="org-address-section"
          >
            {t('organization-address-section.title')}
          </Typography>

          <Box
            bgcolor="common.white"
            p={responsiveCSSProps(isMobile).padding}
            mb={4}
            borderRadius={1}
          >
            <DetailsRow
              label={t('organization-address-section.address-line-1')}
              value={org.address.line1}
              data-testid="org-address-line-1-row"
            />
            <DetailsRow
              label={t('organization-address-section.address-line-2')}
              value={org.address.line2}
              data-testid="org-address-line-2-row"
            />
            <DetailsRow
              label={t('organization-address-section.town-or-city')}
              value={org.address.city}
              data-testid="org-city-row"
            />
            {acl.isUK() ? (
              <DetailsRow
                label={t(
                  `organization-address-section.${
                    !org.address.country ||
                    checkUKsCountryName(org.address.country)
                      ? 'postcode'
                      : 'zip-code'
                  }`,
                )}
                data-testid="org-postcode-row"
                value={org.address.postCode}
              />
            ) : (
              <DetailsRow
                label={t('organization-address-section.postcode')}
                value={org.address.postCode}
                data-testid="org-postcode-row"
              />
            )}
            {org.address.region ? (
              <DetailsRow
                label={t('organization-address-section.state-territory-region')}
                value={org.address.region}
                data-testid="org-region-row"
              />
            ) : null}
            <DetailsRow
              label={t('organization-address-section.country')}
              value={org.address.country}
              data-testid="org-country-row"
            />
          </Box>

          <Typography
            variant="subtitle1"
            mb={2}
            data-testid="additional-details-section"
          >
            {t('additional-details.title')}
          </Typography>

          <Box
            bgcolor="common.white"
            p={responsiveCSSProps(isMobile).padding}
            mb={4}
            borderRadius={1}
          >
            <DetailsRow
              label={t('additional-details.head-first-name')}
              value={org.attributes.headFirstName}
              data-testid="head-first-name-row"
            />
            <DetailsRow
              label={t('additional-details.head-surname')}
              value={org.attributes.headSurname}
              data-testid="head-surname-row"
            />
            <DetailsRow
              label={t('additional-details.head-email')}
              value={org.attributes.headEmailAddress}
              data-testid="head-email-row"
            />
            <DetailsRow
              label={t('additional-details.setting')}
              value={org.attributes.settingName}
              data-testid="setting-name-row"
            />
            {UKRows(
              acl.isAustralia(),
              checkUKsCountryName(org.address.country),
              org,
              t,
            )}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
