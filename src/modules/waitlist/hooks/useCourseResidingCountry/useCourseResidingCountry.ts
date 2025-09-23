import { gql, useQuery } from 'urql'

import {
  GetCourseResidingCountryQuery,
  GetCourseResidingCountryQueryVariables,
} from '@app/generated/graphql'

export const GET_COURSE_RESIDING_COUNTRY = gql`
  query GetCourseResidingCountry($courseId: Int!) {
    course(where: { id: { _eq: $courseId } }) {
      residingCountry
    }
  }
`

export const useCourseResidingCountry = ({
  courseId,
}: {
  courseId: number
}) => {
  return useQuery<
    GetCourseResidingCountryQuery,
    GetCourseResidingCountryQueryVariables
  >({ query: GET_COURSE_RESIDING_COUNTRY, variables: { courseId } })
}
