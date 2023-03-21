import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../../BasePage'

import { fillEvaluationForm, Questions } from './Common'

export class TrainerEvaluationPage extends BasePage {
  readonly courseId: string
  readonly attendingTable: Locator
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
    this.attendingTable = this.page.locator('[data-testid=attending-table]')
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
    await super.goto(`courses/${this.courseId}/details?tab=EVALUATION`)
  }

  async gotoSubmit() {
    await super.goto(`courses/${this.courseId}/evaluation/submit`)
  }

  async checkSubmissionIsAvailable() {
    await expect(this.startEvaluationButton).toBeEnabled()
  }

  async checkSubmissionIsNotAvailable() {
    await expect(this.startEvaluationButton).toBeDisabled()
  }

  async checkPDFExportIsNotAvailable() {
    await expect(this.PDFExportButton).toBeDisabled()
  }

  async randomlyEvaluate(questions: Questions, signature: string) {
    await this.gotoSubmit()
    await fillEvaluationForm(this.page, questions)
    await this.signatureField.locator('input').fill(signature)
  }

  async submitEvaluation() {
    await this.submitEvaluationButton.locator('button').click()
  }

  async checkSubmission() {
    await expect(this.attendingTable).toBeVisible()
    await this.goto()
    await expect(this.viewSummaryEvaluationButton).toBeEnabled()
  }

  async viewEvaluation() {
    await expect(this.viewSummaryEvaluationButton).toBeEnabled()
    await this.viewSummaryEvaluationButton.click()
    await expect(this.page.locator('text=Rating of training')).toBeVisible()
  }
}
