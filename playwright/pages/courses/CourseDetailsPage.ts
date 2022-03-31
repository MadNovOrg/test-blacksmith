import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class CourseDetailsPage extends BasePage {
  readonly successMessage: Locator

  constructor(page: Page) {
    super(page)
    this.successMessage = this.page.locator('data-testid=success-message')
  }

  async goto(courseId: string) {
    await super.goto(
      `${BASE_URL}/trainer-base/course/${courseId}/details`,
      this.successMessage
    )
  }

  async checkSuccessMessage(text: string) {
    await expect(this.successMessage).toHaveText(text)
  }
}
