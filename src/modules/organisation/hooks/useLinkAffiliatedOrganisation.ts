import { gql } from 'graphql-request'
import { useMutation } from 'urql'

import {
  LinkAffiliatedOrganisationMutation,
  LinkAffiliatedOrganisationMutationVariables,
} from '@app/generated/graphql'

export const LINK_AFFILIATED_ORGANISATION = gql`
  mutation LinkAffiliatedOrganisation(
    $mainOrgId: uuid!
    $affiliatedOrgId: uuid!
  ) {
    update_organization_by_pk(
      pk_columns: { id: $affiliatedOrgId }
      _set: { main_organisation_id: $mainOrgId }
    ) {
      id
    }
  }
`
export const useLinkAffiliatedOrganisation = () => {
  return useMutation<
    LinkAffiliatedOrganisationMutation,
    LinkAffiliatedOrganisationMutationVariables
  >(LINK_AFFILIATED_ORGANISATION)
}
