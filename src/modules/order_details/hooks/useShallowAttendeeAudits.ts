import { gql, useQuery } from 'urql'

import {
  GetShallowAttendeeAuditLogsQuery,
  GetShallowAttendeeAuditLogsQueryVariables,
  Course_Participant_Audit_Bool_Exp,
} from '@app/generated/graphql'

export const GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY = gql`
  query GetShallowAttendeeAuditLogs(
    $where: course_participant_audit_bool_exp!
  ) {
    logs: course_participant_audit(where: $where) {
      id
      xero_invoice_number
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
  pause,
}: {
  where: Course_Participant_Audit_Bool_Exp
  pause: boolean
}) => {
  return useQuery<
    GetShallowAttendeeAuditLogsQuery,
    GetShallowAttendeeAuditLogsQueryVariables
  >({
    query: GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY,
    variables: {
      where,
    },
    pause,
  })
}
