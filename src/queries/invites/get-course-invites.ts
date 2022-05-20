import { gql } from 'graphql-request'

import { CourseInvite } from '@app/types'

export type ResponseType = {
  courseInvites: CourseInvite[]
  courseInvitesAggregate: { aggregate: { count: number } }
}

export type ParamsType = {
  courseId: string
  where?: object
  orderBy?: object | null
  limit?: number
  offset?: number
}

export const Matcher = /(query GetCourseInvites)/i

export const QUERY = gql`
  query GetCourseInvites(
    $courseId: Int!
    $limit: Int = 20
    $offset: Int = 0
    $where: course_invites_bool_exp = {}
    $orderBy: [course_invites_order_by!] = { email: asc }
  ) {
    courseInvites: course_invites(
      where: { _and: [{ course_id: { _eq: $courseId } }, $where] }
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      email
      status
    }
    courseInvitesAggregate: course_invites_aggregate(
      where: { _and: [{ course_id: { _eq: $courseId } }, $where] }
    ) {
      aggregate {
        count
      }
    }
  }
`
