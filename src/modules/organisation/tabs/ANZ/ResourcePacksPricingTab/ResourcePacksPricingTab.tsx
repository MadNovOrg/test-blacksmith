import { Box, Typography } from '@mui/material'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { ResourcePacksPricingByLevel } from './components/ResourcePacksPricingByLevel'

type Props = {
  orgId: string
}

export const ResourcePacksPricingTab: React.FC<
  React.PropsWithChildren<Props>
> = ({ orgId }) => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing',
  )
  return (
    <Box>
      <Typography
        variant="subtitle1"
        mb={2}
        data-testid="resource-packs-pricing-title"
      >
        {t('subtitle')}
      </Typography>
      <Box bgcolor="common.white" p={3} mb={4} borderRadius={1}>
        <ResourcePacksPricingByLevel orgId={orgId} />
      </Box>
    </Box>
  )
}
