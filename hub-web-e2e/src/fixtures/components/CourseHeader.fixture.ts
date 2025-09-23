import { Locator, Page, expect } from '@playwright/test'

export class CourseHeader {
  readonly page: Page
  readonly courseName: Locator
  readonly courseCode: Locator

  constructor(page: Page) {
    this.page = page
    this.courseName = this.page.locator('data-testid=course-name')
    this.courseCode = this.page.locator('data-testid=course-code')
  }

  async checkCourseName(name: string) {
    await expect(this.courseName).toHaveText(name)
  }
  async checkCourseCode(code: string) {
    await expect(this.courseCode).toHaveText(code)
  }
}
