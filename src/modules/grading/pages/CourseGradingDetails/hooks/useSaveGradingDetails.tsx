import { gql, useMutation } from 'urql'

import {
  SaveGradingDetailsMutation,
  SaveGradingDetailsMutationVariables,
} from '@app/generated/graphql'

const MUTATION = gql`
  mutation SaveGradingDetails($courseId: Int!) {
    update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: { gradingConfirmed: true }
    ) {
      id
      gradingConfirmed
    }
  }
`

export function useSaveGradingDetails() {
  const [, saveGradingDetails] = useMutation<
    SaveGradingDetailsMutation,
    SaveGradingDetailsMutationVariables
  >(MUTATION)

  return saveGradingDetails
}
