import { Course_Exception_Enum, Course_Type_Enum } from '@app/generated/graphql'
import {
  Draft,
  ExpensesInput,
  InvoiceDetails,
  TrainerInput,
  ValidCourseInput,
} from '@app/types'

import { SaveDraftResult } from './components/CreateCourseProvider'

export enum StepsEnum {
  COURSE_DETAILS = 'course-details',
  ASSIGN_TRAINER = 'assign-trainer',
  TRAINER_EXPENSES = 'trainer-expenses',
  LICENSE_ORDER_DETAILS = 'license-order-details',
  ORDER_DETAILS = 'order-details',
  REVIEW_AND_CONFIRM = 'review-and-confirm',
  COURSE_BUILDER = 'course-builder',
}

export type ContextValue = {
  completedSteps: StepsEnum[]
  completeStep: (step: StepsEnum) => void
  courseData?: ValidCourseInput
  courseName: string
  courseType?: Course_Type_Enum
  currentStepKey: StepsEnum | null
  draftName?: string | null
  exceptions: Course_Exception_Enum[]
  expenses: Record<string, ExpensesInput>
  go1Licensing: Draft['go1Licensing']
  initializeData: (data: Draft, draftName?: string | undefined) => void
  invoiceDetails?: InvoiceDetails
  pricing: { amount?: number; error?: boolean }
  saveDraft: (name?: string) => Promise<SaveDraftResult>
  setCourseData: (courseData: ValidCourseInput) => void
  setCurrentStepKey: (step: StepsEnum) => void
  setExpenses: (expenses: Record<string, ExpensesInput>) => void
  setGo1Licensing: (go1Licensing: Draft['go1Licensing']) => void
  setInvoiceDetails: (invoiceDetails: InvoiceDetails) => void
  setShowDraftConfirmationDialog: (value: boolean) => void
  setTrainers: (trainers: TrainerInput[]) => void
  showDraftConfirmationDialog: boolean
  trainers: TrainerInput[]
}
