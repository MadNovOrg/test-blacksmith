import { isValid } from 'date-fns'
import { useMemo, useCallback } from 'react'
import { useQuery, gql } from 'urql'

import {
  Accreditors_Enum,
  CoursePriceQuery,
  CoursePriceQueryVariables,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

export const COURSE_PRICE_QUERY = gql`
  query CoursePrice($startDate: date, $withSchedule: Boolean!) {
    coursePrice: course_pricing {
      id
      level
      type
      blended
      reaccreditation
      priceAmount
      priceCurrency
      pricingSchedules(
        where: {
          _and: [
            { effectiveFrom: { _lte: $startDate } }
            { effectiveTo: { _gte: $startDate } }
          ]
        }
      ) @include(if: $withSchedule) {
        id
        coursePricingId
        priceAmount
        priceCurrency
      }
    }
  }
`

interface ICoursePrice {
  id: string
  level: Course_Level_Enum
  type: Course_Type_Enum
  priceAmount: number
  priceCurrency: string
  blended: boolean
  reaccreditation: boolean
  pricingSchedules?: {
    id: number
    coursePricingId: string
    priceAmount: number
    priceCurrency: string
  }[]
}

export function useCoursePrice(courseData?: {
  accreditedBy: Accreditors_Enum | null
  startDateTime?: Date
}) {
  const [{ data }] = useQuery<CoursePriceQuery, CoursePriceQueryVariables>({
    query: COURSE_PRICE_QUERY,
    variables: courseData
      ? {
          startDate: isValid(courseData?.startDateTime)
            ? courseData.startDateTime?.toISOString()
            : undefined,
          withSchedule: Boolean(courseData?.startDateTime),
        }
      : undefined,
    pause: !courseData || courseData.accreditedBy === Accreditors_Enum.Bild,
  })

  const extractCoursePrices = useCallback((pricesList?: ICoursePrice[]) => {
    const coursePricesList: Omit<ICoursePrice, 'pricingSchedules'>[] = []
    pricesList?.forEach((price: ICoursePrice) => {
      const coursePrice = {
        id: price.id,
        level: price.level,
        type: price.type,
        blended: price.blended,
        reaccreditation: price.reaccreditation,
        priceCurrency: price.priceCurrency,
        priceAmount: price.priceAmount,
      }

      if (price.pricingSchedules && Array.isArray(price.pricingSchedules)) {
        if (price?.pricingSchedules[0]?.coursePricingId === price.id) {
          Object.assign(coursePrice, {
            priceAmount: price.pricingSchedules[0].priceAmount,
          })
        }
      }
      coursePricesList.push(coursePrice)
    })

    return coursePricesList
  }, [])

  return useMemo(
    () => extractCoursePrices(data?.coursePrice),
    [data?.coursePrice, extractCoursePrices]
  )
}
