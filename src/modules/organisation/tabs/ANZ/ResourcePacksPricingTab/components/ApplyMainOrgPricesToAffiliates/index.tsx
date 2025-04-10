import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Dialog } from '@app/components/dialogs'
import { Org_Resource_Packs_Pricing_Insert_Input } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useApplyOrgResourcePacksPriceOnAffiliates } from '@app/modules/organisation/hooks/useApplyOrgResourcePacksPriceOnAffiliates'
import { useGetAllAffiliatedOrgIds } from '@app/modules/organisation/hooks/useGetAllAffiliatedOrgIds'

import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'

export const ApplyMainOrgRPPricingToAffiliates: React.FC = () => {
  const { id: orgId } = useParams()
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.apply-price-to-affiliates',
  )

  const [displayAffiliatesOverriteModal, setDisplayAffiliatesOverriteModal] =
    useState(false)

  const {
    orgResourcePacksPricings,
    fetching: fetchingMainOrgRPPricings,
    refetch,
  } = useResourcePacksPricingContext()

  const [
    { fetching: savingAffiliatesPricings },
    applyMainOrgRPPricingToAffiliates,
  ] = useApplyOrgResourcePacksPriceOnAffiliates()

  const { data, fetching: fetchingAffiliatesIds } =
    useGetAllAffiliatedOrgIds(orgId)

  const affiliatesIds = useMemo(() => {
    return data?.flatMap(affiliate => affiliate.id)
  }, [data])

  const handleClick = () => {
    setDisplayAffiliatesOverriteModal(true)
  }
  const handleCloseModal = () => {
    setDisplayAffiliatesOverriteModal(false)
  }
  const handleConfirmModal = () => {
    if (affiliatesIds?.length) {
      const pricingsToInsert = affiliatesIds.map(affiliateId =>
        orgResourcePacksPricings.map(
          pricing =>
            ({
              organisation_id: affiliateId,
              resource_packs_pricing_id: pricing.resource_packs_pricing_id,
              AUD_price: pricing.AUD_price,
              NZD_price: pricing.NZD_price,
            } as Org_Resource_Packs_Pricing_Insert_Input),
        ),
      )

      applyMainOrgRPPricingToAffiliates({
        pricings: pricingsToInsert.flat(),
        affiliatesIds,
      }).then(() => {
        refetch()
      })
    }
    setDisplayAffiliatesOverriteModal(false)
  }

  return (
    <>
      <LoadingButton
        variant="contained"
        loading={
          fetchingMainOrgRPPricings ||
          fetchingAffiliatesIds ||
          savingAffiliatesPricings
        }
        onClick={handleClick}
        data-testid="apply-main-org-prices-to-affiliates"
      >
        {t('button-label')}
      </LoadingButton>
      <Dialog
        open={displayAffiliatesOverriteModal}
        onClose={() => setDisplayAffiliatesOverriteModal(false)}
        minWidth={600}
        noPaddings={true}
        slots={{
          Title: () => <Typography>{t('modal.title')}</Typography>,
          Content: () => <Typography>{t('modal.content')}</Typography>,
          Actions: () => (
            <>
              <Button
                onClick={handleCloseModal}
                color="primary"
                variant="contained"
                sx={{ ml: 4 }}
              >
                {t('modal.cancel-button')}
              </Button>
              <Button
                onClick={handleConfirmModal}
                color="primary"
                variant="contained"
                sx={{ mr: 4 }}
              >
                {t('modal.confirm-button')}
              </Button>
            </>
          ),
        }}
      ></Dialog>
    </>
  )
}
