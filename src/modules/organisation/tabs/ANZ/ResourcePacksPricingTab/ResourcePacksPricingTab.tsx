import { Box, Typography } from '@mui/material'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { ResourcePacksPricingByLevel } from './components/ResourcePacksPricingByLevel'
import { ResourcePacksPricingProvider } from './ResourcePacksPricingProvider'

export const ResourcePacksPricingTab: React.FC = () => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing',
  )
  return (
    <ResourcePacksPricingProvider>
      <Box>
        <Typography
          variant="subtitle1"
          mb={2}
          data-testid="resource-packs-pricing-title"
        >
          {t('subtitle')}
        </Typography>
        <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
          <ResourcePacksPricingByLevel />
        </Box>
      </Box>
    </ResourcePacksPricingProvider>
  )
}
