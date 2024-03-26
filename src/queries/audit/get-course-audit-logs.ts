import { gql } from 'graphql-request'

export const GET_COURSE_AUDIT_LOGS_QUERY = gql`
  query GetCourseAuditLogs(
    $where: course_audit_bool_exp!
    $limit: Int = 20
    $offset: Int = 0
    $orderBy: [course_audit_order_by!]
    $fromExceptionsLog: Boolean = false
  ) {
    logs: course_audit(
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
      }
      course {
        id
        course_code
        type
        start @include(if: $fromExceptionsLog)
        organization @include(if: $fromExceptionsLog) {
          name
          id
        }
        trainers @include(if: $fromExceptionsLog) {
          type
          id
          profile {
            fullName
            avatar
            id
          }
        }
        orders {
          order {
            id
            xeroInvoiceNumber
          }
        }
      }
      payload
    }

    logsAggregate: course_audit_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
