import Big from 'big.js'

import { Go1LicensingPrices } from '@app/types'

export const PRICE_PER_LICENSE = 25

export function calculateGo1LicenseCost(
  numberOfLicenses: number,
  licenseBalance: number
): Go1LicensingPrices {
  const fullPrice = new Big(numberOfLicenses).times(PRICE_PER_LICENSE)
  const allowancePrice =
    numberOfLicenses > licenseBalance
      ? new Big(licenseBalance).times(PRICE_PER_LICENSE)
      : new Big(numberOfLicenses).times(PRICE_PER_LICENSE)

  const vat = fullPrice.minus(allowancePrice).times(0.2)
  const amountDue = fullPrice.minus(allowancePrice).add(vat)

  return {
    vat: vat.toNumber(),
    amountDue: amountDue.toNumber(),
    subtotal: fullPrice.toNumber(),
    allowancePrice: allowancePrice.toNumber(),
  }
}
