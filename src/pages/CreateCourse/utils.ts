import { Go1LicensingPrices } from '@app/types'

export const PRICE_PER_LICENSE = 25

export function calculateGo1LicenseCost(
  numberOfLicenses: number,
  licenseBalance: number
): Go1LicensingPrices {
  const fullPrice = numberOfLicenses * PRICE_PER_LICENSE
  const allowancePrice =
    numberOfLicenses > licenseBalance
      ? licenseBalance * PRICE_PER_LICENSE
      : numberOfLicenses * PRICE_PER_LICENSE

  const vat = (fullPrice - allowancePrice) * 0.2
  const amountDue = fullPrice - allowancePrice + vat

  return { vat, amountDue, subtotal: fullPrice, allowancePrice }
}
