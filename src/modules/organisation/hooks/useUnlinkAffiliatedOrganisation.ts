import { gql } from 'graphql-request'
import { useMutation } from 'urql'

import {
  UnlinkAffiliatedOrganisationMutation,
  UnlinkAffiliatedOrganisationMutationVariables,
} from '@app/generated/graphql'

const UNLINK_AFFILIATED_ORGANISATION = gql`
  mutation UnlinkAffiliatedOrganisation($affiliatedOrgId: uuid!) {
    update_organization_by_pk(
      pk_columns: { id: $affiliatedOrgId }
      _set: { main_organisation_id: null }
    ) {
      id
    }
  }
`

export const useUnlinkAffiliatedOrganisation = () => {
  return useMutation<
    UnlinkAffiliatedOrganisationMutation,
    UnlinkAffiliatedOrganisationMutationVariables
  >(UNLINK_AFFILIATED_ORGANISATION)
}
