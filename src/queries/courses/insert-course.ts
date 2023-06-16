import { gql } from 'graphql-request'

import {
  Accreditors_Enum,
  Course_Expenses_Insert_Input,
  Course_Status_Enum,
  Order_Insert_Input,
} from '@app/generated/graphql'
import {
  BildStrategies,
  CourseDeliveryType,
  CourseLevel,
  CourseTrainerType,
  CourseType,
} from '@app/types'

export type ParamsType = {
  course: {
    name: string
    type: CourseType
    deliveryType: CourseDeliveryType
    accreditedBy: Accreditors_Enum
    bildStrategies?: { data: Array<{ strategyName: BildStrategies }> }
    level?: CourseLevel
    organization_id?: string
    bookingContactProfileId?: string
    reaccreditation?: boolean
    go1Integration?: boolean
    aolCostOfCourse?: number
    aolCountry?: string
    aolRegion?: string
    description?: string
    min_participants?: number
    max_participants?: number
    freeSpaces?: number
    accountCode?: string
    notes?: string
    special_instructions?: string
    parking_instructions?: string
    status:
      | Course_Status_Enum.ApprovalPending
      | Course_Status_Enum.TrainerPending
      | Course_Status_Enum.TrainerMissing
      | Course_Status_Enum.ExceptionsApprovalPending
    exceptionsPending?: boolean
    trainers?: {
      data: Array<{
        profile_id: string
        type: CourseTrainerType
      }>
    }
    schedule: {
      data: [
        {
          start: Date
          end: Date
          venue_id?: string
          virtualLink?: string
        }
      ]
    }
    expenses?: {
      data: Array<Course_Expenses_Insert_Input>
    }
    orders?: {
      data: Array<Order_Insert_Input>
    }
    conversion?: boolean
    price?: number | null
  }
}

export type ResponseType = {
  insertCourse: {
    affectedRows: number
    inserted: Array<{
      id: string
      course_code: string
      expenses?: Array<{ id: string }>
      orders?: Array<{ id: string }>
    }>
  }
}

export const MUTATION = gql`
  mutation InsertCourse($course: course_insert_input!) {
    insertCourse: insert_course(objects: [$course]) {
      affectedRows: affected_rows
      inserted: returning {
        id
        course_code
        expenses {
          id
        }
      }
    }
  }
`
