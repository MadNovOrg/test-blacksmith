import { gql } from 'graphql-request'

import { Course } from '@app/types'

export type ResponseType = { course: Course[] }

export type ParamsType = {
  orderBy?: object
  where?: object
}

export const QUERY = gql`
  fragment TrainerCourse on course {
    id
    name
    type
    level
    status
    course_code
    organization {
      name
    }
    trainers {
      id
      type
      status
      profile {
        id
        fullName
      }
    }
    max_participants
    participantsAgg: participants_aggregate {
      aggregate {
        count
      }
    }
    waitlistAgg: waitlists_aggregate {
      aggregate {
        count
      }
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
    schedule {
      id
      venue {
        id
        name
        city
      }
      virtualLink
    }
  }

  query TrainerCourses(
    $orderBy: [course_order_by!] = { name: asc }
    $where: course_bool_exp = {}
    $offset: Int
    $limit: Int
  ) {
    courses: course(
      where: $where
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
      ...TrainerCourse
    }
    course_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
