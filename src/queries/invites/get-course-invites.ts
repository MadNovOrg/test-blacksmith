import { gql } from 'graphql-request'

import { CourseInvite } from '@app/types'

export type ResponseType = {
  courseInvites: CourseInvite[]
  courseInvitesAggregate: { aggregate: { count: number } }
}

export type ParamsType = { courseId: string }

export const QUERY = gql`
  query GetCourseInvites($courseId: uuid!) {
    courseInvites: course_invites(where: { course_id: { _eq: $courseId } }) {
      id
      email
      status
    }
    courseInvitesAggregate: course_invites_aggregate(
      where: { course_id: { _eq: $courseId } }
    ) {
      aggregate {
        count
      }
    }
  }
`
