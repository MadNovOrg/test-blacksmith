import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '../../commands'
import { BasePage } from '../BasePage'

export class ReviewAndConfirmPage extends BasePage {
  readonly createCourseButton: Locator

  constructor(page: Page) {
    super(page)
    this.createCourseButton = this.page.locator(
      '[data-testid="ReviewAndConfirm-submit"]'
    )
  }

  async getCourseIdOnCreation(): Promise<number> {
    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'insertCourse', 'inserted'),
      this.createCourseButton.click(),
    ])
    return responses[0].insertCourse.inserted[0].id
  }
}
