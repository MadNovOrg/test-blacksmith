import { gql, useMutation } from 'urql'

import {
  SaveCourseGradingV2Mutation,
  SaveCourseGradingV2MutationVariables,
} from '@app/generated/graphql'

export const SAVE_COURSE_GRADING = gql`
  mutation SaveCourseGradingV2($participantIds: [uuid!]!, $gradedOn: jsonb!, $grade: grade_enum!, $courseId: Int!) {
    saveParticipantsGrade: update_course_participant(
      where: { id: { _in: $participantIds } }
      _set: { grade: $grade, gradedOn: $gradedOn, dateGraded: "${new Date().toISOString()}" }
    ) {
      affectedRows: affected_rows
    }

    gradingStarted: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: { gradingStarted: true }
    ) {
      id
    }
  }
`

export function useSaveCourseGrading() {
  return useMutation<
    SaveCourseGradingV2Mutation,
    SaveCourseGradingV2MutationVariables
  >(SAVE_COURSE_GRADING)
}
