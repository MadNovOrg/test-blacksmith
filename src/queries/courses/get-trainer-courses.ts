import { gql } from 'graphql-request'

import { Course } from '@app/types'

export type ResponseType = { course: Course[] }

export type ParamsType = {
  orderBy?: object
  where?: object
}

export const QUERY = gql`
  query Courses(
    $orderBy: [course_order_by!] = { name: asc }
    $where: course_bool_exp = {}
  ) {
    course(where: $where, order_by: $orderBy) {
      id
      name
      type
      level
      status
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
      modulesAgg: modules_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
