import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Course,
} from '@app/generated/graphql'
import { TrainerInput } from '@app/types'

import { getRequiredAssistantsBild } from './trainerRatio.bild'
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
> & {
  usesAOL?: boolean
}

export type RatioTrainerData = Pick<
  TrainerInput,
  'trainer_role_types' | 'type'
>[]

export function getRequiredAssistants(
  courseData: RatioCourseData & { type: Course_Type_Enum }
): RequiredTrainers {
  if (courseData.accreditedBy === Accreditors_Enum.Icm) {
    return getRequiredAssistantsIcm({
      courseLevel: courseData.level,
      deliveryType: courseData.deliveryType,
      maxParticipants: courseData.max_participants,
      reaccreditation: courseData.reaccreditation ?? false,
      type: courseData.type,
      usesAOL: courseData.usesAOL ?? false,
    })
  } else if (courseData.accreditedBy === Accreditors_Enum.Bild) {
    return getRequiredAssistantsBild({
      isReaccreditation: courseData.reaccreditation ?? false,
      level: courseData.level,
      numberParticipants: courseData.max_participants,
      type: courseData.type,
    })
  }

  return { min: 0, max: 0 }
}
export function getRequiredLeads(
  courseType: Course_Type_Enum
): RequiredTrainers {
  return { min: courseType === Course_Type_Enum.Open ? 0 : 1, max: 1 }
}

export function getRequiredModerators(courseData: {
  accreditedBy: Accreditors_Enum
  level: Course_Level_Enum
}): RequiredTrainers {
  if (
    courseData.accreditedBy === Accreditors_Enum.Icm &&
    [
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
    ].includes(courseData.level)
  ) {
    return { min: 1, max: 1 }
  }

  return { min: 0, max: 0 }
}
