import { gql } from 'graphql-request'

import {
  Course,
  CourseExpenseData,
  CourseType,
  Venue,
  CourseLevel,
  CourseDeliveryType,
} from '@app/types'

import { COURSE_DATES, VENUE } from '../fragments'

export type ResponseType = {
  tempProfiles: {
    course: {
      id: number
      name: string
      dates: Course['dates']
      deliveryType: CourseDeliveryType
      level: CourseLevel
      maxParticipants: number
      participants: {
        aggregate: {
          count: number
        }
      }
      type: CourseType
      freeSpaces?: number
      expenses?: Array<{
        id: string
        data: CourseExpenseData
        trainer: {
          id: string
          fullName: string
        }
      }>
      schedule: Array<{
        venue: Venue
      }>
    }
    quantity: number
  }[]
}

export const QUERY = gql`
  ${COURSE_DATES}
  ${VENUE}
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
        type
        deliveryType
        level
        freeSpaces
        expenses {
          id
          data
          trainer {
            id
            fullName
          }
        }
        schedule {
          venue {
            ...Venue
          }
        }
      }
      quantity
    }
  }
`
