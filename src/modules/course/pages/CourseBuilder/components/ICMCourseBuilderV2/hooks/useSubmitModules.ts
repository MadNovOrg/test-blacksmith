import { gql, useMutation } from 'urql'

import {
  SubmitIcmModulesMutation,
  SubmitIcmModulesMutationVariables,
} from '@app/generated/graphql'

export const SUBMIT_MODULES_MUTATION = gql`
  mutation SubmitICMModules($id: Int!, $curriculum: jsonb!, $duration: Int!) {
    update_course_by_pk(
      pk_columns: { id: $id }
      _set: {
        curriculum: $curriculum
        isDraft: false
        status: null
        modulesDuration: $duration
      }
    ) {
      id
    }
  }
`

export function useSubmitModules() {
  return useMutation<
    SubmitIcmModulesMutation,
    SubmitIcmModulesMutationVariables
  >(SUBMIT_MODULES_MUTATION)
}
