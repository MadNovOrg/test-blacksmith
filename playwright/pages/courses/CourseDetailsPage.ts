import { expect, Locator, Page } from '@playwright/test'

import { getProfileId } from '../../api/hasura-api'
import { CourseHeader } from '../../components/CourseHeader'
import { UiTable } from '../../components/UiTable'
import { BASE_URL } from '../../constants'
import { toAttendeesTableRow } from '../../data/mappings'
import { User } from '../../data/types'
import { BasePage } from '../BasePage'
import { CourseGradingPage } from '../courses/CourseGradingPage'
import { CourseTransferPage } from '../courses/CourseTransferPage'

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

class RemoveAttendeePopUp {
  readonly page: Page
  readonly applyCancellationTermsRadioButton: Locator
  readonly customFeeRadioButton: Locator
  readonly noFeesRadioButton: Locator
  readonly removeAttendeeButton: Locator
  readonly closeButton: Locator
  readonly reasonForCancellationInput: Locator
  readonly confirmationCheckbox: Locator

  constructor(page: Page) {
    this.page = page
    this.applyCancellationTermsRadioButton = this.page.locator(
      '[data-testid="apply-cancellation-terms-radioButton"]'
    )
    this.customFeeRadioButton = this.page.locator(
      '[data-testid="custom-fee-radioButton"]'
    )
    this.noFeesRadioButton = this.page.locator(
      '[data-testid="no-fees-radioButton"]'
    )
    this.removeAttendeeButton = this.page.locator(
      '[data-testid="removeAttendee-button"]'
    )
    this.closeButton = this.page.locator('[data-testid="close-button"]')
    this.reasonForCancellationInput = this.page.locator(
      '[data-testid="reasonForCancellation-input"] input'
    )
    this.confirmationCheckbox = this.page.locator(
      '[data-testid="confirmation-checkbox"]'
    )
  }

  async removeAttendeeWithNoteUsingUser(
    userRole = 'admin',
    note = 'Reason of removing the attendee'
  ) {
    await this.reasonForCancellationInput.type(note)
    userRole !== 'admin' && (await this.confirmationCheckbox.click())
    await this.removeAttendeeButton.click()
  }
}

class ReplaceAttendeePopUp {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly surnameInput: Locator
  readonly emailInput: Locator
  readonly termsAcceptedCheckbox: Locator
  readonly cancelButton: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = this.page.locator('input[name=firstName]')
    this.surnameInput = this.page.locator('input[name=surname]')
    this.emailInput = this.page.locator('input[name=email]')
    this.termsAcceptedCheckbox = this.page.locator('input[name=termsAccepted]')
    this.cancelButton = this.page.locator('[data-testid=replace-cancel]')
    this.submitButton = this.page.locator('[data-testid=replace-submit]')
  }

  async enterDetails(
    firstName: string,
    surname: string,
    email: string,
    termsAccepted = true
  ) {
    await this.firstNameInput.fill(firstName)
    await this.surnameInput.fill(surname)
    await this.emailInput.fill(email)
    await this.termsAcceptedCheckbox.setChecked(termsAccepted)
  }

  async clickSubmitButton() {
    await this.submitButton.click()
  }
}

export class CourseDetailsPage extends BasePage {
  readonly additionalNotes: Locator
  readonly attendeeRemoveButton: Locator
  readonly attendeesTable: UiTable
  readonly attendingTab: Locator
  readonly attendingText: Locator
  readonly cancelCourseButton: Locator
  readonly cancelCourseCheckbox: Locator
  readonly cancelEntireCourseButton: Locator
  readonly courseGradingNav: Locator
  readonly declinedTab: Locator
  readonly editCourseButton: Locator
  readonly gradingTab: Locator
  readonly header: CourseHeader
  readonly inviteAttendeesButton: Locator
  readonly invitePopUp: InviteAttendeesPopUp
  readonly invitesLeftText: Locator
  readonly manageAttendanceButtonSelector: string
  readonly pendingTab: Locator
  readonly replacePopUp: ReplaceAttendeePopUp
  readonly saveButton: Locator
  readonly successMessage: Locator

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
    this.replacePopUp = new ReplaceAttendeePopUp(this.page)
    this.attendeesTable = new UiTable(
      this.page.locator('data-testid=attending-table')
    )
    this.editCourseButton = this.page.getByText('Edit course details')
    this.saveButton = this.page.locator('[data-testid="save-button"]')
    this.cancelCourseButton = this.page.locator(
      '[data-testid="cancel-course-button"]'
    )
    this.cancelCourseCheckbox = this.page.locator(
      '[data-testid="cancel-entire-course-checkbox"]'
    )
    this.cancelEntireCourseButton = this.page.locator(
      '[data-testid="cancel-entire-course-button"]'
    )
    this.additionalNotes = this.page.locator(
      '[data-testid="additional-notes-label"]'
    )
    this.attendeeRemoveButton = this.page.locator(
      '[data-testid="attendee-remove"]'
    )
    this.manageAttendanceButtonSelector = '[data-testid=manage-attendance]'
    this.gradingTab = this.page.locator('data-testid=grading-tab')

