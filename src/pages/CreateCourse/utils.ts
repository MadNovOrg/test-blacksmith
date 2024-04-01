import Big from 'big.js'

import {
  Course_Level_Enum,
  Course_Renewal_Cycle_Enum,
} from '@app/generated/graphql'
import { Go1LicensingPrices, ValidCourseInput } from '@app/types'

export const PRICE_PER_LICENSE = 50

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

export const getCourseRenewalCycle = (courseData: ValidCourseInput) => {
  if (courseData.renewalCycle) return courseData.renewalCycle
  if (courseData.courseLevel === Course_Level_Enum.Level_1Mva)
    return Course_Renewal_Cycle_Enum.One
  return null
}
