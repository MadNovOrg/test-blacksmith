import { LoadingButton } from '@mui/lab'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

type Props = {
  orgId: string
}

export const ApplyMainOrgRPPricingToAffiliates: React.FC<
  React.PropsWithChildren<Props>
> = ({ orgId }) => {
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
