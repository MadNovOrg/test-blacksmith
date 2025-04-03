import { TabContext, TabList } from '@mui/lab'
import { Box, Grid, Tab } from '@mui/material'
import { useState } from 'react'

import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CourseTypeOrgRPPricings } from '@app/util'

import { ApplyMainOrgRPPricingToAffiliates } from '../ApplyMainOrgPricesToAffiliates'
import { ResourcePacksPricingByCourseType } from '../ResourcePacksPricingsByCourseType'

export const ResourcePacksPricingByLevel: React.FC = () => {
  const defaultTab = CourseTypeOrgRPPricings[0]
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )

  const [selectedTab, setSelectedTab] = useState<Course_Type_Enum>(defaultTab)

  return (
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
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end">
            <ApplyMainOrgRPPricingToAffiliates />
          </Box>
        </Grid>
      </Grid>
      <ResourcePacksPricingByCourseType courseType={selectedTab} />
    </TabContext>
  )
}
