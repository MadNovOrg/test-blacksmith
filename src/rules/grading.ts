import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Grade_Enum,
} from '@app/generated/graphql'

export function getAvailableGrades(
  courseLevel: Course_Level_Enum,
  deliveryType: Course_Delivery_Type_Enum
): Grade_Enum[] {
  if (
    (deliveryType === Course_Delivery_Type_Enum.Virtual &&
      courseLevel === Course_Level_Enum.Level_1) ||
    deliveryType === Course_Delivery_Type_Enum.Mixed
  ) {
    return [Grade_Enum.Pass, Grade_Enum.Fail]
  }

  if (
    deliveryType === Course_Delivery_Type_Enum.F2F &&
    [
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.IntermediateTrainer,
    ].includes(courseLevel)
  ) {
    return [Grade_Enum.Pass, Grade_Enum.AssistOnly, Grade_Enum.Fail]
  }

  if (courseLevel === Course_Level_Enum.Advanced) {
    return [Grade_Enum.Pass, Grade_Enum.Fail]
  }

  if (courseLevel === Course_Level_Enum.BildRegular) {
    return [Grade_Enum.Pass, Grade_Enum.Fail]
  }

  if (
    [
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.BildAdvancedTrainer,
    ].includes(courseLevel)
  ) {
    return [Grade_Enum.Pass, Grade_Enum.Fail]
  }
  if (courseLevel === Course_Level_Enum.FoundationTrainerPlus) {
    return [Grade_Enum.Pass, Grade_Enum.Fail]
  }

  return [Grade_Enum.Pass, Grade_Enum.ObserveOnly, Grade_Enum.Fail]
}
