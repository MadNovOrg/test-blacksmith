import { gql } from 'graphql-request'

import { CourseParticipant } from '@app/types'

export type ResponseType = { courseParticipants: CourseParticipant[] }

export type ParamsType = { where: { profile: { id: { _eq: string } } } }

export const QUERY = gql`
  query GetCourseParticipants($where: course_participant_bool_exp!) {
    courseParticipants: course_participant(
      where: $where
      order_by: { certificate: { expiryDate: desc } }
    ) {
      id
      grade
      course {
        type
        name
        level
      }
      certificate {
        id
        number
        expiryDate
      }
    }
  }
`
