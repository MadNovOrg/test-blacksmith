import { gql, useMutation } from 'urql'

import {
  MergeOrganisationsMutation,
  MergeOrganisationsMutationVariables,
} from '@app/generated/graphql'

const MERGE_ORGANISATIONS = gql`
  mutation MergeOrganisations($input: MergeOrganisationsInput!) {
    mergeOrganisations(input: $input) {
      status
      message
    }
  }
`

export const useMergeOrganisations = () => {
  return useMutation<
    MergeOrganisationsMutation,
    MergeOrganisationsMutationVariables
  >(MERGE_ORGANISATIONS)
}
