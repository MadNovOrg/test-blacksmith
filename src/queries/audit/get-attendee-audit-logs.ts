import { gql } from 'graphql-request'

export const GET_ATTENDEE_AUDIT_LOGS_QUERY = gql`
  query GetAttendeeAuditLogs(
    $where: course_participant_audit_bool_exp!
    $limit: Int
    $offset: Int = 0
    $orderBy: [course_participant_audit_order_by!]
  ) {
    logs: course_participant_audit(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      created_at
      updated_at
      xero_invoice_number
      authorizedBy {
        id
        avatar
        fullName
        archived
      }
      profile {
        id
        avatar
        fullName
        email
        archived
        organizations {
          organization {
            id
            name
          }
        }
      }
      course {
        id
        course_code
        type
        orders {
          order {
            id
            xeroInvoiceNumber
          }
        }
      }
      fromCourse {
        id
        course_code
      }
      toCourse {
        id
        course_code
      }
      payload
      newAttendeeEmail
    }

    logsAggregate: course_participant_audit_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
