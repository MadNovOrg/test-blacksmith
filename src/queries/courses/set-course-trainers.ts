import { gql } from 'graphql-request'

import {
  Trainer,
  SetCourseTrainerInput,
} from '@app/pages/TrainerBase/components/CreateCourse/components/AssignTrainers/types'
import { Course, CourseTrainerType } from '@app/types'

export const SetCourseTrainer = gql`
  mutation SetCourseTrainers(
    $courseId: Int!
    $trainers: [course_trainer_insert_input!]!
  ) {
    delete_course_trainer(where: { course_id: { _eq: $courseId } }) {
      returning {
        id
      }
    }

    insert_course_trainer(objects: $trainers) {
      returning {
        id
      }
    }
  }
`

export const profileToInput = (course: Course, type: CourseTrainerType) => {
  return (p: Trainer): SetCourseTrainerInput => ({
    course_id: course.id,
    profile_id: p.id,
    type,
  })
}
