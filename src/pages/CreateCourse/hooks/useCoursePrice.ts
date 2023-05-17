import { useQuery, gql } from 'urql'

import {
  Accreditors_Enum,
  CoursePriceQuery,
  CoursePriceQueryVariables,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { ContextValue } from '../types'

export const COURSE_PRICE_QUERY = gql`
  query CoursePrice(
    $type: course_type_enum!
    $level: course_level_enum!
    $blended: Boolean!
    $reaccreditation: Boolean!
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
    }
  }
`

export function useCoursePrice(courseData: ContextValue['courseData']) {
  const [{ data, fetching, error }] = useQuery<
    CoursePriceQuery,
    CoursePriceQueryVariables
  >({
    query: COURSE_PRICE_QUERY,
    variables: courseData
      ? {
          type: courseData.type as unknown as Course_Type_Enum,
          level: courseData.courseLevel as unknown as Course_Level_Enum,
          blended: courseData.blendedLearning,
          reaccreditation: courseData?.reaccreditation,
        }
      : undefined,
    pause: !courseData || courseData.accreditedBy === Accreditors_Enum.Bild,
  })

  const pricing = data?.coursePrice?.length ? data.coursePrice[0] : null

  const price = courseData?.price ?? pricing?.priceAmount
  const currency = courseData?.price ? 'GBP' : pricing?.priceCurrency

  return { price, error, fetching, currency }
}
