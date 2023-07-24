import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import {
  CourseLevel,
  Resource_Resourcepermissions,
} from '@app/generated/graphql'
import { TrainerRoleTypeName } from '@app/types'

export function useResourcePermission() {
  const { activeCertificates, trainerRoles } = useAuth()

  const canAccessResource = useCallback(
    (
      resourcePermissions: Pick<
        Resource_Resourcepermissions,
        'certificateLevels' | 'principalTrainer'
      >
    ) => {
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
    [activeCertificates, trainerRoles]
  )

  return canAccessResource
}
