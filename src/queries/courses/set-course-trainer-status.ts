import { gql } from 'graphql-request'

export const SetCourseTrainerStatus = gql`
  mutation SetCourseTrainerStatus(
    $id: uuid!
    $status: course_invite_status_enum!
  ) {
    update_course_trainer_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`
