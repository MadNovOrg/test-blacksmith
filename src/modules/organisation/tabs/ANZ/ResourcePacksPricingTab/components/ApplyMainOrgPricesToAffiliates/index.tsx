import { LoadingButton } from '@mui/lab'
import React from 'react'
import { useParams } from 'react-router-dom'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export const ApplyMainOrgRPPricingToAffiliates: React.FC = () => {
  const { id: orgId } = useParams()
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.apply-price-to-affiliates',
  )
  const handleClick = () => {
    console.log(`Handle applying the prices on affiliates for org: ${orgId}`)
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={handleClick}
      data-testid="apply-main-org-prices-to-affiliates"
    >
      {t('button-label')}
    </LoadingButton>
  )
}
