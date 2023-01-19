import { Course_Status_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

export function getActionableStatuses(
  roleName: RoleName
): Set<Course_Status_Enum> {
  switch (roleName) {
    case RoleName.TRAINER: {
      return new Set([Course_Status_Enum.TrainerPending])
    }

    case RoleName.TT_ADMIN:
    case RoleName.TT_OPS: {
      return new Set([
        Course_Status_Enum.ApprovalPending,
        Course_Status_Enum.TrainerMissing,
        Course_Status_Enum.ExceptionsApprovalPending,
      ])
    }
  }

  return new Set()
}
