import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE_DATES } from '../fragments'

export type ResponseType = {
  tempProfiles: {
    course: {
      id: number
      name: string
      dates: Course['dates']
      maxParticipants: number
      participants: {
        aggregate: {
          count: number
        }
      }
    }
    quantity: number
  }[]
}

export const QUERY = gql`
  ${COURSE_DATES}
  query GetTempProfile {
    tempProfiles: profile_temp(order_by: { createdAt: desc }, limit: 1) {
      course {
        id
        name
        dates: schedule_aggregate {
          ...CourseDates
        }
        maxParticipants: max_participants
        participants: participants_aggregate {
          aggregate {
            count
          }
        }
      }
      quantity
    }
  }
`
