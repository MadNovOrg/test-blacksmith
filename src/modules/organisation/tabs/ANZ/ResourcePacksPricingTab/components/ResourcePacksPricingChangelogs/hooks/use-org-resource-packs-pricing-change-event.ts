import { TFunction } from 'i18next'
import { useCallback } from 'react'

import { Currency } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { OrgResourcePacksPricingChangelogUpdatedColumns } from '@app/modules/organisation/queries/get-org-resource-packs-changelogs'
import { CurrencySymbol } from '@app/util'

const formatPrice = (price: number, currency: Currency) =>
  `${CurrencySymbol[currency]}${price.toFixed(2)}`

const formatChangeEventPrices = (
  t: TFunction,
  oldColumns: OrgResourcePacksPricingChangelogUpdatedColumns['old'],
  newColumns: OrgResourcePacksPricingChangelogUpdatedColumns['new'],
) => {
  const audPriceHasChanged = oldColumns.AUD_price !== newColumns.AUD_price
  const nzdPriceHasChanged = oldColumns.NZD_price !== newColumns.NZD_price

  const haveBothPricesChanged = audPriceHasChanged && nzdPriceHasChanged
  const nonePriceWasChanged = !audPriceHasChanged && !nzdPriceHasChanged

  const containsOldColumns = Object.keys(oldColumns).length > 0

  if (!containsOldColumns) {
    return t('priceSet', {
      audPrice: formatPrice(newColumns.AUD_price as number, Currency.Aud),
      nzdPrice: formatPrice(newColumns.NZD_price as number, Currency.Nzd),
    })
  }

  if (haveBothPricesChanged || nonePriceWasChanged) {
    return t('priceChangeBoth', {
      oldAudPrice: formatPrice(oldColumns.AUD_price as number, Currency.Aud),
      oldNzdPrice: formatPrice(oldColumns.NZD_price as number, Currency.Nzd),
      newAudPrice: formatPrice(newColumns.AUD_price as number, Currency.Aud),
      newNzdPrice: formatPrice(newColumns.NZD_price as number, Currency.Nzd),
    })
  }

  if (audPriceHasChanged) {
    return t('priceChangeAud', {
      oldPrice: formatPrice(oldColumns.AUD_price as number, Currency.Aud),
      newPrice: formatPrice(newColumns.AUD_price as number, Currency.Aud),
    })
  }

  if (nzdPriceHasChanged) {
    return t('priceChangeNzd', {
      oldPrice: formatPrice(oldColumns.NZD_price as number, Currency.Nzd),
      newPrice: formatPrice(newColumns.NZD_price as number, Currency.Nzd),
    })
  }
}

export const useOrgResourcePacksPricingGetChangeEvent = () => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.changelogs.changeEvents',
  )

  const getChangeEvent = useCallback(
    (event: OrgResourcePacksPricingChangelogUpdatedColumns) => {
      const { new: newColumns, old: oldColumns } = event

      return formatChangeEventPrices(t, oldColumns, newColumns)
    },
    [t],
  )

  return getChangeEvent
}
