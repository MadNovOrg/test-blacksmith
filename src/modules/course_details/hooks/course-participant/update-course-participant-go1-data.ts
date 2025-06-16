import { gql, useMutation } from 'urql'

import {
  UpdateCourseParticipantGo1DataMutation,
  UpdateCourseParticipantGo1DataMutationVariables,
} from '@app/generated/graphql'

export const UPDATE_COURSE_PARTICIPANT_GO1_DATA = gql`
  mutation UpdateCourseParticipantGO1Data(
    $courseParticipantId: uuid!
    $go1EnrolmentId: Int!
    $go1EnrolmentStatus: blended_learning_status_enum!
  ) {
    update_course_participant_by_pk(
      pk_columns: { id: $courseParticipantId }
      _set: {
        go1EnrolmentId: $go1EnrolmentId
        go1EnrolmentStatus: $go1EnrolmentStatus
      }
    ) {
      id
    }
  }
`

export const useUpdateCourseParticipantGO1Data = () => {
  return useMutation<
    UpdateCourseParticipantGo1DataMutation,
    UpdateCourseParticipantGo1DataMutationVariables
  >(UPDATE_COURSE_PARTICIPANT_GO1_DATA)
}
