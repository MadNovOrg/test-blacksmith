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

  async goto() {
    await this.page.goto()
    await this.page.waitForPageLoad()
  }

  async randomlyEvaluate(signature: string) {
    await this.page.randomlyEvaluate(this.questions, signature)
  }

  async submitEvaluation() {
    await this.page.submitEvaluation()
  }

  async checkSubmission(text?: string) {
    await this.page.checkSubmission(text)
  }

  async checkSubmissionIsNotAvailable() {
    if (this.userType === 'trainer') {
      await (this.page as TrainerEvaluationPage).checkSubmissionIsNotAvailable()
    }
  }

  async checkSubmissionIsAvailable() {
    if (this.userType === 'trainer') {
      await (this.page as TrainerEvaluationPage).checkSubmissionIsAvailable()
    }
  }

  async checkPDFExportIsNotAvailable() {
    if (this.userType === 'trainer') {
      await (this.page as TrainerEvaluationPage).checkPDFExportIsNotAvailable()
    }
  }

  async viewEvaluation() {
    if (this.userType === 'trainer') {
      await (this.page as TrainerEvaluationPage).viewEvaluation()
    }
  }
}
