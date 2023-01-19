import { addDays } from 'date-fns'
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
import { ALL_ORGS } from '@app/hooks/useOrg'
import { QUERY } from '@app/queries/courses/get-trainer-courses'
import { RoleName } from '@app/types'

export default function useActionableCourses({
  statuses,
  pagination,
  orgId,
}: {
  statuses: Course_Status_Enum[]
  pagination: { perPage: number; currentPage: number }
  orgId?: string
}) {
  const { activeRole, profile, acl, organizationIds } = useAuth()

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

    let statusCondition: Course_Bool_Exp = {
      status: {
        _in: statuses.filter(s => s !== Course_Status_Enum.TrainerMissing),
      },
    }

    if (statuses.indexOf(Course_Status_Enum.TrainerMissing) !== -1) {
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

    const where = { _and: conditions }

    const cancellationPendingCondition = {
      cancellationRequest: {
        id: { _is_null: false },
      },
    }

    return acl.isTTAdmin()
      ? { _or: [where, cancellationPendingCondition] }
      : where
  }, [acl, activeRole, orgId, organizationIds, profile, statuses])

  return useQuery<TrainerCoursesQuery, TrainerCoursesQueryVariables>({
    query: QUERY,
    requestPolicy: 'cache-and-network',
    variables: {
      where,
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination?.currentPage - 1),
    },
  })
}
