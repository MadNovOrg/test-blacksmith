import { gql, useMutation } from 'urql'

import {
  ImportOrganisationsMutation,
  ImportOrganisationsMutationVariables,
} from '@app/generated/graphql'

const IMPORT_ORGANISATIONS = gql`
  mutation ImportOrganisations($input: ImportOrganisationsInput!) {
    importOrganisations(input: $input) {
      jobId
      error
    }
  }
`

export const useStartOrganisationsImportJob = () => {
  return useMutation<
    ImportOrganisationsMutation,
    ImportOrganisationsMutationVariables
  >(IMPORT_ORGANISATIONS)
}
