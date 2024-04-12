import Big from 'big.js'

import {
  UKsCountriesCodes,
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Renewal_Cycle_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { Go1LicensingPrices, ValidCourseInput } from '@app/types'

export const PRICE_PER_LICENSE = 50

export const setManualPriceOnCourse = (
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum,
  accreditedBy: Accreditors_Enum,
  blended: boolean,
  residingCountry: WorldCountriesCodes
) => {
  const isUKcountry = Object.keys(UKsCountriesCodes).includes(residingCountry)
  const isICMcourse = accreditedBy === Accreditors_Enum.Icm
  const isBILDcourse = accreditedBy === Accreditors_Enum.Bild
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isLevel2 = courseLevel === Course_Level_Enum.Level_2

  const specialUKcountryCondition =
    isICMcourse && isClosedCourse && isLevel2 && blended

  if (!isUKcountry || isBILDcourse || specialUKcountryCondition) {
    return true
  }

  return false
}

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
