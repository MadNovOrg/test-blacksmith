import {
  CourseType,
  Draft,
  ExpensesInput,
  InvoiceDetails,
  TrainerInput,
  ValidCourseInput,
} from '@app/types'

import { CourseException } from './components/CourseExceptionsConfirmation/utils'
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
  completeStep: (step: StepsEnum) => void
  completedSteps: StepsEnum[]
  courseData?: ValidCourseInput
  courseName: string
  pricing: {
    amount?: number
    error?: boolean
  }
  courseType: CourseType
  currentStepKey: StepsEnum | null
  draftName?: string | null
  expenses: Record<string, ExpensesInput>
  saveDraft: (name?: string) => Promise<SaveDraftResult>
  setCourseData: (courseData: ValidCourseInput) => void
  setCurrentStepKey: (step: StepsEnum) => void
  setExpenses: (expenses: Record<string, ExpensesInput>) => void
  setTrainers: (trainers: TrainerInput[]) => void
  trainers: TrainerInput[]
  setGo1Licensing: (go1Licensing: Draft['go1Licensing']) => void
  setInvoiceDetails: (invoiceDetails: InvoiceDetails) => void
  go1Licensing: Draft['go1Licensing']
  exceptions: CourseException[]
  invoiceDetails?: InvoiceDetails
  showDraftConfirmationDialog: boolean
  setShowDraftConfirmationDialog: (value: boolean) => void
}
