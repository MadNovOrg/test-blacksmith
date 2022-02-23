import { gql } from 'graphql-request'

import { Course } from '@app/types'

export type ResponseType = { course: Course[] }

export type ParamsType = {
  orderBy?: Record<string, 'asc' | 'desc'> // TODO: restrict column names
}

export const QUERY = gql`
  query MyCourses($orderBy: [course_order_by!] = { name: asc }) {
    course(where: { type: { _in: [open, closed] } }, order_by: $orderBy) {
      id
      name
      type
      level
      submitted
      organization {
        name
      }
      dates: schedule_aggregate {
        aggregate {
          start: min {
            date: start
          }
          end: max {
            date: end
          }
        }
      }
    }
  }
`
