import { gql, useMutation } from 'urql'

import {
  SaveIcmCourseDraftMutation,
  SaveIcmCourseDraftMutationVariables,
} from '@app/generated/graphql'

export const SAVE_COURSE_DRAFT = gql`
  mutation SaveICMCourseDraft($id: Int!, $curriculum: jsonb) {
    update_course_by_pk(
      pk_columns: { id: $id }
      _set: { isDraft: true, curriculum: $curriculum, status: null }
    ) {
      id
    }
  }
`

export function useSaveCourseDraft() {
  return useMutation<
    SaveIcmCourseDraftMutation,
    SaveIcmCourseDraftMutationVariables
  >(SAVE_COURSE_DRAFT)
}
