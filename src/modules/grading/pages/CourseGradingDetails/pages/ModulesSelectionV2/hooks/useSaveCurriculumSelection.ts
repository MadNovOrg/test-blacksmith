import { gql, useMutation } from 'urql'

import {
  SaveCurriculumSelectionMutation,
  SaveCurriculumSelectionMutationVariables,
} from '@app/generated/graphql'

export const SAVE_CURRICULUM_SELECTION = gql`
  mutation SaveCurriculumSelection($courseId: Int!, $curriculum: jsonb!) {
    update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: { curriculum: $curriculum, gradingConfirmed: true }
    ) {
      id
    }
  }
`

export function useSaveCurriculumSelection() {
  return useMutation<
    SaveCurriculumSelectionMutation,
    SaveCurriculumSelectionMutationVariables
  >(SAVE_CURRICULUM_SELECTION)
}
