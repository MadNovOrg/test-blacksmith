import { gql } from 'graphql-request'

export const GET_COURSE_AUDIT_LOGS_QUERY = gql`
  query GetCourseAuditLogs(
    $where: course_audit_bool_exp!
    $limit: Int = 20
    $offset: Int = 0
    $orderBy: [course_audit_order_by!]
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
      authorizedBy {
        avatar
        fullName
      }
      course {
        course_code
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
