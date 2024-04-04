import { useCallback, useMemo } from 'react'
import { useClient, useQuery } from 'urql'

import {
  Course_Audit_Bool_Exp,
  Course_Audit_Type_Enum,
  Course_Level_Enum,
  GetCourseAuditLogsQuery,
  GetCourseAuditLogsQueryVariables,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { GET_COURSE_AUDIT_LOGS_QUERY } from '@app/queries/audit/get-course-audit-logs'
import { SortOrder } from '@app/types'
import { buildNestedSort } from '@app/util'

type UseCourseAuditLogsProps = {
  type: Course_Audit_Type_Enum
  sort: { by: string; dir: SortOrder }
  limit?: number
  offset?: number
  fromExceptionsLog?: boolean
  filter: {
    from?: Date
    to?: Date
    query?: string
    filterByCertificateLevel?: Course_Level_Enum[]
    filterByCourseType?: Course_Type_Enum[]
    eventDates?: {
      from?: Date
      to?: Date
    }
  }
}

export default function useCourseAuditLogs({
  type,
  sort,
  limit,
  offset,
  filter,
  fromExceptionsLog,
}: UseCourseAuditLogsProps): {
  logs: GetCourseAuditLogsQuery['logs']
  count: number
  loading: boolean
  error?: Error
  getUnpagedLogs: () => Promise<GetCourseAuditLogsQuery['logs']>
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
      const query = filter.query.trim()
      const keywords = query.split(' ').filter(word => Boolean(word))

      conditions.push(
        keywords && keywords.length > 1
          ? {
              _and: keywords.map(w => ({
                searchFields: { _ilike: `%${w}%` },
              })),
            }
          : { searchFields: { _ilike: `%${query}%` } }
      )
    }
    if (filter.filterByCertificateLevel?.length) {
      conditions.push({
        course: { level: { _in: filter.filterByCertificateLevel } },
      })
    }
    if (filter.filterByCourseType?.length) {
      conditions.push({
        course: { type: { _in: filter.filterByCourseType } },
      })
    }
    if (filter.eventDates?.from) {
      conditions.push({
        course: { start: { _gte: filter.eventDates.from } },
      })
    }
    if (filter.eventDates?.to) {
      conditions.push({ course: { end: { _lte: filter.eventDates.to } } })
    }
    return { _and: conditions }
  }, [
    type,
    filter.from,
    filter.to,
    filter.query,
    filter.filterByCertificateLevel,
    filter.filterByCourseType,
    filter.eventDates,
  ])

  const client = useClient()
  const [{ data, error, fetching }] = useQuery<
    GetCourseAuditLogsQuery,
    GetCourseAuditLogsQueryVariables
  >({
    query: GET_COURSE_AUDIT_LOGS_QUERY,
    variables: { where, orderBy, limit, offset, fromExceptionsLog },
  })

  const getUnpagedLogs = useCallback(
    () =>
      client
        .query<GetCourseAuditLogsQuery, GetCourseAuditLogsQueryVariables>(
          GET_COURSE_AUDIT_LOGS_QUERY,
          { where, orderBy, fromExceptionsLog }
        )
        .toPromise()
        .then(result => result?.data?.logs ?? []),
    [client, where, orderBy, fromExceptionsLog]
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
    ]
  )
}
