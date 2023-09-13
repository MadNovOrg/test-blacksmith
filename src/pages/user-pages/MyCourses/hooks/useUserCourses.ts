import { deepmerge } from 'deepmerge-ts'
import { useMemo, useRef } from 'react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Bool_Exp,
  Course_Level_Enum,
  Course_Order_By,
  Course_Status_Enum,
  Course_Type_Enum,
  Order_By,
  UserCoursesQuery,
  UserCoursesQueryVariables,
} from '@app/generated/graphql'
import { ALL_ORGS } from '@app/hooks/useOrg'
import { Sorting } from '@app/hooks/useTableSort'
import { QUERY } from '@app/queries/user-queries/get-user-courses'
import { AttendeeOnlyCourseStatus } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { useUnevaluatedUserCourses } from './useUnevaluatedUserCourses'

export type UserCourseStatus =
  | AttendeeOnlyCourseStatus
  | Course_Status_Enum.EvaluationMissing
  | Course_Status_Enum.Scheduled
  | Course_Status_Enum.Completed

export type CoursesFilters = {
  keyword?: string
  levels?: Course_Level_Enum[]
  types?: Course_Type_Enum[]
  statuses?: UserCourseStatus[]
  creation?: { start?: Date; end?: Date }
  schedule?: {
    start?: Date
    end?: Date
  }
}

