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
    let obj: Course_Bool_Exp = {}
    if (!activeRole) {
      return {}
    }

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

    obj.status = { _in: statuses }

    if (RoleName.TRAINER === activeRole) {
      obj.trainers = {
        status: { _eq: Course_Invite_Status_Enum.Pending },
        profile_id: { _eq: profile?.id },
      }
    }

    return obj
  }, [activeRole, statuses, profile, acl, organizationIds, orgId])

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
