import { gql } from 'graphql-request'

export const CANCEL_COURSE_INDIVIDUAL_MUTATION = gql`
  mutation CancelCourseIndividual(
    $courseParticipantId: uuid!
    $cancellation: course_participant_cancellation_insert_input!
  ) {
    delete_course_participant_by_pk(id: $courseParticipantId) {
      id
    }
    insert_course_participant_cancellation_one(object: $cancellation) {
      id
    }
  }
`
