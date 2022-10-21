import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Course_Audit_Bool_Exp,
  Course_Audit_Type_Enum,
  GetCourseAuditLogsQuery,
  GetCourseAuditLogsQueryVariables,
} from '@app/generated/graphql'
import { GET_COURSE_AUDIT_LOGS_QUERY } from '@app/queries/audit/get-course-audit-logs'
import { SortOrder } from '@app/types'
import { buildNestedSort, getSWRLoadingStatus, LoadingStatus } from '@app/util'

type UseCourseAuditLogsProps = {
  type: Course_Audit_Type_Enum
  sort: { by: string; dir: SortOrder }
  limit?: number
  offset?: number
  filter: {
    from?: Date
    to?: Date
    query?: string
  }
}

export default function useCourseAuditLogs({
  type,
  sort,
  limit,
  offset,
  filter,
}: UseCourseAuditLogsProps): {
  logs: GetCourseAuditLogsQuery['logs']
  count: number
  loading: boolean
  error?: Error
} {
  const orderBy: GetCourseAuditLogsQueryVariables['orderBy'] = useMemo(
    () => buildNestedSort(sort.by, sort.dir ?? 'asc'),
    [sort]
  )

  const where: GetCourseAuditLogsQueryVariables['where'] = useMemo(() => {
    const conditions: Course_Audit_Bool_Exp[] = [{ type: { _eq: type } }]
    if (filter.from) {
      conditions.push({ created_at: { _gte: filter.from } })
    }
    if (filter.to) {
      conditions.push({ created_at: { _lte: filter.to } })
    }
    if (filter.query) {
      conditions.push({
        _or: [
          { course: { course_code: { _ilike: `%${filter.query}%` } } },
          { authorizedBy: { fullName: { _ilike: `%${filter.query}%` } } },
        ],
      })
    }
    return { _and: conditions }
  }, [type, filter.from, filter.to, filter.query])

  const { data, error } = useSWR<
    GetCourseAuditLogsQuery,
    Error,
    [string, GetCourseAuditLogsQueryVariables]
  >([GET_COURSE_AUDIT_LOGS_QUERY, { where, orderBy, limit, offset }])

  const status = getSWRLoadingStatus(data, error)
  return useMemo(
    () => ({
      logs: data?.logs ?? [],
      count: data?.logsAggregate?.aggregate?.count ?? 0,
      loading: status === LoadingStatus.FETCHING,
      error,
    }),
    [data, error, status]
  )
}
