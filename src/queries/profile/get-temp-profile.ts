import { gql } from 'graphql-request'

import { Accreditors_Enum } from '@app/generated/graphql'
import {
  Course,
  CourseDeliveryType,
  CourseExpenseData,
  CourseLevel,
  CourseType,
  Venue,
} from '@app/types'

import { COURSE_DATES, VENUE } from '../fragments'

export type ResponseType = {
  tempProfiles: {
    course: {
      id: number
      name: string
      accreditedBy: Accreditors_Enum
      dates: Course['dates']
      deliveryType: CourseDeliveryType
      level: CourseLevel
      reaccreditation: boolean
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
        accreditedBy
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
        reaccreditation
        freeSpaces
        expenses {
          id
          data
          trainer {
            id
            fullName
            avatar
            archived
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
