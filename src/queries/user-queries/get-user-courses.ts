import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { CourseTrainerInfo } from '../fragments'

export type ResponseType = { courses: Course[] }

export type ParamsType = {
  orderBy?: object
  where?: object
  profileId: string
}

export const QUERY = gql`
  ${CourseTrainerInfo}

  fragment UserCourse on course {
    id
    name
    type
    level
    status
    course_code
    createdAt
    max_participants
    trainers {
      ...CourseTrainerInfo
    }
    schedule {
      id
      start
      end
      venue {
        id
        name
        city
      }
      virtualLink
    }
    participants(where: { profile_id: { _eq: $profileId } }) {
      healthSafetyConsent
      grade
      attended
    }
    organization {
      id
      name
    }
    evaluation_answers_aggregate(
      distinct_on: profileId
      where: { profileId: { _eq: $profileId } }
    ) {
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
    cancellationRequest {
      id
    }
  }

  query UserCourses(
    $orderBy: [course_order_by!] = { name: asc }
    $where: course_bool_exp = {}
    $profileId: uuid!
    $offset: Int
    $limit: Int
    $withParticipantAggregates: Boolean = false
    $withParticipants: Boolean = false
  ) {
    courses: course(
      where: $where
      order_by: $orderBy
      offset: $offset
      limit: $limit
    ) {
      ...UserCourse
      participantsAgg: participants_aggregate
        @include(if: $withParticipantAggregates) {
        aggregate {
          count
        }
      }
      courseParticipants: participants @include(if: $withParticipants) {
        healthSafetyConsent
        grade
        attended
      }
      waitlistAgg: waitlists_aggregate
        @include(if: $withParticipantAggregates) {
        aggregate {
          count
        }
      }
    }
    course_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
