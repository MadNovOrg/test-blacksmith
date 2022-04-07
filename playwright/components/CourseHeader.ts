import { Locator, Page } from '@playwright/test'

export class CourseHeader {
  readonly page: Page
  readonly courseName: Locator

  constructor(page: Page) {
    this.page = page
    this.courseName = this.page.locator('data-testid=course-name')
  }
}
