import { gql } from 'graphql-request'

import {
  Course_Expenses_Insert_Input,
  Course_Status_Enum,
  Order_Insert_Input,
} from '@app/generated/graphql'
import {
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
    level?: CourseLevel
    organization_id?: string
    contactProfileId?: string
    salesRepresentativeId?: string
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
    status:
      | Course_Status_Enum.ApprovalPending
      | Course_Status_Enum.TrainerPending
      | Course_Status_Enum.TrainerMissing
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
  }
}

export type ResponseType = {
  insertCourse: {
    affectedRows: number
    inserted: Array<{
      id: string
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
        expenses {
          id
        }
      }
    }
  }
`
