import { TransferEligibleCoursesQuery } from '@app/generated/graphql'

export enum TransferStepsEnum {
  SELECT_COURSE = 'select-course',
  TRANSFER_DETAILS = 'transfer-details',
  REVIEW = 'review',
}

export enum FeeType {
  APPLY_TERMS = 'APPLY_TERMS',
  CUSTOM_FEE = 'CUSTOM_FEE',
  NO_FEE = 'NO_FEE',
}

export type EligibleCourse = TransferEligibleCoursesQuery['eligibleCourses'][0]
