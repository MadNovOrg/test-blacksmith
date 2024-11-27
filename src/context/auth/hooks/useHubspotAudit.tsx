import { gql } from 'urql'

import {
  InsertHubspotAuditMutation,
  InsertHubspotAuditMutationVariables,
} from '@app/generated/graphql'
import { gqlRequest } from '@app/lib/gql-request'

export const INSERT_HUBSPOT_AUDIT = gql`
  mutation InsertHubspotAudit($object: hubspot_audit_insert_input!) {
    insert_hubspot_audit_one(object: $object) {
      id
    }
  }
`
export const insertHubspotAudit = (
  audit: InsertHubspotAuditMutationVariables['object'],
  token: string,
) => {
  return gqlRequest<
    InsertHubspotAuditMutation,
    InsertHubspotAuditMutationVariables
  >(
    INSERT_HUBSPOT_AUDIT,
    { object: audit },
    {
      token,
    },
  )
}
