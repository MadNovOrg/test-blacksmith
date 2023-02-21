import { Page } from '@playwright/test'

import { Questions } from './Common'
import { TrainerEvaluationPage } from './TrainerEvaluationPage'
import { UserEvaluationPage } from './UserEvaluationPage'

type UserType = 'trainer' | 'user'

export class CourseEvaluationPage {
  readonly page: UserEvaluationPage | TrainerEvaluationPage
  readonly userType: UserType
  readonly questions: Questions

  constructor(page: Page, userType: UserType, courseId: string) {
    this.userType = userType

    switch (userType) {
      case 'trainer':
        this.page = new TrainerEvaluationPage(page, courseId)
        break
      case 'user':
        this.page = new UserEvaluationPage(page, courseId)
        break
      default:
        throw new Error('Invalid user type')
    }

    this.questions = {
      rating: this.page.page.locator(
        'data-testid=course-evaluation-rating-question'
      ),
      boolean: this.page.page.locator(
        'data-testid=course-evaluation-boolean-question'
      ),
      text: this.page.page.locator(
        'data-testid=course-evaluation-text-question'
      ),
    }
  }

  goto() {
    return this.page.goto()
  }

  randomlyEvaluate(signature: string) {
    return this.page.randomlyEvaluate(this.questions, signature)
  }

  submitEvaluation() {
    return this.page.submitEvaluation()
  }

  checkSubmission(text?: string) {
    return this.page.checkSubmission(text)
  }

  checkSubmissionIsNotAvailable() {
    if (this.userType === 'trainer') {
      return (
        this.page as TrainerEvaluationPage
      ).checkSubmissionIsNotAvailable()
    }
  }

  checkSubmissionIsAvailable() {
    if (this.userType === 'trainer') {
      return (this.page as TrainerEvaluationPage).checkSubmissionIsAvailable()
    }
  }

  checkPDFExportIsNotAvailable() {
    if (this.userType === 'trainer') {
      return (this.page as TrainerEvaluationPage).checkPDFExportIsNotAvailable()
    }
  }

  viewEvaluation() {
    if (this.userType === 'trainer') {
      return (this.page as TrainerEvaluationPage).viewEvaluation()
    }
  }
}
