import { gql } from 'graphql-request'

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
    reaccreditation?: boolean
    go1Integration?: boolean
    aolCostOfCourse?: number
    description?: string
    min_participants?: number
    max_participants?: number
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
  }
}

export type ResponseType = {
  insertCourse: {
    affectedRows: number
    inserted: Array<{ id: string }>
  }
}

export const MUTATION = gql`
  mutation InsertCourse($course: course_insert_input!) {
    insertCourse: insert_course(objects: [$course]) {
      affectedRows: affected_rows
      inserted: returning {
        id
      }
    }
  }
`
