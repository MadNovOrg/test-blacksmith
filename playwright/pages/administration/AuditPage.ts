import { expect, Locator, Page } from '@playwright/test'

import { Audit_Type } from '../../data/enums'
import { BasePage } from '../BasePage'

export class AuditPage extends BasePage {
  readonly courseCodeEntry: (courseId: number) => Locator

  constructor(page: Page) {
    super(page)
    this.courseCodeEntry = (courseId: number) =>
      this.page.locator(
        `[data-testid=audit-log-entry-course-code]:has-text('${courseId}')`
      )
  }

  async goto(tab?: Audit_Type) {
    await super.goto(`admin/audit${tab ? `?tab=${tab}` : ''}`)
  }

  async checkCourseCancelled(courseId: number) {
    await expect(this.courseCodeEntry(courseId)).toHaveCount(1)
  }
}