    this.courseGradingNav = this.page.locator(
      'data-testid="course-grading-details-nav"'
    )
  }

  async goto(courseId: string) {
    await super.goto(`${BASE_URL}/courses/${courseId}/details`)
    await this.waitForLoad()
  }

  async waitForLoad() {
    await expect(this.attendingText).toBeVisible()
  }

  async checkSuccessMessage(text: string) {
    const successMessageVisible = await this.successMessage.isVisible()
    if (successMessageVisible) {
      await expect(this.successMessage).toHaveText(text)
    }
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

  async clickInviteAttendeesButton(): Promise<InviteAttendeesPopUp> {
    await this.inviteAttendeesButton.click()
    return new InviteAttendeesPopUp(this.page)
  }

  async checkAttendeesTableRows(users: User[]) {
    await this.checkAttendeesTableNumberOfRows(users)
    const expectedRows = users.map(toAttendeesTableRow)
    const actualRows = await this.attendeesTable.getRows()
    expect(actualRows).toEqual(expectedRows)
  }

  async checkAttendeesTableNumberOfRows(users: User[]) {
    await expect(this.attendeesTable.rows).toHaveCount(users.length)
  }

  async clickEditCourseButton() {
    await this.editCourseButton.click()
  }

  async fillNotes(inputtedNote: string) {
    await this.page
      .locator('[data-testid="notes-input"] >> input')
      .fill(`${inputtedNote}`)
  }

  async clickSaveButton() {
    await this.saveButton.click()
  }

  async fillSalesRepresentative() {
    await this.page.getByPlaceholder('Sales representative').fill('sales')
    await this.page
      .locator('.MuiAutocomplete-popper .MuiAutocomplete-option')
      .click()
  }

  async checkNotesOnCoursePage(inputtedNote: string) {
    const infoIcon = await this.page.locator('[data-testid="InfoIcon"]')
    await expect(infoIcon).toBeVisible()
    await expect(this.additionalNotes).toHaveAttribute(
      'aria-label',
      `${inputtedNote}`
    )
  }

  async clickCancelCourseButton() {
    await this.cancelCourseButton.click()
  }

  async clickCancelCourseDropdown() {
    await this.page.locator('[data-testid="cancel-course-dropdown"]').click()
    await this.page.getByText('Trainer availability').click()
  }

  async enterCancellationReason(reason = 'Some reason for cancelling') {
    await this.page.locator('input[name=cancellationReason]').type(reason)
  }

  async checkCancelCourseCheckbox() {
    await this.page
      .locator('[data-testid="cancel-entire-course-checkbox"]')
      .check()
  }

  async clickCancelEntireCourseButton() {
    await this.cancelEntireCourseButton.click()
  }

  async clickManageAttendance() {
    await this.page.locator('[data-testid=manage-attendance]').click()
  }

  async clickManageAttendanceByAttendeeData(attendeeData: string) {
    await this.page
      .locator(
        `[data-testid*="course-participant"]:has-text("${attendeeData}")`
      )
      .locator(this.manageAttendanceButtonSelector)
      .click()
  }

  async clickAttendeeTransfer(): Promise<CourseTransferPage> {
    await this.page.locator('[data-testid=attendee-transfer]').click()
    return new CourseTransferPage(this.page)
  }

  async clickAttendeeRemove(): Promise<RemoveAttendeePopUp> {
    await this.attendeeRemoveButton.click()
    return new RemoveAttendeePopUp(this.page)
  }

  async clickAttendeeReplace() {
    await this.page.locator('[data-testid=attendee-replace]').click()
  }

  async replaceAttendee(user: User) {
    await this.replacePopUp.enterDetails(
      user.givenName,
      user.familyName,
      user.email
    )
    await this.replacePopUp.clickSubmitButton()
  }

  async checkAttendeeExists(user: User) {
    const attendee = await this.page.locator('tr', {
      has: this.page.locator(
        `a[href="/profile/${await getProfileId(user.email)}"]`
      ),
    })
    await expect(attendee).toContainText(`${user.givenName} ${user.familyName}`)
  }

  async clickGradingTab() {
    await this.gradingTab.click()
  }

  async clickGradeAllAttendees(): Promise<CourseGradingPage> {
    await this.page.click('text=Grade all attendees')
    return new CourseGradingPage(this.page)
  }

  async clickParticipantByGrade(id: string): Promise<CourseGradingPage> {
    await this.page.click(
      `data-testid=attending-participant-row-${id} >> a:has-text("Grade")`
    )
    return new CourseGradingPage(this.page)
  }
}
