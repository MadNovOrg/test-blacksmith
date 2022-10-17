import { TransferEligibleCoursesQuery } from '@app/generated/graphql'

export enum TransferStepsEnum {
  SELECT_COURSE = 'select-course',
  TRANSFER_DETAILS = 'transfer-details',
  REVIEW = 'review',
}

export type EligibleCourse =
  TransferEligibleCoursesQuery['eligibleTransferCourses'][0]
