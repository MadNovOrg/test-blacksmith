import { TabContext, TabList } from '@mui/lab'
import { Box, CircularProgress, Grid, Stack, Tab } from '@mui/material'
import { useState } from 'react'

import {
  Course_Type_Enum,
  Resource_Packs_Pricing,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useResourcePacksPricing } from '@app/modules/organisation/hooks/useResourcePacksPricing'
import { CourseTypeOrgRPPricings } from '@app/util'

import { ApplyMainOrgRPPricingToAffiliates } from '../ApplyMainOrgPricesToAffiliates'
import { ResourcePacksPricingByCourseType } from '../ResourcePacksPricingsByCourseType'

type Props = {
  orgId: string
}

export const ResourcePacksPricingByLevel: React.FC<
  React.PropsWithChildren<Props>
> = ({ orgId }) => {
  const defaultTab = CourseTypeOrgRPPricings[0]
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )

  const { data, fetching, error } = useResourcePacksPricing(
    CourseTypeOrgRPPricings,
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
            <ApplyMainOrgRPPricingToAffiliates orgId={orgId} />
          </Box>
        </Grid>
      </Grid>

      {fetching ? (
        <Stack sx={{ alignItems: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : null}
      {!fetching && !error ? (
        <ResourcePacksPricingByCourseType
          orgId={orgId}
          courseType={selectedTab}
          RPPricings={data?.resource_packs_pricing as Resource_Packs_Pricing[]}
        />
      ) : null}
    </TabContext>
  )
}
