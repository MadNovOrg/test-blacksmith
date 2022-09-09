import { gql } from 'graphql-request'

import { CourseDeliveryType, CourseLevel, CourseTrainerType } from '@app/types'

export type ParamsType = {
  courseId: string
  scheduleId: string
  courseInput: {
    name: string
    deliveryType: CourseDeliveryType
    level?: CourseLevel
    organization_id?: string
    contactProfileId?: string
    salesRepresentativeId?: string
    reaccreditation?: boolean
    go1Integration?: boolean
    aolCostOfCourse?: number
    description?: string
    min_participants?: number
    max_participants?: number
    freeSpaces?: number
  }
  scheduleInput: {
    start: Date
    end: Date
    venue_id?: string
    virtualLink?: string
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
