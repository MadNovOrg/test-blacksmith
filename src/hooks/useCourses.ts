import { useMemo } from 'react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Bool_Exp,
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Order_By,
  Course_Status_Enum,
  Course_Type_Enum,
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { ALL_ORGS } from '@app/hooks/useOrg'
import { QUERY as GetTrainerCourses } from '@app/queries/courses/get-trainer-courses'
import { AdminOnlyCourseStatus, RoleName } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { Sorting } from './useTableSort'

export type CoursesFilters = {
  keyword?: string
  levels?: Course_Level_Enum[]
  types?: Course_Type_Enum[]
  statuses?: string[]
  excludedCourses?: number[]
  go1Integration?: boolean
  creation?: {
    start?: Date
    end?: Date
  }
  schedule?: {
    start?: Date
    end?: Date
  }
}

type Props = {
  sorting: Sorting
  filters?: CoursesFilters
  pagination?: { perPage: number; currentPage: number }
  orgId?: string
}

export const filtersToWhereClause = (
  where: Course_Bool_Exp,
  filters?: CoursesFilters
) => {
  if (filters?.levels?.length) {
    where.level = { _in: filters.levels }
  }

  if (filters?.types?.length) {
    where.type = { _in: filters.types }
  }

  if (filters?.excludedCourses?.length) {
    where.id = {
      _nin: filters.excludedCourses,
    }
  }

  if (filters?.go1Integration) {
    where.go1Integration = { _eq: filters?.go1Integration }
  }

  if (filters?.creation?.start) {
    where.createdAt = {
      _gte: filters.creation.start,
    }
  }

  if (filters?.creation?.end) {
    where.createdAt = {
      ...where.createdAt,
      _lte: filters.creation.end,
    }
  }

  if (filters?.schedule?.start || filters?.schedule?.end) {
    where.schedule = {
      _and: [],
    }
    if (filters?.schedule?.start) {
      where.schedule._and?.push({ start: { _gte: filters.schedule.start } })
    }
    if (filters?.schedule?.end) {
      where.schedule._and?.push({ end: { _lte: filters.schedule.end } })
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

    if (where._or) {
      where._and = [{ _or: where._or }, { _or: orClauses.filter(Boolean) }]
    } else {
      where._or = orClauses.filter(Boolean)
    }
  }

  return where
}

export const useCourses = (
  role: RoleName,
  { sorting, filters, pagination, orgId }: Props
) => {
  const { acl, organizationIds, profile } = useAuth()
  const orderBy = getOrderBy(sorting)

  const where = useMemo(() => {
    let obj: Course_Bool_Exp = {}

    // if orgId is defined then provide all available courses within that org
    if (orgId) {
      const allAvailableOrgs = {}
      const onlyUserOrgs: Course_Bool_Exp = {
        _or: [
          {
            organization: { id: { _in: organizationIds } },
            type: { _in: [Course_Type_Enum.Closed, Course_Type_Enum.Indirect] },
          },
          {
            type: { _eq: Course_Type_Enum.Open },
            participants: {
              profile: {
                organizations: {
                  organization: {
                    id: { _in: organizationIds },
                    members: {
                      isAdmin: { _eq: true },
                      profile_id: { _eq: profile?.id },
                    },
                  },
                },
              },
            },
          },
        ],
      }
      const specificOrg: Course_Bool_Exp = {
        _or: [
          {
            organization: { id: { _eq: orgId } },
            type: { _in: [Course_Type_Enum.Closed, Course_Type_Enum.Indirect] },
          },
          {
            type: { _eq: Course_Type_Enum.Open },
            participants: {
              profile: {
                organizations: {
                  organization: {
                    id: { _eq: orgId },
                    members: {
                      isAdmin: { _eq: true },
                      profile_id: { _eq: profile?.id },
                    },
                  },
                },
              },
            },
          },
        ],
      }
      if (orgId === ALL_ORGS) {
        obj = acl.canViewAllOrganizations() ? allAvailableOrgs : onlyUserOrgs
      } else {
        obj = specificOrg
      }
    }

    obj = filtersToWhereClause(obj, filters)

    const regularStatuses = filters?.statuses?.filter(s =>
      Object.values(Course_Status_Enum).includes(s as Course_Status_Enum)
    )
    if (regularStatuses?.length) {
      obj.status = {
        _in: regularStatuses as Course_Status_Enum[],
      }
    }

    if (
      filters?.statuses?.includes(AdminOnlyCourseStatus.CancellationRequested)
    ) {
      obj.cancellationRequest = { id: { _is_null: false } }
    }

    if (role === RoleName.TRAINER) {
      obj.trainers = {
        status: { _neq: Course_Invite_Status_Enum.Pending },
        profile_id: { _eq: profile?.id },
      }
    }

    return obj
  }, [acl, filters, orgId, organizationIds, profile?.id, role])

  const [{ data, error }, refetch] = useQuery<
    TrainerCoursesQuery,
    TrainerCoursesQueryVariables
  >({
    requestPolicy: 'cache-and-network',
    query: GetTrainerCourses,
    variables: {
      where,
      orderBy,
      ...(pagination
        ? {
            limit: pagination.perPage,
            offset: pagination.perPage * (pagination?.currentPage - 1),
          }
        : null),
    },
  })

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      courses: data?.courses ?? [],
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate: () => refetch({ requestPolicy: 'network-only' }),
      total: data?.course_aggregate.aggregate?.count,
    }),
    [data, error, status, refetch]
  )
}

export function getOrderBy({
  by,
  dir,
}: Pick<Sorting, 'by' | 'dir'>): Course_Order_By {
  switch (by) {
    case 'name':
    case 'type':
    case 'createdAt':
      return { [by]: dir }

    case 'start':
    case 'end':
      return { schedule_aggregate: { min: { [by]: dir } } }
    default: {
      return { name: Order_By.Asc }
    }
  }
}
