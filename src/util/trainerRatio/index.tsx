import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Course,
} from '@app/generated/graphql'
import { TrainerInput, TrainerRoleTypeName } from '@app/types'

import { getRequiredAssistantsBild } from './trainerRatio.bild'
import { getRequiredAssistants as getRequiredAssistantsIcm } from './trainerRatio.icm'
import { RequiredTrainers } from './types'

export type RatioCourseData = Pick<
  Course,
  | 'accreditedBy'
  | 'deliveryType'
  | 'level'
  | 'max_participants'
  | 'reaccreditation'
  | 'type'
> & {
  isTrainer: boolean
  isUKCountry: boolean
  usesAOL?: boolean
  isAustraliaRegion: boolean
}

export type RatioTrainerData = Pick<
  TrainerInput,
  'trainer_role_types' | 'type'
>[]

export function getRequiredAssistants(
  courseData: RatioCourseData &
    Pick<Course, 'type' | 'residingCountry'> & {
      leadTrainerRoleTypes?: Pick<TrainerInput, 'trainer_role_types'>
    },
): RequiredTrainers {
  if (courseData.accreditedBy === Accreditors_Enum.Icm) {
    return getRequiredAssistantsIcm({
      courseLevel: courseData.level,
      deliveryType: courseData.deliveryType,
      isAustraliaRegion: courseData.isAustraliaRegion,
      isUKCountry: courseData.isUKCountry,
      maxParticipants: courseData.max_participants,
      reaccreditation: courseData.reaccreditation ?? false,
      type: courseData.type,
      leadTrainerRoleTypes:
        courseData.leadTrainerRoleTypes?.trainer_role_types.map(
          roleType => roleType.trainer_role_type?.name as TrainerRoleTypeName,
        ) || [],
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
  courseType: Course_Type_Enum,
  isTrainer: boolean,
): RequiredTrainers {
  const notLeadTrainerRequired =
    courseType === Course_Type_Enum.Open ||
    (courseType === Course_Type_Enum.Indirect && isTrainer)
  return { min: notLeadTrainerRequired ? 0 : 1, max: 1 }
}

export function getRequiredModerators(courseData: {
  accreditedBy: Accreditors_Enum
  level: Course_Level_Enum
  reaccreditation?: boolean | null
}): RequiredTrainers {
  if (
    courseData.accreditedBy === Accreditors_Enum.Icm &&
    [
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
    ].includes(courseData.level) &&
    !courseData.reaccreditation
  ) {
    return { min: 0, max: 1 }
  }

  return { min: 0, max: 0 }
}
