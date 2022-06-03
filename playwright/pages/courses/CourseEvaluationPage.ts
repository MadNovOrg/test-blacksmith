import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class CourseEvaluationPage extends BasePage {
  readonly courseSummaryEvaluation: Locator
  readonly successMessage: Locator
  readonly submitEvaluationButton: Locator
  readonly questions: {
    rating: Locator
    boolean: Locator
    text: Locator
  }
  readonly signatureField: Locator
  readonly evaluateButton: Locator
  readonly evaluationCompleteMessage: Locator

  constructor(page: Page) {
    super(page)
    this.courseSummaryEvaluation = this.page.locator(
      'data-testid=course-evaluation-heading'
    )
    this.successMessage = this.page.locator('data-testid=success-alert')
    this.submitEvaluationButton = this.page.locator(
      'data-testid=submit-course-evaluation'
    )
    this.questions = {
      rating: this.page.locator(
        'data-testid=course-evaluation-rating-question'
      ),
      boolean: this.page.locator(
        'data-testid=course-evaluation-boolean-question'
      ),
      text: this.page.locator('data-testid=course-evaluation-text-question'),
    }
    this.signatureField = this.page.locator(
      'data-testid=course-evaluation-signature'
    )
    this.evaluateButton = this.page.locator('data-testid=evaluate-course-cta')
    this.evaluationCompleteMessage = this.page.locator(
      'data-testid=evaluate-course-complete-message'
    )
  }

  async goto(courseId: string) {
    await super.goto(
      `${BASE_URL}/courses/${courseId}/evaluation`,
      this.courseSummaryEvaluation
    )
  }

  async randomlyEvaluate(signature: string) {
    const [ratingQuestionsCount, booleanQuestionsCount, textQuestionsCount] =
      await Promise.all([
        this.questions.rating.count(),
        this.questions.boolean.count(),
        this.questions.text.count(),
      ])

    for (let i = 0; i < ratingQuestionsCount; ++i) {
      const question = this.questions.rating.nth(i)
      const rate = Math.round(Math.random() * 4) + 1
      await question
        .locator(`data-testid=rating-${rate}`)
        .click({ force: true })
    }

    for (let i = 0; i < booleanQuestionsCount; ++i) {
      const question = this.questions.boolean.nth(i)
      const response = Math.round(Math.random()) ? 'yes' : 'no'
      await question.locator(`data-testid=rating-${response}`).click()
      await this.page
        .locator(`data-testid=rating-boolean-reason-${response}`)
        .locator('input')
        .fill('Reason')
    }

    for (let i = 0; i < textQuestionsCount; ++i) {
      const question = this.questions.text.nth(i)
      await question.locator('input').fill('Response')
    }

    await this.signatureField.locator('input').fill(signature)
  }

  async submitEvaluation() {
    await this.submitEvaluationButton.locator('button').click()
  }

  async checkSubmission(text: string) {
    await expect(this.successMessage).toHaveText(text)
    await expect(this.evaluateButton).toBeDisabled()
    await expect(this.evaluationCompleteMessage.locator('span')).toHaveText(
      /^Complete/
    )
  }
}
