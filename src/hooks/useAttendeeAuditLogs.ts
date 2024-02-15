import { useMemo } from 'react'
import { CombinedError, useQuery } from 'urql'

import {
  Course_Participant_Audit_Bool_Exp,
  Course_Participant_Audit_Type_Enum,
  GetAttendeeAuditLogsQuery,
  GetAttendeeAuditLogsQueryVariables,
} from '@app/generated/graphql'
import { GET_ATTENDEE_AUDIT_LOGS_QUERY } from '@app/queries/audit/get-attendee-audit-logs'
import { SortOrder } from '@app/types'
import { buildNestedSort } from '@app/util'

type UseAttendeeAuditLogsProps = {
  type: Course_Participant_Audit_Type_Enum
  sort: { by: string; dir: SortOrder }
  limit?: number
  offset?: number
  filter: {
    from?: Date
    to?: Date
    query?: string
  }
}

export default function useAttendeeAuditLogs({
  type,
  sort,
  limit,
  offset,
  filter,
}: UseAttendeeAuditLogsProps): {
  logs: GetAttendeeAuditLogsQuery['logs']
  count: number
  loading?: boolean
  error?: CombinedError | undefined
} {
  const orderBy: GetAttendeeAuditLogsQueryVariables['orderBy'] = useMemo(
    () => buildNestedSort(sort.by, sort.dir ?? 'asc'),
    [sort]
  )

  const where: GetAttendeeAuditLogsQueryVariables['where'] = useMemo(() => {
    const conditions: Course_Participant_Audit_Bool_Exp[] = [
      { type: { _eq: type } },
    ]
    if (filter.from) {
      conditions.push({ created_at: { _gte: filter.from } })
    }
    if (filter.to) {
      conditions.push({ created_at: { _lte: filter.to } })
    }
    if (filter.query) {
      conditions.push({
        _or: [
          { profile: { fullName: { _ilike: `%${filter.query}%` } } },
          { profile: { email: { _ilike: `%${filter.query}%` } } },
          { course: { course_code: { _ilike: `%${filter.query}%` } } },
          { authorizedBy: { fullName: { _ilike: `%${filter.query}%` } } },
          { fromCourse: { course_code: { _ilike: `%${filter.query}%` } } },
          { toCourse: { course_code: { _ilike: `%${filter.query}%` } } },
          { newAttendeeEmail: { _ilike: `%${filter.query}%` } },
          { courseParticipantInvoiceNumber: { _ilike: `%${filter.query}%` } },
        ],
      })
    }
    return { _and: conditions }
  }, [type, filter.from, filter.to, filter.query])

  const [{ data, error, fetching }] = useQuery<
    GetAttendeeAuditLogsQuery,
    GetAttendeeAuditLogsQueryVariables
  >({
    query: GET_ATTENDEE_AUDIT_LOGS_QUERY,
    variables: { where, orderBy, limit, offset },
  })

  return useMemo(
    () => ({
      logs: data?.logs ?? [],
      count: data?.logsAggregate?.aggregate?.count ?? 0,
      loading: fetching,
      error,
    }),
    [data?.logs, data?.logsAggregate?.aggregate?.count, error, fetching]
  )
}
