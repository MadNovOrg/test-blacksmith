import { expect, Locator, Page } from '@playwright/test'

import { CourseHeader } from '@qa/components/CourseHeader'

import { BasePage } from '../BasePage'

export class CourseParticipantPage extends BasePage {
  readonly header: CourseHeader
  readonly successMessage: Locator

  constructor(page: Page) {
    super(page)
    this.header = new CourseHeader(this.page)
    this.successMessage = this.page.locator('data-testid=success-alert')
  }

  async goto(courseId: string) {
    await super.goto(`courses/${courseId}`)
  }

  async checkSuccessMessage(text: string) {
    await expect(this.successMessage).toHaveText(text)
  }
}
