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
  ModuleSettingsQuery,
} from '@app/generated/graphql'
import { Go1LicensingPrices, ValidCourseInput } from '@app/types'

import { BILDBuilderCourseData } from '../CourseBuilder/components/BILDCourseBuilder/BILDCourseBuilder'
import { ICMBuilderCourseData } from '../CourseBuilder/components/ICMCourseBuilderV2/ICMCourseBuilderV2'

export const PRICE_PER_LICENSE = 50

export const priceFieldIsMandatory = ({
  accreditedBy,
  courseType,
  courseLevel,
  blendedLearning,
  maxParticipants,
  residingCountry,
}: {
  accreditedBy: Accreditors_Enum
  courseType: Course_Type_Enum
  courseLevel: Course_Level_Enum
  blendedLearning: boolean
  maxParticipants: number
  residingCountry: WorldCountriesCodes
}) => {
  const isBILDcourse = accreditedBy === Accreditors_Enum.Bild
  const isICMcourse = accreditedBy === Accreditors_Enum.Icm
  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isLEVEL2 = courseLevel === Course_Level_Enum.Level_2
  const isUKcountry = Object.keys(UKsCountriesCodes).includes(residingCountry)

  const specialUKcountryCondition =
    isICMcourse &&
    isClosedCourse &&
    isLEVEL2 &&
    blendedLearning &&
    isUKcountry &&
    maxParticipants <= 8

  if (
    specialUKcountryCondition ||
    (!isUKcountry && !isIndirectCourse) ||
    (isBILDcourse && !isIndirectCourse)
  ) {
    return true
  }

  return false
}

export const courseWithManualPrice = ({
  accreditedBy,
  courseType,
  courseLevel,
  blendedLearning,
  maxParticipants,
  residingCountry,
  internationalFlagEnabled,
}: {
  accreditedBy: Accreditors_Enum
  courseType: Course_Type_Enum
  courseLevel: Course_Level_Enum
  blendedLearning: boolean
  maxParticipants: number
  residingCountry: WorldCountriesCodes
  internationalFlagEnabled: boolean
}) => {
  const isBILDcourse = accreditedBy === Accreditors_Enum.Bild
  const isICMcourse = accreditedBy === Accreditors_Enum.Icm
  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const isBLIndirectCourse = isIndirectCourse && blendedLearning
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isOpenCourse = courseType === Course_Type_Enum.Open
  const isLEVEL2 = courseLevel === Course_Level_Enum.Level_2
  const isUKcountry = Object.keys(UKsCountriesCodes).includes(residingCountry)

  const specialUKcountryCondition =
    isICMcourse &&
    isClosedCourse &&
    isLEVEL2 &&
    blendedLearning &&
    isUKcountry &&
    maxParticipants <= 8

  if (
    specialUKcountryCondition ||
    (isBILDcourse && !(isIndirectCourse && !blendedLearning)) ||
    isBLIndirectCourse
  ) {
    return true
  }

  if (!isUKcountry && (isClosedCourse || isOpenCourse) && isICMcourse) {
    if (!internationalFlagEnabled) {
      return false
    }
    return true
  }

  return false
}

export const isCourseWithNoPrice = ({
  courseType,
  blendedLearning,
}: {
  courseType: Course_Type_Enum
  blendedLearning: boolean
}) => {
  return courseType === Course_Type_Enum.Indirect && !blendedLearning
}

export function calculateGo1LicenseCost(
  numberOfLicenses: number,
  licenseBalance: number,
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
  if (courseData.courseLevel === Course_Level_Enum.Level_1Bs)
    return Course_Renewal_Cycle_Enum.One
  return null
}

export type BuilderCourseData<T> = T extends Accreditors_Enum.Icm
  ? ICMBuilderCourseData
  : T extends Accreditors_Enum.Bild
  ? BILDBuilderCourseData
  : never

export const mapCourseFormInputToBuilderCourseData = ({
  courseData,
  curriculum = [],
  go1Integration = false,
  name,
}: {
  courseData: ValidCourseInput
  curriculum?: ModuleSettingsQuery['moduleSettings'][0]['module'][]
  go1Integration?: boolean
  name: string
}): BuilderCourseData<Accreditors_Enum> => {
  return {
    course: {
      ...courseData,
      course_code: '',
      curriculum: curriculum.length ? curriculum : undefined,
      deliveryType: courseData.deliveryType,
      go1Integration,
      id: 0,
      isDraft: false,
      level: courseData.courseLevel,
      name,
      schedule: [
        {
          end: courseData.endDate.toISOString(),
          start: courseData.startDate.toISOString(),
          timeZone: courseData.timeZone?.timeZoneId as string,
          venue: courseData.venue,
        },
      ],
      type: courseData.type,
      updatedAt: '',
      ...(courseData.accreditedBy === Accreditors_Enum.Bild
        ? {
            bildStrategies: Object.entries(courseData.bildStrategies)
              .filter(([, value]) => value === true)
              .map(([key]) => ({
                strategyName: key,
              })),
          }
        : {}),
    },
  }
}
