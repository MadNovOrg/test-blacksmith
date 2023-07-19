import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Course_Audit_Bool_Exp,
  Course_Audit_Type_Enum,
  Course_Level_Enum,
  GetCourseAuditLogsQuery,
  GetCourseAuditLogsQueryVariables,
} from '@app/generated/graphql'
import { GET_COURSE_AUDIT_LOGS_QUERY } from '@app/queries/audit/get-course-audit-logs'
import { SortOrder } from '@app/types'
import { buildNestedSort, getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { Course_Type_Enum } from '@qa/generated/graphql'

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
          {
            course: {
              trainers: {
                profile: { fullName: { _ilike: `%${filter.query}%` } },
              },
            },
          },
          { course: { course_code: { _ilike: `%${filter.query}%` } } },
          {
            course: { organization: { name: { _ilike: `%${filter.query}%` } } },
          },
          { authorizedBy: { fullName: { _ilike: `%${filter.query}%` } } },
          { authorizedBy: { fullName: { _ilike: `%${filter.query}%` } } },
        ],
      })
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

  const { data, error } = useSWR<
    GetCourseAuditLogsQuery,
    Error,
    [string, GetCourseAuditLogsQueryVariables]
  >([
    GET_COURSE_AUDIT_LOGS_QUERY,
    { where, orderBy, limit, offset, fromExceptionsLog },
  ])

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
