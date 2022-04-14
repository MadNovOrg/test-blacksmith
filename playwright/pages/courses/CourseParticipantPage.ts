import { expect, Locator, Page } from '@playwright/test'

import { CourseHeader } from '../../components/CourseHeader'
import { BASE_URL } from '../../constants'
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
    await super.goto(`${BASE_URL}/courses/${courseId}`, this.header.courseName)
  }

  async checkSuccessMessage(text: string) {
    await expect(this.successMessage).toHaveText(text)
  }
}
