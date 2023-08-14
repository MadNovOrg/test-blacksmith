import { Locator, Page, expect } from '@playwright/test'

export class CourseHeader {
  readonly page: Page
  readonly courseName: Locator

  constructor(page: Page) {
    this.page = page
    this.courseName = this.page.locator('data-testid=course-name')
  }

  async checkCourseName(name: string) {
    await expect(this.courseName).toHaveText(name)
  }
}
