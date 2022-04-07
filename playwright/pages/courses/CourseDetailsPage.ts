import { expect, Locator, Page } from '@playwright/test'

import { CourseHeader } from '../../components/CourseHeader'
import { UiTable } from '../../components/UiTable'
import { BASE_URL } from '../../constants'
import { toAttendeesTableRow } from '../../data/mappings'
import { User } from '../../data/types'
import { BasePage } from '../BasePage'

class InviteAttendeesPopUp {
  readonly page: Page
  readonly emailInput: Locator
  readonly sendButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = this.page.locator(
      '[data-testid="modal-invites-emails"] input'
    )
    this.sendButton = this.page.locator('data-testid=modal-invites-send')
  }

  async enterEmails(emails: string[]) {
    for (const email of emails) {
      await this.emailInput.fill(email)
      await this.emailInput.press('Enter')
    }
  }

  async clickSendButton() {
    await this.sendButton.click()
  }
}

export class CourseDetailsPage extends BasePage {
  readonly header: CourseHeader
  readonly successMessage: Locator
  readonly inviteAttendeesButton: Locator
  readonly invitesLeftText: Locator
  readonly attendingText: Locator
  readonly attendingTab: Locator
  readonly pendingTab: Locator
  readonly declinedTab: Locator
  readonly invitePopUp: InviteAttendeesPopUp
  readonly attendeesTable: UiTable

  constructor(page: Page) {
    super(page)
    this.header = new CourseHeader(this.page)
    this.successMessage = this.page.locator('data-testid=success-message')
    this.inviteAttendeesButton = this.page.locator(
      'data-testid=course-invite-btn'
    )
    this.invitesLeftText = this.page.locator('data-testid=invites-left')
    this.attendingText = this.page.locator('data-testid=attending')
    this.attendingTab = this.page.locator('data-testid=tabParticipants')
    this.pendingTab = this.page.locator('data-testid=tabPending')
    this.declinedTab = this.page.locator('data-testid=tabDeclined')
    this.invitePopUp = new InviteAttendeesPopUp(this.page)
    this.attendeesTable = new UiTable(
      this.page.locator('data-testid=attendees-table')
    )
  }

  async goto(courseId: string) {
    await super.goto(
      `${BASE_URL}/trainer-base/course/${courseId}/details`,
      this.header.courseName
    )
  }

  async checkSuccessMessage(text: string) {
    await expect(this.successMessage).toHaveText(text)
  }

  async checkInvitesLeftText(text: string) {
    await expect(this.invitesLeftText).toHaveText(text)
  }

  async checkAttendingText(text: string) {
    await expect(this.attendingText).toHaveText(text)
  }

  async checkAttendingTabText(text: string) {
    await expect(this.attendingTab).toHaveText(text)
  }

  async checkPendingTabText(text: string) {
    await expect(this.pendingTab).toHaveText(text)
  }

  async checkDeclinedTabText(text: string) {
    await expect(this.declinedTab).toHaveText(text)
  }

  async clickInviteAttendeesButton() {
    await this.inviteAttendeesButton.click()
  }

  async checkAttendeesTableRows(users: User[]) {
    await expect(this.attendeesTable.rows).toHaveCount(users.length)
    const expectedRows = users.map(toAttendeesTableRow)
    const actualRows = await this.attendeesTable.getRows()
    expect(actualRows).toEqual(expectedRows)
  }
}
