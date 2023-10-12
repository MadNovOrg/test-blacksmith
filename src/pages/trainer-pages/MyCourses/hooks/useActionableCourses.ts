import { addDays } from 'date-fns'
import { intersection } from 'lodash-es'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Bool_Exp,
  Course_Invite_Status_Enum,
  Course_Status_Enum,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import {
  CoursesFilters,
  filtersToWhereClause,
  getOrderBy,
} from '@app/hooks/useCourses'
import { ALL_ORGS } from '@app/hooks/useOrg'
import { Sorting } from '@app/hooks/useTableSort'
import { QUERY } from '@app/queries/courses/get-trainer-courses'
import { RoleName } from '@app/types'

type Props = {
  statuses: Course_Status_Enum[]
  sorting: Sorting
  pagination: { perPage: number; currentPage: number }
  orgId?: string
  filters?: CoursesFilters
}

export default function useActionableCourses({
  statuses,
  sorting,
  pagination,
  orgId,
  filters,
}: Props) {
  const { activeRole, profile, acl, organizationIds } = useAuth()
  const orderBy = getOrderBy(sorting)

  // The "statuses" property contains the list of actionable statuses.
  // The user can filter by selecting some statuses. These values are contained in the "filters.statuses" property.
  // The "commonStatuses" variable contains the intersection of the two.
  // So it includes a subset of the actionable statuses that have been selected in
  // the status filter by the user.
  // If "commonStatuses" is empty it means that:
  // - no status filter has been selected OR
  // - all the statuses in the filters are not actionable ones
  const commonStatuses: Course_Status_Enum[] = useMemo(
    () =>
      intersection(
        statuses,
        filters?.statuses as unknown as Course_Status_Enum[]
      ),
    [filters, statuses]
  )

  // If the user wants to filter by status ("filters.statuses.length > 0")
  // but none of them is an actionable status ("commonStatuses.length === 0"),
  // then we do not fetch actionable courses ("fetchNoCourses" is true)
  const fetchNoCourses = useMemo(
    () =>
      filters?.statuses &&
      filters.statuses.length > 0 &&
      commonStatuses.length === 0,
    [commonStatuses.length, filters]
  )

  const where = useMemo(() => {
    const conditions: Course_Bool_Exp[] = []
    if (!activeRole || fetchNoCourses) {
      return {}
    }

    if (orgId) {
      const allAvailableOrgs = {}
      const onlyUserOrgs = { organization: { id: { _in: organizationIds } } }
      const specificOrg = { organization: { id: { _eq: orgId } } }
      if (orgId === ALL_ORGS) {
        conditions.push(
          acl.canSeeActionableCourseTable() ? allAvailableOrgs : onlyUserOrgs
        )
      } else {
        conditions.push(specificOrg)
      }
    }

    // The list of allowed statuses is as follows:
    // - the list of actionable statuses selected by the user in the status filter ("commonStatuses.length > 0") OR
    // - the complete list of actionable statuses ("statuses")
    const allowedStatuses =
      commonStatuses.length > 0 ? commonStatuses : statuses

    let statusCondition: Course_Bool_Exp = {
      status: {
        _in: allowedStatuses.filter(
          s => s !== Course_Status_Enum.TrainerMissing
        ),
      },
    }

    if (allowedStatuses.indexOf(Course_Status_Enum.TrainerMissing) !== -1) {
      statusCondition = {
        _or: [
          statusCondition,
          {
            _and: [
              { status: { _eq: Course_Status_Enum.TrainerMissing } },
              {
                start: { _lte: addDays(new Date(), 30).toISOString() },
              },
            ],
          },
        ],
      }
    }

    if (acl.canSeeActionableCourseTable()) {
      const cancellationPendingCondition = {
        cancellationRequest: {
          id: { _is_null: false },
        },
      }
      statusCondition = {
        _or: [statusCondition, cancellationPendingCondition],
      }
    }

    if (RoleName.TRAINER === activeRole) {
      conditions.push({
        trainers: {
          status: { _eq: Course_Invite_Status_Enum.Pending },
          profile_id: { _eq: profile?.id },
        },
        status: { _neq: Course_Status_Enum.ExceptionsApprovalPending },
      })
    } else {
      conditions.push(statusCondition)
    }

    let where: Course_Bool_Exp = {
      _and: conditions,
    }

    where = filtersToWhereClause(where, filters)
    return where
  }, [
    acl,
    activeRole,
    orgId,
    organizationIds,
    profile,
    statuses,
    filters,
    commonStatuses,
    fetchNoCourses,
  ])

  return useQuery<TrainerCoursesQuery, TrainerCoursesQueryVariables>({
    query: QUERY,
    requestPolicy: 'cache-and-network',
    variables: {
      where,
      withArloRefId: acl.isInternalUser(),
      orderBy,
      limit: fetchNoCourses ? 0 : pagination.perPage,
      offset: fetchNoCourses
        ? 0
        : pagination.perPage * (pagination?.currentPage - 1),
    },
  })
}
