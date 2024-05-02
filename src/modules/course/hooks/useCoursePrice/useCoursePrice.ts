import { isValid } from 'date-fns'
import { useMemo, useCallback } from 'react'
import { useQuery, gql } from 'urql'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  CoursePriceQuery,
  CoursePriceQueryVariables,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

export const COURSE_PRICE_QUERY = gql`
  query CoursePrice($startDate: date) {
    coursePrice: course_pricing {
      level
      type
      blended
      reaccreditation
      pricingSchedules(
        where: {
          _and: [
            { effectiveFrom: { _lte: $startDate } }
            { effectiveTo: { _gte: $startDate } }
          ]
        }
      ) {
        priceAmount
        priceCurrency
      }
    }
  }
`

interface ICoursePrice {
  level: Course_Level_Enum
  type: Course_Type_Enum
  blended: boolean
  reaccreditation: boolean
  pricingSchedules?: {
    priceAmount: number
    priceCurrency: string
  }[]
}

export function useCoursePrice(courseData?: {
  accreditedBy: Accreditors_Enum | null
  startDateTime: Date | null
  residingCountry: WorldCountriesCodes
  courseType: Course_Type_Enum
  courseLevel: Course_Level_Enum
  reaccreditation: boolean
  blended: boolean
  maxParticipants: number | null
}) {
  const { isUKCountry } = useWorldCountries()
  const isBILDcourse = courseData?.accreditedBy === Accreditors_Enum.Bild
  const isICMcourse = courseData?.accreditedBy === Accreditors_Enum.Icm
  const isCLOSEDcourse = courseData?.courseType === Course_Type_Enum.Closed
  const isLevel2 = courseData?.courseLevel === Course_Level_Enum.Level_2

  const pauseQuery =
    !courseData ||
    !isValid(courseData?.startDateTime) ||
    isBILDcourse ||
    !isUKCountry(courseData.residingCountry)

  const [{ data }] = useQuery<CoursePriceQuery, CoursePriceQueryVariables>({
    query: COURSE_PRICE_QUERY,
    variables: courseData
      ? {
          startDate: isValid(courseData?.startDateTime)
            ? courseData.startDateTime?.toISOString()
            : undefined,
        }
      : undefined,
    pause: pauseQuery,
  })

  const extractCoursePrices = useCallback(
    (pricesList?: ICoursePrice[]) => {
      const coursePrice = pricesList?.find(price => {
        if (
          price.type === courseData?.courseType &&
          price.level === courseData?.courseLevel &&
          Boolean(price.blended) === Boolean(courseData?.blended) &&
          Boolean(price.reaccreditation) ===
            Boolean(courseData?.reaccreditation)
        ) {
          return price
        }
        return null
      })

      if (
        coursePrice?.pricingSchedules &&
        Array.isArray(coursePrice.pricingSchedules)
      ) {
        const scheduledPrice = coursePrice.pricingSchedules
        if (scheduledPrice.length !== 0) {
          if (
            isCLOSEDcourse &&
            isICMcourse &&
            isLevel2 &&
            (!courseData.maxParticipants || courseData?.maxParticipants <= 8)
          ) {
            return null
          }

          return {
            priceCurrency: scheduledPrice[0].priceCurrency,
            priceAmount: scheduledPrice[0].priceAmount,
          }
        }
        return null
      }

      return null
    },
    [
      courseData?.blended,
      courseData?.courseLevel,
      courseData?.courseType,
      courseData?.maxParticipants,
      courseData?.reaccreditation,
      isCLOSEDcourse,
      isICMcourse,
      isLevel2,
    ]
  )

  return useMemo(
    () => extractCoursePrices(data?.coursePrice),
    [data?.coursePrice, extractCoursePrices]
  )
}
