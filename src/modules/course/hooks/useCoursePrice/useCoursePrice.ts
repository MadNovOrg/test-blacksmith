import { isValid } from 'date-fns'
import { useMemo } from 'react'
import { useQuery, gql } from 'urql'

import {
  Accreditors_Enum,
  CoursePriceQuery,
  CoursePriceQueryVariables,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

export const COURSE_PRICE_QUERY = gql`
  query CoursePrice(
    $type: course_type_enum!
    $level: course_level_enum!
    $blended: Boolean!
    $reaccreditation: Boolean!
    $startDate: date
    $withSchedule: Boolean!
  ) {
    coursePrice: course_pricing(
      where: {
        type: { _eq: $type }
        level: { _eq: $level }
        blended: { _eq: $blended }
        reaccreditation: { _eq: $reaccreditation }
      }
    ) {
      priceAmount
      priceCurrency
      pricingSchedules(
        where: {
          _and: [
            { effectiveFrom: { _lte: $startDate } }
            { effectiveTo: { _gte: $startDate } }
          ]
        }
        limit: 1
      ) @include(if: $withSchedule) {
        id
        priceAmount
        priceCurrency
      }
    }
  }
`

export function useCoursePrice(courseData?: {
  type: Course_Type_Enum
  courseLevel: Course_Level_Enum
  blendedLearning: boolean
  reaccreditation: boolean
  accreditedBy: Accreditors_Enum
  price?: number | null
  startDateTime?: Date
}) {
  const [{ data, fetching, error }] = useQuery<
    CoursePriceQuery,
    CoursePriceQueryVariables
  >({
    query: COURSE_PRICE_QUERY,
    variables: courseData
      ? {
          type: courseData.type,
          level: courseData.courseLevel as unknown as Course_Level_Enum,
          blended: courseData.blendedLearning,
          reaccreditation: courseData?.reaccreditation,
          startDate: isValid(courseData.startDateTime)
            ? courseData.startDateTime?.toISOString()
            : undefined,
          withSchedule: Boolean(courseData.startDateTime),
        }
      : undefined,
    pause: !courseData || courseData.accreditedBy === Accreditors_Enum.Bild,
  })

  const pricing = data?.coursePrice?.length ? data.coursePrice[0] : null

  const schedule =
    pricing?.pricingSchedules?.length === 1 ? pricing.pricingSchedules[0] : null

  const price = useMemo(() => {
    if (courseData?.price) {
      return courseData.price
    }

    if (schedule?.priceAmount) {
      return schedule.priceAmount
    }

    return pricing?.priceAmount
  }, [courseData?.price, pricing?.priceAmount, schedule?.priceAmount])

  const currency = useMemo(() => {
    if (courseData?.price) {
      return 'GBP'
    }

    if (schedule) {
      return schedule.priceCurrency
    }

    return pricing?.priceCurrency
  }, [courseData?.price, pricing?.priceCurrency, schedule])

  return { price, error, fetching, currency }
}
