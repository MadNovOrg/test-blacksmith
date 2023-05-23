import { Accreditors_Enum } from '@app/generated/graphql'
import { BildStrategies, Course, CourseType, TrainerInput } from '@app/types'

import {
  getRequiredAssistantsBild,
  getRequiredLeadsBild,
} from './trainerRatio.bild'
import { getRequiredAssistants as getRequiredAssistantsIcm } from './trainerRatio.icm'
import { RequiredTrainers } from './types'

export type RatioCourseData = Pick<
  Course,
  | 'accreditedBy'
  | 'level'
  | 'type'
  | 'deliveryType'
  | 'reaccreditation'
  | 'max_participants'
  | 'conversion'
> & {
  bildStrategies?: Record<string, boolean>
  hasSeniorOrPrincipalLeader: boolean
}

export type RatioTrainerData = Pick<
  TrainerInput,
  'trainer_role_types' | 'type'
>[]

export function getRequiredAssistants(
  courseData: RatioCourseData
): RequiredTrainers {
  if (courseData.accreditedBy === Accreditors_Enum.Icm) {
    return getRequiredAssistantsIcm({
      courseLevel: courseData.level,
      type: courseData.type,
      deliveryType: courseData.deliveryType,
      reaccreditation: courseData.reaccreditation,
      maxParticipants: courseData.max_participants,
      hasSeniorOrPrincipalLeader:
        courseData.hasSeniorOrPrincipalLeader ?? false,
    })
  } else if (courseData.accreditedBy === Accreditors_Enum.Bild) {
    const strategies = courseData.bildStrategies ?? {}
    return getRequiredAssistantsBild({
      level: courseData.level,
      isReaccreditation: courseData.reaccreditation,
      isConversion: courseData.conversion,
      strategies: Object.keys(strategies).filter(
        strategy => strategies[strategy]
      ) as BildStrategies[],
      numberParticipants: courseData.max_participants,
    })
  }
  return { min: 0, max: 0 }
}
export function getRequiredLeads(
  courseData: RatioCourseData
): RequiredTrainers {
  if (courseData.accreditedBy === Accreditors_Enum.Icm) {
    return { min: 0, max: courseData.type === CourseType.OPEN ? 0 : 1 }
  } else if (courseData.accreditedBy === Accreditors_Enum.Bild) {
    const strategies = courseData.bildStrategies ?? {}
    return getRequiredLeadsBild({
      level: courseData.level,
      isReaccreditation: courseData.reaccreditation,
      isConversion: courseData.conversion,
      strategies: Object.keys(strategies).filter(
        strategy => strategies[strategy]
      ) as BildStrategies[],
      numberParticipants: courseData.max_participants,
    })
  }

  return { min: 0, max: 0 }
}
