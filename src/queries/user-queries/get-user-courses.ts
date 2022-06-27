import { gql } from 'graphql-request'

import { Course } from '@app/types'

export type ResponseType = { course: Course[] }

export type ParamsType = {
  orderBy?: object
  where?: object
}

export const QUERY = gql`
  query UserCourses(
    $orderBy: [course_order_by!] = { name: asc }
    $where: course_bool_exp = {}
  ) {
    course(where: $where, order_by: $orderBy) {
      id
      name
      type
      level
      trainers {
        id
        type
        status
        profile {
          id
          fullName
        }
      }
      schedule {
        id
        venue {
          id
          name
          city
        }
        virtualLink
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
