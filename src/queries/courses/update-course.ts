import { gql } from 'graphql-request'

import { Course_Source_Enum, Course_Status_Enum } from '@app/generated/graphql'
import { CourseDeliveryType, CourseLevel, CourseTrainerType } from '@app/types'

export type ParamsType = {
  courseId: number
  scheduleId: string
  courseInput: {
    status: Course_Status_Enum | null
    exceptionsPending?: boolean
    name: string
    deliveryType: CourseDeliveryType
    level?: CourseLevel
    organization_id?: string
    bookingContactProfileId?: string | null
    source?: Course_Source_Enum
    reaccreditation?: boolean
    go1Integration?: boolean
    aolCostOfCourse?: number
    description?: string
    aolCountry?: string
    aolRegion?: string
    min_participants?: number
    max_participants?: number
    freeSpaces?: number
    notes?: string
    special_instructions?: string
    parking_instructions?: string
  }
  orderInput: {
    salesRepresentativeId: string
    source: Course_Source_Enum
  }
  scheduleInput: {
    start: Date
    end: Date
    venue_id?: string | null
    virtualLink?: string
    virtualAccountId?: string
  }
  trainers: Array<{
    profile_id: string
    type: CourseTrainerType
    course_id: number
  }>
}

export type ResponseType = {
  updateCourse: {
    id: number
  }
}

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse(
    $courseId: Int!
    $courseInput: course_set_input!
    $orderInput: order_set_input!
    $scheduleId: uuid!
    $scheduleInput: course_schedule_set_input!
    $trainers: [course_trainer_insert_input!]!
  ) {
    updateCourse: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: $courseInput
    ) {
      id
      level
    }

    updateOrder: update_order(
      where: { courseId: { _eq: $courseId } }
      _set: $orderInput
    ) {
      affectedRows: affected_rows
    }

    updateSchedule: update_course_schedule_by_pk(
      pk_columns: { id: $scheduleId }
      _set: $scheduleInput
    ) {
      id
    }

    deleteCourseTrainers: delete_course_trainer(
      where: { course_id: { _eq: $courseId } }
    ) {
      returning {
        id
      }
    }

    insertCourseTrainers: insert_course_trainer(objects: $trainers) {
      returning {
        id
      }
    }
  }
`
