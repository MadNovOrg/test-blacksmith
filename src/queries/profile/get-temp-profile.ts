import { gql } from 'graphql-request'

import { Course_Expense_Type_Enum } from '@app/generated/graphql'
import { Course, CourseType } from '@app/types'

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
      type: CourseType
      freeSpaces?: number
      expenses?: Array<{
        id: string
        type: Course_Expense_Type_Enum
        description: string
        value: number
        trainer: {
          id: string
          fullName: string
        }
      }>
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
        type
        freeSpaces
        expenses {
          id
          type
          description
          value
          trainer {
            id
            fullName
          }
        }
      }
      quantity
    }
  }
`
