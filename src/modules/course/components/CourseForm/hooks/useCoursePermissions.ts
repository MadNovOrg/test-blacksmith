import { useMemo } from 'react'

import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CourseInput, TrainerRoleTypeName } from '@app/types'
import { bildStrategiesToArray } from '@app/util'

import {
  canBeBlended,
  canBeBlendedBild,
  canBeConversion,
  canBeF2F,
  canBeF2FBild,
  canBeMixed,
  canBeMixedBild,
  canBeReacc,
  canBeReaccBild,
  canBeVirtual,
  canBeVirtualBild,
} from '../helpers'

export const useCoursePermissions = (
  course: Pick<
    CourseInput,
    | 'deliveryType'
    | 'courseLevel'
    | 'blendedLearning'
    | 'bildStrategies'
    | 'conversion'
    | 'reaccreditation'
    | 'accreditedBy'
  > & { type: Course_Type_Enum }
) => {
  const {
    type,
    deliveryType,
    courseLevel,
    blendedLearning: isBlended,
    bildStrategies,
    conversion,
    reaccreditation,
    accreditedBy,
  } = course
  const { acl, profile } = useAuth()
  const isICM = accreditedBy === Accreditors_Enum.Icm
  const isBild = accreditedBy === Accreditors_Enum.Bild

  const canBlended = isICM
    ? canBeBlended(type, courseLevel as Course_Level_Enum, deliveryType)
    : canBeBlendedBild(type, courseLevel as Course_Level_Enum, bildStrategies)

  const canReacc = isICM
    ? canBeReacc(
        type,
        courseLevel as Course_Level_Enum,
        deliveryType,
        isBlended
      )
    : canBeReaccBild(type, bildStrategies, isBlended, conversion)

  const canF2F = isICM
    ? canBeF2F(type, courseLevel as Course_Level_Enum)
    : canBeF2FBild()

  const canVirtual = isICM
    ? canBeVirtual(type, courseLevel as Course_Level_Enum)
    : canBeVirtualBild(type, bildStrategies, conversion)

  const canMixed = isICM
    ? canBeMixed(type, courseLevel as Course_Level_Enum)
    : canBeMixedBild(
        courseLevel as Course_Level_Enum,
        bildStrategies ? bildStrategiesToArray(bildStrategies) : [],
        conversion
      )

  const conversionEnabled =
    isBild && canBeConversion(reaccreditation, courseLevel)

  const allowUseAOL = useMemo(
    () =>
      acl.isInternalUser() ||
      profile?.trainer_role_types.some(trainerRole =>
        [
          TrainerRoleTypeName.EMPLOYER_AOL,
          TrainerRoleTypeName.PRINCIPAL,
          TrainerRoleTypeName.SENIOR,
        ].includes(trainerRole.trainer_role_type.name)
      ),
    [acl, profile?.trainer_role_types]
  )

  return {
    canBlended,
    canReacc,
    canF2F,
    canVirtual,
    canMixed,
    conversionEnabled,
    allowUseAOL,
  }
}
