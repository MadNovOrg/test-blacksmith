import { gql } from 'graphql-request'

import {
  LogUserAuthEventMutation,
  LogUserAuthEventMutationVariables,
} from '@app/generated/graphql'
import { gqlRequest } from '@app/lib/gql-request'

export const LogUserAuthEvent = gql`
  mutation LogUserAuthEvent(
    $event_type: user_auth_audit_type_enum!
    $sub: String!
  ) {
    insert_user_auth_audits_one(
      object: { event_type: $event_type, sub: $sub }
    ) {
      id
    }
  }
`

export const logUserAuthEvent = (
  audit: LogUserAuthEventMutationVariables,
  token: string,
) => {
  return gqlRequest<
    LogUserAuthEventMutation,
    LogUserAuthEventMutationVariables
  >(LogUserAuthEvent, audit, {
    token,
  })
}
