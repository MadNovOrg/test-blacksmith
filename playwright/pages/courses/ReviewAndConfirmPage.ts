import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

export class ReviewAndConfirmPage extends BasePage {
  readonly createCourseButton: Locator

  constructor(page: Page) {
    super(page)
    this.createCourseButton = this.page.locator(
      '[data-testid="ReviewAndConfirm-submit"]'
    )
  }

  async getOrderIdAfterClickingCreateCourseButton(): Promise<number> {
    const responses = await Promise.all([
      this.page.waitForResponse(
        res =>
          res.request().url().includes('/graphql') &&
          (res.request().postData() as string).includes('insert_course')
      ),
      this.createCourseButton.click(),
    ])
    const data = await responses[0].json()
    return data.data.insertCourse.inserted[0].id
  }
}
