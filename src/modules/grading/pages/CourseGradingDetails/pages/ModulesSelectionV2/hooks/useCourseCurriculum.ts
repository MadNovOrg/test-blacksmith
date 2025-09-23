import { gql, useQuery } from 'urql'

import {
  CourseCurriculumQuery,
  CourseCurriculumQueryVariables,
} from '@app/generated/graphql'

export const COURSE_CURRICULUM = gql`
  query CourseCurriculum($id: Int!) {
    course: course_by_pk(id: $id) {
      id
      curriculum
    }
  }
`

export function useCourseCurriculum(id: number) {
  return useQuery<CourseCurriculumQuery, CourseCurriculumQueryVariables>({
    query: COURSE_CURRICULUM,
    variables: { id },
  })
}
