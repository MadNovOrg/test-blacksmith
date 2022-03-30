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
    reaccreditation?: boolean
    description?: string
    trainer_profile_id: string
    min_participants?: number
    max_participants?: number
    leaders: {
      data: [
        {
          profile_id: string
          type: CourseTrainerType
        }
      ]
    }
    schedule: {
      data: [
        {
          name: string
          type: string
          start: Date
          end: Date
          venue: {
            data: {
              name: string
              address?: {
                city?: string
                country?: string
                addressLineOne?: string
                addressLineTwo?: string
              }
              geoCoordinates: string
            }
          }
        }
      ]
    }
  }
}

export type ResponseType = {
  affectedRows: number
}

export const MUTATION = gql`
  mutation InsertCourse($course: course_insert_input!) {
    insert_course(objects: [$course]) {
      affectedRows: affected_rows
    }
  }
`
