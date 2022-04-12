import { gql } from 'graphql-request'

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
