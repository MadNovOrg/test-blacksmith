import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

type UserType = 'trainer' | 'user'
type Questions = {
  rating: Locator
  boolean: Locator
  text: Locator
}

const fillEvaluationForm = async (page: Page, questions: Questions) => {
  const [ratingQuestionsCount, booleanQuestionsCount, textQuestionsCount] =
    await Promise.all([
      questions.rating.count(),
      questions.boolean.count(),
      questions.text.count(),
    ])

  for (let i = 0; i < ratingQuestionsCount; ++i) {
    const question = questions.rating.nth(i)
    const rate = Math.round(Math.random() * 4) + 1
    await question.locator(`data-testid=rating-${rate}`).click({ force: true })
  }

  for (let i = 0; i < booleanQuestionsCount; ++i) {
    const question = questions.boolean.nth(i)
    const response = Math.round(Math.random()) ? 'yes' : 'no'
    await question.locator(`data-testid=rating-${response}`).click()
    if (response === 'yes') {
      await page
        .locator(`data-testid=rating-boolean-reason-${response}`)
        .locator('input')
        .fill('Reason')
    }
  }

  for (let i = 0; i < textQuestionsCount; ++i) {
    const question = questions.text.nth(i)
    await question.locator('input').fill('Response')
  }
}

class TrainerEvaluationPage extends BasePage {
  readonly courseId: string
  readonly signatureField: Locator
  readonly PDFExportButton: Locator
  readonly pageLoadedIndicator: Locator
  readonly startEvaluationButton: Locator
  readonly submitEvaluationButton: Locator
  readonly viewSummaryEvaluationButton: Locator
  readonly evaluationPageLoadedIndicator: Locator

  constructor(page: Page, courseId: string) {
    super(page)
    this.courseId = courseId

    this.pageLoadedIndicator = this.page.locator(
      'data-testid=trainer-evaluation-title'
    )
    this.startEvaluationButton = this.page.locator(
      'data-testid=trainer-evaluation-button'
    )
    this.evaluationPageLoadedIndicator = this.page.locator(
      'data-testid=course-evaluation-heading'
    )
    this.signatureField = this.page.locator(
      'data-testid=course-evaluation-signature'
    )
    this.submitEvaluationButton = this.page.locator(
      'data-testid=submit-course-evaluation'
    )
    this.viewSummaryEvaluationButton = this.page.locator(
      'data-testid=view-summary-evaluation'
    )
    this.PDFExportButton = this.page.locator('data-testid=export-summary')
  }

  async goto() {
    await super.goto(
      `${BASE_URL}/courses/${this.courseId}/details?tab=EVALUATION`,
      this.pageLoadedIndicator
    )
  }

  async randomlyEvaluate(questions: Questions, signature: string) {
    await super.goto(
      `${BASE_URL}/courses/${this.courseId}/evaluation/submit`,
      this.evaluationPageLoadedIndicator
    )
    await fillEvaluationForm(this.page, questions)
    await this.signatureField.locator('input').fill(signature)
  }

  async submitEvaluation() {
    await this.submitEvaluationButton.locator('button').click()
  }

  async checkSubmission() {
    await expect(this.pageLoadedIndicator.isVisible()).toBeTruthy()

    await this.goto()
    await expect(this.viewSummaryEvaluationButton).not.toBeDisabled()
  }

  async checkSubmissionIsNotAvailable() {
    await expect(await this.startEvaluationButton.count()).toBe(0)
  }

  async checkSubmissionIsAvailable() {
    await expect(await this.startEvaluationButton.count()).toBe(1)
  }

  async checkPDFExportIsNotAvailable() {
    await expect(this.PDFExportButton).toBeDisabled()
  }

  async checkPDFExportIsAvailable() {
    await expect(this.PDFExportButton).toBeEnabled()
  }

  async checkPDFExport() {
    await this.PDFExportButton.click()

    await expect(this.page.locator('text=Generating summary...')).toBeEnabled()
    await expect(this.page.locator('text=Download Summary')).toBeEnabled()

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.PDFExportButton.click(),
    ])
    await expect(await download.path()).toMatch(/var\/folders/)
  }
}

class UserEvaluationPage extends BasePage {
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
    await super.goto(
      `${BASE_URL}/courses/${this.courseId}/evaluation`,
      this.pageLoadedIndicator
    )
  }

  async randomlyEvaluate(questions: Questions, signature: string) {
    await fillEvaluationForm(this.page, questions)
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

  checkPDFExportIsAvailable() {
    if (this.userType === 'trainer') {
      return (this.page as TrainerEvaluationPage).checkPDFExportIsAvailable()
    }
  }

  checkPDFExport() {
    if (this.userType === 'trainer') {
      return (this.page as TrainerEvaluationPage).checkPDFExport()
    }
  }
}
