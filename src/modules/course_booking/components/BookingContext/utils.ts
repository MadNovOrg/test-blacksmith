import { t } from 'i18next'

import {
  Accreditors_Enum,
  Currency,
  GetCoursePricingQuery,
  GetTempProfileQuery,
} from '@app/generated/graphql'
import { CourseExpenseType, TransportMethod } from '@app/types'
import { getTrainerSubsistenceCost, getTrainerCarCostPerMile } from '@app/util'

export const getTrainerExpenses = ({
  course,
  isUKCountry,
}: {
  course: GetTempProfileQuery['tempProfiles'][0]['course']
  isUKCountry: (country?: string | null) => boolean
}) => {
  return (
    course?.expenses?.reduce((acc, { data: e }) => {
      switch (e.type) {
        case CourseExpenseType.Accommodation:
          return (
            acc +
            getTrainerSubsistenceCost(
              e.accommodationNights,
              isUKCountry(course?.residingCountry),
            ) +
            e.accommodationCost * e.accommodationNights
          )

        case CourseExpenseType.Miscellaneous:
          return acc + e.cost

        case CourseExpenseType.Transport:
          if (e.method === TransportMethod.CAR) {
            return acc + getTrainerCarCostPerMile(e.mileage)
          }

          if (e.method === TransportMethod.NONE) {
            return acc
          }

          return acc + e.cost

        default:
          return acc
      }
    }, 0) ?? 0
  )
}

export const setCoursePricing = ({
  setError,
  profile,
  isUKCountry,
  coursePricing,
}: {
  setError: (value: React.SetStateAction<string | null>) => void
  profile: GetTempProfileQuery['tempProfiles'][0]
  isUKCountry: (country?: string | null) => boolean
  coursePricing?: GetCoursePricingQuery
}): GetCoursePricingQuery['pricing'] => {
  const course = profile.course
  const courseHasPrice = Boolean(course?.price)
  const courseResidingCountry = course?.residingCountry
  const isBILDcourse = course?.accreditedBy === Accreditors_Enum.Bild

  if (courseHasPrice && (!isUKCountry(courseResidingCountry) || isBILDcourse)) {
    return {
      priceAmount: course?.price,
      priceCurrency: (course?.priceCurrency as Currency) ?? 'GBP',
      xeroCode: '',
    }
  } else {
    if (!coursePricing) setError(t('error-no-pricing'))
    return {
      priceAmount: Number(coursePricing?.pricing?.priceAmount),
      priceCurrency: coursePricing?.pricing?.priceCurrency as Currency,
      xeroCode: coursePricing?.pricing?.xeroCode ?? '',
    }
  }
}