export function useUserCourses(
  filters?: CoursesFilters,
  sorting?: Sorting,
  pagination?: { perPage: number; currentPage: number },
  orgId?: string
): {
  courses?: UserCoursesQuery['courses']
  error?: Error
  status: LoadingStatus
  total?: number
} {
  const { acl, profile, organizationIds } = useAuth()
  const dateRef = useRef(new Date().toISOString())

  const { courses: unevaluatedCourses } = useUnevaluatedUserCourses()
  const unevaluatedIds = unevaluatedCourses?.map(c => c.id)

  const courseStatusConditionsMap: Record<UserCourseStatus, Course_Bool_Exp> =
    useMemo(
      () => ({
        [AttendeeOnlyCourseStatus.InfoRequired]: {
          _or: [
            {
              participants: {
                healthSafetyConsent: { _eq: false },
                attended: { _is_null: true },
              },
            },
          ],
        },
        [AttendeeOnlyCourseStatus.NotAttended]: {
          _or: [
            {
              participants: {
                attended: { _eq: false },
              },
            },
          ],
        },
        [Course_Status_Enum.EvaluationMissing]: {
          _or: [
            {
              id: { _in: unevaluatedIds },
              participants: {
                healthSafetyConsent: { _eq: true },
                grade: { _is_null: false },
              },
              schedule: {
                end: { _lt: dateRef.current },
              },
            },
          ],
        },
        [Course_Status_Enum.Scheduled]: {
          _or: [
            {
              participants: {
                healthSafetyConsent: { _eq: true },
              },
              schedule: {
                end: { _gt: dateRef.current },
              },
            },
          ],
        },
        [Course_Status_Enum.Completed]: {
          _or: [
            {
              participants: { grade: { _is_null: false } },
              id: { _nin: unevaluatedIds },
              schedule: {
                end: { _lt: dateRef.current },
              },
            },
          ],
        },
        [AttendeeOnlyCourseStatus.AwaitingGrade]: {
          _or: [
            {
              participants: {
                grade: { _is_null: true },
              },
              schedule: {
                end: { _lt: dateRef.current },
              },
            },
          ],
        },
      }),
      [unevaluatedIds]
    )

  const where = useMemo(() => {
    let userConditions: Course_Bool_Exp = {
      _or: [
        {
          participants: { profile_id: { _eq: profile?.id } },
        },
        {
          bookingContact: { id: { _eq: profile?.id } },
        },
      ],
    }
    let filterConditions: Course_Bool_Exp = {}
    // if orgId is defined then provide all available courses within that org, only if I have an admin role
    if (orgId) {
      const allAvailableOrgs = {}
      const onlyUserOrgs = acl.isOrgAdmin()
        ? { organization: { id: { _in: organizationIds } } }
        : {}
      const specificOrg = { organization: { id: { _eq: orgId } } }
      if (orgId === ALL_ORGS) {
        userConditions = acl.isTTAdmin() ? allAvailableOrgs : onlyUserOrgs
      } else {
        userConditions = specificOrg
      }
    }

    if (filters?.statuses?.includes(AttendeeOnlyCourseStatus.InfoRequired)) {
      filterConditions = deepmerge(
        filterConditions,
        courseStatusConditionsMap.INFO_REQUIRED
      )
    }

    if (filters?.statuses?.includes(AttendeeOnlyCourseStatus.NotAttended)) {
      filterConditions = deepmerge(
        filterConditions,
        courseStatusConditionsMap.NOT_ATTENDED
      )
    }

    if (filters?.statuses?.includes(Course_Status_Enum.EvaluationMissing)) {
      filterConditions = deepmerge(
        filterConditions,
        courseStatusConditionsMap.EVALUATION_MISSING
      )
    }

    if (filters?.statuses?.includes(Course_Status_Enum.Scheduled)) {
      filterConditions = deepmerge(
        filterConditions,
        courseStatusConditionsMap.SCHEDULED
      )
    }

    if (filters?.statuses?.includes(Course_Status_Enum.Completed)) {
      filterConditions = deepmerge(
        filterConditions,
        courseStatusConditionsMap.COMPLETED
      )
    }

    if (filters?.statuses?.includes(AttendeeOnlyCourseStatus.AwaitingGrade)) {
      filterConditions = deepmerge(
        filterConditions,
        courseStatusConditionsMap.AWAITING_GRADE
      )
    }

    if (filters?.levels?.length) {
      filterConditions.level = { _in: filters.levels }
    }

    if (filters?.types?.length) {
      filterConditions.type = { _in: filters.types }
    }

    if (filters?.creation?.start) {
      filterConditions.createdAt = {
        _gte: filters.creation.start,
      }
    }

    if (filters?.creation?.end) {
      filterConditions.createdAt = {
        ...filterConditions.createdAt,
        _lte: filters.creation.end,
      }
    }

    if (filters?.schedule?.start || filters?.schedule?.end) {
      filterConditions.schedule = {
        _and: [],
      }
      if (filters?.schedule?.start) {
        filterConditions.schedule._and?.push({
          start: { _gte: filters.schedule.start },
        })
      }
      if (filters?.schedule?.end) {
        filterConditions.schedule._and?.push({
          end: { _lte: filters.schedule.end },
        })
      }
    }

    const query = filters?.keyword?.trim()

    const onlyDigits = /^\d+$/.test(query || '')

    if (query?.length) {
      const orClauses = [
        onlyDigits ? { id: { _eq: Number(query) } } : null,
        { name: { _ilike: `%${query}%` } },
        { organization: { name: { _ilike: `%${query}%` } } },
        { schedule: { venue: { name: { _ilike: `%${query}%` } } } },
        { trainers: { profile: { fullName: { _ilike: `%${query}%` } } } },
        { course_code: { _ilike: `%${query}%` } },
      ]

      filterConditions._or = [
        ...(filterConditions._or ?? []),
        ...orClauses.filter(Boolean),
      ]
    }

    return {
      _and: [userConditions, filterConditions],
    }
  }, [
    orgId,
    filters,
    profile?.id,
    courseStatusConditionsMap,
    acl,
    organizationIds,
  ])

  const [{ data, error }] = useQuery<
    UserCoursesQuery,
    UserCoursesQueryVariables
  >({
    query: QUERY,
    requestPolicy: 'cache-and-network',
    variables: {
      where,
      profileId: profile?.id,
      orderBy: getOrderBy(sorting),
      withParticipantAggregates: Boolean(orgId),
      ...(pagination
        ? {
            limit: pagination.perPage,
            offset: pagination.perPage * (pagination?.currentPage - 1),
          }
        : null),
    },
  })

  return useMemo(
    () => ({
      courses: data?.courses,
      error,
      status: getSWRLoadingStatus(data, error),
      total: data?.course_aggregate.aggregate?.count,
    }),
    [data, error]
  )
}

function getOrderBy(sorting?: Sorting): Course_Order_By {
  const defaultOrderBy = { name: Order_By.Asc }

  if (!sorting) {
    return defaultOrderBy
  }

  const dir = sorting.dir === 'asc' ? Order_By.Asc : Order_By.Desc

  switch (sorting.by) {
    case 'name':
    case 'type':
    case 'createdAt':
    case 'start':
    case 'end':
      return { [sorting.by]: dir }

    default: {
      return defaultOrderBy
    }
  }
}
