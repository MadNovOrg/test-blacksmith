import { TabContext, TabList } from '@mui/lab'
import { Alert, Box, Grid, Tab } from '@mui/material'
import { useState } from 'react'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CourseTypeOrgRPPricings } from '@app/util'

import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'
import { ApplyMainOrgRPPricingToAffiliates } from '../ApplyMainOrgPricesToAffiliates'
import { ResourcePacksPricingByCourseType } from '../ResourcePacksPricingsByCourseType'

export const ResourcePacksPricingByLevel: React.FC = () => {
  const defaultTab = CourseTypeOrgRPPricings[0]
  const { acl } = useAuth()
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )

  const { main_organisation_id, differentPricesFromMain } =
    useResourcePacksPricingContext()

  const [selectedTab, setSelectedTab] = useState<Course_Type_Enum>(defaultTab)

  return (
    <>
      {main_organisation_id ? (
        <Alert severity="info">
          {t(
            `affiliated-org-alerts.${
              differentPricesFromMain
                ? 'different-prices-from-main'
                : 'same-prices-as-main'
            }`,
          )}
        </Alert>
      ) : null}
      <TabContext value={selectedTab}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <TabList
              onChange={(_, value) => setSelectedTab(value)}
              variant="scrollable"
              data-testid="resource-packs-pricing-by-course-type"
            >
              {CourseTypeOrgRPPricings.map(courseType => (
                <Tab
                  key={courseType}
                  label={t(`types.${courseType.toLocaleLowerCase()}`)}
                  value={courseType}
                  data-testid={`resource-packs-pricing-tab-${courseType}`}
                />
              ))}
            </TabList>
          </Grid>
          {!main_organisation_id &&
          acl.canApplyOrgResourcePacksPricingToAffiliates() ? (
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="flex-end">
                <ApplyMainOrgRPPricingToAffiliates />
              </Box>
            </Grid>
          ) : null}
        </Grid>
        <ResourcePacksPricingByCourseType courseType={selectedTab} />
      </TabContext>
    </>
  )
}
