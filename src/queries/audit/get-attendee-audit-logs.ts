import { gql } from 'graphql-request'

export const GET_ATTENDEE_AUDIT_LOGS_QUERY = gql`
  query GetAttendeeAuditLogs(
    $where: course_participant_audit_bool_exp!
    $limit: Int = 20
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
      authorizedBy {
        avatar
        fullName
      }
      profile {
        avatar
        fullName
        email
      }
      course {
        course_code
      }
      fromCourse {
        course_code
      }
      toCourse {
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
