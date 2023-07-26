import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import {
  CourseLevel,
  Resource_Resourcepermissions,
} from '@app/generated/graphql'
import { TrainerRoleTypeName } from '@app/types'

export function useResourcePermission() {
  const { activeCertificates, trainerRoles, acl } = useAuth()

  const canAccessResource = useCallback(
    (
      resourcePermissions: Pick<
        Resource_Resourcepermissions,
        'certificateLevels' | 'principalTrainer'
      >
    ) => {
      if (acl.isInternalUser()) {
        return true
      }

      const filteredPermissions = resourcePermissions.certificateLevels?.filter(
        certificateLevel =>
          activeCertificates?.includes(certificateLevel as CourseLevel)
      )

      return (
        (filteredPermissions && filteredPermissions?.length > 0) ||
        (resourcePermissions.principalTrainer &&
          trainerRoles?.includes(TrainerRoleTypeName.PRINCIPAL))
      )
    },
    [acl, activeCertificates, trainerRoles]
  )

  return canAccessResource
}
