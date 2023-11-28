import { gql } from 'graphql-request'

import {
  Accreditors_Enum,
  Course_Expenses_Insert_Input,
  Course_Renewal_Cycle_Enum,
  Course_Status_Enum,
  Order_Insert_Input,
  Course_Level_Enum,
  Course_Delivery_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { BildStrategies, CourseTrainerType } from '@app/types'

export type ParamsType = {
  course: {
    name: string
    type: Course_Type_Enum
    deliveryType: Course_Delivery_Type_Enum
    accreditedBy: Accreditors_Enum
    displayOnWebsite?: boolean
    bildStrategies?: { data: Array<{ strategyName: BildStrategies }> }
    level?: Course_Level_Enum
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
    special_instructions?: string
    parking_instructions?: string
    status:
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
          virtualAccountId?: string
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
    renewalCycle?: Course_Renewal_Cycle_Enum
    /// TODO: Delete this after Arlo migration
    arloReferenceId?: string
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
        orders {
          id
        }
        expenses {
          id
        }
      }
    }
  }
`
