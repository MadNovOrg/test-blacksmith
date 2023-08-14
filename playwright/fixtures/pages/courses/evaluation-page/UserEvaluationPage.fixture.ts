import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'

import { fillEvaluationForm, Questions } from './Common'

export class UserEvaluationPage extends BasePage {
  readonly courseId: string
  readonly pageLoadedIndicator: Locator
  readonly successMessage: Locator
  readonly submitEvaluationButton: Locator
  readonly signatureField: Locator
  readonly evaluateButton: Locator
  readonly evaluationCompleteMessage: Locator

  constructor(page: Page, courseId: string) {
    super(page)
    this.courseId = courseId

    this.pageLoadedIndicator = this.page.locator(
      'data-testid=course-evaluation-heading'
    )
    this.successMessage = this.page.locator('data-testid=success-alert')
    this.submitEvaluationButton = this.page.locator(
      'data-testid=submit-course-evaluation'
    )
    this.signatureField = this.page.locator(
      'data-testid=course-evaluation-signature'
    )
    this.evaluateButton = this.page.locator('data-testid=evaluate-course-cta')
    this.evaluationCompleteMessage = this.page.locator(
      'data-testid=evaluate-course-complete-message'
    )
  }

  async goto() {
    await super.goto(`courses/${this.courseId}/evaluation`)
  }

  async randomlyEvaluate(questions: Questions, signature: string) {
    await fillEvaluationForm(this.page, questions, 'user')
    await this.signatureField.locator('input').fill(signature)
  }

  async submitEvaluation() {
    await this.submitEvaluationButton.locator('button').click()
  }

  async checkSubmission(text?: string) {
    await expect(this.successMessage).toHaveText(text as string)
    await expect(this.evaluateButton).toBeDisabled()
    await expect(this.evaluationCompleteMessage.locator('span')).toHaveText(
      /^Complete/
    )
  }
}
