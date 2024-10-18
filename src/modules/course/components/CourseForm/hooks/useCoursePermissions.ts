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
  canBeANZMixed,
  canBeANZVirtual,
  canBeBlended,
  canBeBlendedANZ,
  canBeBlendedBild,
  canBeConversion,
  canBeF2F,
  canBeF2FBild,
  canBeMixed,
  canBeMixedBild,
  canBeReacc,
  canBeReaccANZ,
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
  > & { type: Course_Type_Enum },
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

  const isAustraliaRegion = acl.isAustralia()
  const canBlended = isICM
    ? (isAustraliaRegion ? canBeBlendedANZ : canBeBlended)(
        type,
        courseLevel as Course_Level_Enum,
        deliveryType,
      )
    : canBeBlendedBild(type, courseLevel as Course_Level_Enum, bildStrategies)

  const canReacc = () => {
    if (isAustraliaRegion) {
      return canBeReaccANZ(
        type,
        courseLevel as Course_Level_Enum,
        deliveryType,
        isBlended,
      )
    }
    if (!isICM) {
      return canBeReaccBild(type, bildStrategies, isBlended, conversion)
    }
    return canBeReacc(
      type,
      courseLevel as Course_Level_Enum,
      deliveryType,
      isBlended,
    )
  }

  const canF2F = isICM
    ? canBeF2F(type, courseLevel as Course_Level_Enum)
    : canBeF2FBild()

  const canVirtual = () => {
    if (isAustraliaRegion) {
      return canBeANZVirtual(type, courseLevel as Course_Level_Enum)
    }
    if (!isICM) {
      return canBeVirtualBild(type, bildStrategies, conversion)
    }
    return canBeVirtual(type, courseLevel as Course_Level_Enum)
  }
  const canMixed = () => {
    if (isAustraliaRegion) {
      return canBeANZMixed(type, courseLevel as Course_Level_Enum)
    }

    if (!isICM) {
      return canBeMixedBild(
        courseLevel as Course_Level_Enum,
        bildStrategies ? bildStrategiesToArray(bildStrategies) : [],
        conversion,
      )
    }
    return canBeMixed(type, courseLevel as Course_Level_Enum)
  }
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
        ].includes(trainerRole.trainer_role_type.name),
      ),
    [acl, profile?.trainer_role_types],
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
