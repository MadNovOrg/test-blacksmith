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

  const where = useMemo(() => {
    const conditions: Course_Bool_Exp[] = []
    if (!activeRole) {
      return {}
    }

    if (orgId) {
      const allAvailableOrgs = {}
      const onlyUserOrgs = { organization: { id: { _in: organizationIds } } }
      const specificOrg = { organization: { id: { _eq: orgId } } }
      if (orgId === ALL_ORGS) {
        conditions.push(acl.isTTAdmin() ? allAvailableOrgs : onlyUserOrgs)
      } else {
        conditions.push(specificOrg)
      }
    }

    const commonStatuses: Course_Status_Enum[] = intersection(
      statuses,
      filters?.statuses as unknown as Course_Status_Enum[]
    )
    const allStatuses =
      filters?.statuses?.length && commonStatuses.length
        ? commonStatuses
        : statuses

    let statusCondition: Course_Bool_Exp = {
      status: {
        _in: allStatuses.filter(s => s !== Course_Status_Enum.TrainerMissing),
      },
    }

    if (allStatuses.indexOf(Course_Status_Enum.TrainerMissing) !== -1) {
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

    conditions.push(statusCondition)

    if (RoleName.TRAINER === activeRole) {
      conditions.push({
        trainers: {
          status: { _eq: Course_Invite_Status_Enum.Pending },
          profile_id: { _eq: profile?.id },
        },
      })
    }

    let where: Course_Bool_Exp = {
      _and: conditions,
    }

    where = filtersToWhereClause(where, filters)

    const cancellationPendingCondition = {
      cancellationRequest: {
        id: { _is_null: false },
      },
    }

    return acl.isTTAdmin()
      ? { _or: [where, cancellationPendingCondition] }
      : where
  }, [acl, activeRole, orgId, organizationIds, profile, statuses, filters])

  return useQuery<TrainerCoursesQuery, TrainerCoursesQueryVariables>({
    query: QUERY,
    requestPolicy: 'cache-and-network',
    variables: {
      where,
      orderBy,
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination?.currentPage - 1),
    },
  })
}
