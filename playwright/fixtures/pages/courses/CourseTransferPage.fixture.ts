import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '@qa/commands'

import { BasePage } from '../BasePage.fixture'

export class CourseTransferPage extends BasePage {
  readonly transferDetails: Locator
  readonly reviewAndConfirm: Locator
  readonly confirmTransfer: Locator

  constructor(page: Page) {
    super(page)
    this.transferDetails = this.page.locator('[data-testId=transfer-details]')
    this.reviewAndConfirm = this.page.locator(
      '[data-testid="review-and-confirm"]'
    )
    this.confirmTransfer = this.page.locator('[data-testid="confirm-transfer"]')
  }

  async selectCourseId(courseId: number) {
    await this.page.locator(`[data-testid=change-course-${courseId}]`).click()
  }

  async clickTransferDetails() {
    await this.transferDetails.click()
  }

  async clickReviewAndConfirm() {
    await this.reviewAndConfirm.click()
  }

  async applyFeeGroup(value: 'APPLY_TERMS' | 'CUSTOM_FEE' | 'FREE') {
    await this.page.locator(`input[value=${value}]`).check()
  }

  async clickConfirmTransfer() {
    await Promise.all([
      waitForGraphQLResponse(this.page, 'transferParticipant', 'success'),
      this.confirmTransfer.click(),
    ])
  }
}
