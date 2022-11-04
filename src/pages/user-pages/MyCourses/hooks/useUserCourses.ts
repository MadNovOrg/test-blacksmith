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
  | Course_Status_Enum.GradeMissing

type CoursesFilters = {
  keyword?: string
  levels?: Course_Level_Enum[]
  types?: Course_Type_Enum[]
  statuses?: UserCourseStatus[]
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
        [Course_Status_Enum.GradeMissing]: {
          _or: [
            {
              participants: {
                grade: { _is_null: true },
              },
            },
          ],
        },
      }),
      [unevaluatedIds]
    )

  const where = useMemo(() => {
    let obj: Course_Bool_Exp = {
      participants: { profile_id: { _eq: profile?.id } },
    }
    // if orgId is defined then provide all available courses within that org
    if (orgId) {
      const allAvailableOrgs = {}
      const onlyUserOrgs = { organization: { id: { _in: organizationIds } } }
      const specificOrg = { organization: { id: { _eq: orgId } } }
      if (orgId === ALL_ORGS) {
        obj = acl.isTTAdmin() ? allAvailableOrgs : onlyUserOrgs
      } else {
        obj = specificOrg
      }
    }

    if (filters?.statuses?.includes(AttendeeOnlyCourseStatus.InfoRequired)) {
      obj = deepmerge(obj, courseStatusConditionsMap.INFO_REQUIRED)
    }

    if (filters?.statuses?.includes(AttendeeOnlyCourseStatus.NotAttended)) {
      obj = deepmerge(obj, courseStatusConditionsMap.NOT_ATTENDED)
    }

    if (filters?.statuses?.includes(Course_Status_Enum.EvaluationMissing)) {
      obj = deepmerge(obj, courseStatusConditionsMap.EVALUATION_MISSING)
    }

    if (filters?.statuses?.includes(Course_Status_Enum.Scheduled)) {
      obj = deepmerge(obj, courseStatusConditionsMap.SCHEDULED)
    }

    if (filters?.statuses?.includes(Course_Status_Enum.Completed)) {
      obj = deepmerge(obj, courseStatusConditionsMap.COMPLETED)
    }

    if (filters?.statuses?.includes(Course_Status_Enum.GradeMissing)) {
      obj = deepmerge(obj, courseStatusConditionsMap.GRADE_MISSING)
    }

    if (filters?.levels?.length) {
      obj.level = { _in: filters.levels }
    }

    if (filters?.types?.length) {
      obj.type = { _in: filters.types }
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

      obj._or = orClauses.filter(Boolean)
    }

    return obj
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

  return {
    courses: data?.courses,
    error,
    status: getSWRLoadingStatus(data, error),
    total: data?.course_aggregate.aggregate?.count,
  }
}

function getOrderBy(sorting?: Sorting): Course_Order_By {
  const defaultOrderBy = { name: Order_By.Asc }

  if (!sorting) {
    return defaultOrderBy
  }

  const dir = sorting.dir === 'asc' ? Order_By.Asc : Order_By.Desc

  switch (sorting.by) {
    case 'name':
    case 'type': {
      return { [sorting.by]: dir }
    }

    case 'start':
    case 'end': {
      return { schedule_aggregate: { min: { [sorting.by]: dir } } }
    }

    default: {
      return defaultOrderBy
    }
  }
}
