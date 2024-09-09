import { gql } from 'graphql-request'
import { useMutation } from 'urql'

import {
  UnlinkMultipleAffiliatedOrganisationsMutation,
  UnlinkMultipleAffiliatedOrganisationsMutationVariables,
} from '@app/generated/graphql'

const UNLINK_MULTIPLE_AFFILIATED_ORGANISATIONS = gql`
  mutation UnlinkMultipleAffiliatedOrganisations($affiliatedOrgsIds: [uuid!]) {
    update_organization_many(
      updates: {
        where: { id: { _in: $affiliatedOrgsIds } }
        _set: { main_organisation_id: null }
      }
    ) {
      affected_rows
    }
  }
`

export const useUnlinkMultipleAffiliatedOrganisations = () => {
  return useMutation<
    UnlinkMultipleAffiliatedOrganisationsMutation,
    UnlinkMultipleAffiliatedOrganisationsMutationVariables
  >(UNLINK_MULTIPLE_AFFILIATED_ORGANISATIONS)
}
