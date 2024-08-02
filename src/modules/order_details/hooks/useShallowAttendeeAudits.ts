import { gql, useQuery } from 'urql'

import {
  GetShallowAttendeeAuditLogsQuery,
  GetShallowAttendeeAuditLogsQueryVariables,
  Course_Participant_Audit_Bool_Exp,
} from '@app/generated/graphql'

export const GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY = gql`
  query GetShallowAttendeeAuditLogs(
    $where: course_participant_audit_bool_exp!
    $xeroInvoiceNumber: String!
  ) {
    cancellation: course_participant_audit(
      where: {
        _and: [
          $where
          { xero_invoice_number: { _eq: $xeroInvoiceNumber } }
          { type: { _eq: CANCELLATION } }
        ]
      }
    ) {
      id
      xero_invoice_number
      profile {
        id
        fullName
        email
      }
    }
    replacement: course_participant_audit(
      where: {
        _and: [
          { xero_invoice_number: { _eq: $xeroInvoiceNumber } }
          { type: { _eq: REPLACEMENT } }
        ]
      }
    ) {
      id
      xero_invoice_number
      payload
      profile {
        id
        fullName
        email
      }
    }
  }
`

export const useShallowAttendeeAudits = ({
  where,
  xeroInvoiceNumber,
  pause,
}: {
  where: Course_Participant_Audit_Bool_Exp
  xeroInvoiceNumber: string
  pause: boolean
}) => {
  return useQuery<
    GetShallowAttendeeAuditLogsQuery,
    GetShallowAttendeeAuditLogsQueryVariables
  >({
    query: GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY,
    variables: {
      where,
      xeroInvoiceNumber,
    },
    pause,
  })
}
