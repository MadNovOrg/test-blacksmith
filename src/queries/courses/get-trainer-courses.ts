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
    state
    status
    createdAt
    course_code
    go1Integration
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
        avatar
        archived
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
    curriculum
    bildModules {
      id
    }
    isDraft
    schedule {
      id
      start
      end
      venue {
        id
        name
        city
      }
      timeZone
      virtualLink
    }
    cancellationRequest {
      id
    }
  }

  query TrainerCourses(
    $orderBy: [course_order_by!] = { name: asc }
    $where: course_bool_exp = {}
    $offset: Int
    $limit: Int
    $withArloRefId: Boolean = false
    $withParticipants: Boolean = false
  ) {
    courses: course(
      where: $where
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
      ...TrainerCourse
      # TODO: Delete this after Arlo migration
      arloReferenceId @include(if: $withArloRefId)

      courseParticipants: participants @include(if: $withParticipants) {
        healthSafetyConsent
        grade
        attended
      }
    }
    course_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
