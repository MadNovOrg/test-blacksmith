import { useCallback, useMemo } from 'react'
import { CombinedError, useQuery, useClient } from 'urql'

import {
  Course_Participant_Audit_Bool_Exp,
  Course_Participant_Audit_Type_Enum,
  Course_Type_Enum,
  GetAttendeeAuditLogsQuery,
  GetAttendeeAuditLogsQueryVariables,
} from '@app/generated/graphql'
import { GET_ATTENDEE_AUDIT_LOGS_QUERY } from '@app/modules/admin/Audits/queries/get-attendee-audit-logs'
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
    courseType?: Course_Type_Enum
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
  error?: CombinedError
  getUnpagedLogs: () => Promise<GetAttendeeAuditLogsQuery['logs']>
} {
  const orderBy: GetAttendeeAuditLogsQueryVariables['orderBy'] = useMemo(
    () => buildNestedSort(sort.by, sort.dir ?? 'asc'),
    [sort],
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
      const query = filter.query.trim()
      const keywords = query.split(' ').filter(word => Boolean(word))

      conditions.push(
        keywords && keywords.length > 1
          ? {
              _and: keywords.map(w => ({
                searchFields: { _ilike: `%${w}%` },
              })),
            }
          : { searchFields: { _ilike: `%${query}%` } },
      )
    }
    if (filter.courseType) {
      conditions.push({
        course: { type: { _eq: filter.courseType } },
      })
    }
    return { _and: conditions }
  }, [type, filter.from, filter.to, filter.query, filter.courseType])

  const client = useClient()
  const [{ data, error, fetching }] = useQuery<
    GetAttendeeAuditLogsQuery,
    GetAttendeeAuditLogsQueryVariables
  >({
    query: GET_ATTENDEE_AUDIT_LOGS_QUERY,
    variables: { where, orderBy, limit, offset },
  })

  const getUnpagedLogs = useCallback(
    () =>
      client
        .query<GetAttendeeAuditLogsQuery, GetAttendeeAuditLogsQueryVariables>(
          GET_ATTENDEE_AUDIT_LOGS_QUERY,
          { where, orderBy },
        )
        .toPromise()
        .then(result => result?.data?.logs ?? []),
    [client, where, orderBy],
  )

  return useMemo(
    () => ({
      logs: data?.logs ?? [],
      count: data?.logsAggregate?.aggregate?.count ?? 0,
      loading: fetching,
      error,
      getUnpagedLogs,
    }),
    [
      data?.logs,
      data?.logsAggregate?.aggregate?.count,
      error,
      fetching,
      getUnpagedLogs,
    ],
  )
}
