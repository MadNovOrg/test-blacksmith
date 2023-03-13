import { expect, Locator, Page } from '@playwright/test'

import { CourseParticipant } from '@app/types'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class CourseGradingPage extends BasePage {
  readonly confirmModules: Locator
  readonly continueToAttendees: Locator
  readonly gradingMenu: Locator
  readonly feedbackInput: Locator

  constructor(page: Page) {
    super(page)
    this.confirmModules = this.page.locator(
      'text=Confirm modules and physical techniques'
    )
    this.continueToAttendees = this.page.locator(
      'text=Continue to grading attendees'
    )
    this.gradingMenu = this.page.locator(
      'data-testid=course-grading-menu-selected'
    )
    this.feedbackInput = this.page.locator(
      'data-testid=feedback-input >> input'
    )
  }

  async goto(courseId: string) {
    await super.goto(`${BASE_URL}/courses/${courseId}/grading-details`)
  }

  async expectParticipantsToBeVisible(participants: CourseParticipant[]) {
    for (const participant of participants) {
      await expect(
        this.page.locator(`text=${participant.profile.fullName}`)
      ).toBeVisible()
    }
  }

  async clickCourseGradingMenu() {
    await this.gradingMenu.click()
  }

  async clickPass() {
    await this.page.click('[role=listbox] >> text=Pass')
  }

  async clickModules(moduleGroupName: string) {
    await this.page.click(`text=${moduleGroupName}`)
  }

  async fillInFeedback(feedback: string) {
    await this.feedbackInput.fill(feedback)
  }

  async submitFinalGrade() {
    await this.page.click('text=Submit final grade')
  }

  async clickConfirm() {
    await this.page.click('button:has-text("Confirm")')
  }

  async expectParticipantsToHaveGrade(
    participants: CourseParticipant[],
    grade: string
  ) {
    for (const participant of participants) {
      await expect(
        this.page.locator(
          `data-testid=attending-participant-row-${participant.id} >> text=${grade}`
        )
      ).toBeVisible()
    }
  }
}
