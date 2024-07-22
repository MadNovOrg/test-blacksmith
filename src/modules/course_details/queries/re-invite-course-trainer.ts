import { gql } from 'graphql-request'

export const RE_INVITE_COURSE_TRAINER_MUTATION = gql`
  mutation ReInviteTrainer(
    $courseTrainerToDelete: uuid!
    $courseTrainer: course_trainer_insert_input!
  ) {
    deleteCourseTrainer: delete_course_trainer_by_pk(
      id: $courseTrainerToDelete
    ) {
      id
    }

    insertCourseTrainer: insert_course_trainer_one(object: $courseTrainer) {
      id
    }
  }
`
