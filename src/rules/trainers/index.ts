import { CourseLevel, CourseType } from '@app/types'

type ModeratorCriteria = {
  courseType: CourseType
  courseLevel: CourseLevel
  isReaccreditation: boolean
}

export function isModeratorNeeded({
  courseLevel,
  courseType,
  isReaccreditation,
}: ModeratorCriteria): boolean {
  if (courseType === CourseType.INDIRECT) return false

  if (
    [
      CourseLevel.AdvancedTrainer,
      CourseLevel.IntermediateTrainer,
      CourseLevel.BildIntermediateTrainer,
      CourseLevel.BildAdvancedTrainer,
    ].includes(courseLevel) &&
    !isReaccreditation
  ) {
    return true
  }

  return false
}

export function isModeratorMandatory(criteria: {
  courseType: CourseType
  courseLevel: CourseLevel
  isReaccreditation: boolean
}): boolean {
  const needsModerator = isModeratorNeeded(criteria)

  return criteria.courseType == CourseType.OPEN ? false : needsModerator
}
