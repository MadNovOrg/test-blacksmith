import { expect, Locator, Page } from '@playwright/test'

import { CourseHeader } from '@qa/components/CourseHeader'
import { UiTable } from '@qa/components/UiTable'
import { toAttendeesTableRow } from '@qa/data/mappings'
import { User } from '@qa/data/types'
import { BasePage } from '@qa/pages/BasePage'

import { CourseGradingPage } from '../CourseGradingPage'
import { CourseTransferPage } from '../CourseTransferPage'

import { CancelEntireCoursePopUp } from './CancelEntireCoursePopup'
import { InviteAttendeesPopUp } from './InviteAttendeesPopup'
import { RemoveAttendeePopUp } from './RemoveAttendeePopup'
import { ReplaceAttendeePopUp } from './ReplaceAttendeePopup'
import { RequestCancellationPopup } from './RequestCancellationPopup'

export class CourseDetailsPage extends BasePage {
  readonly additionalNotes: Locator
  readonly approveCancellationButton: Locator
  readonly attendeeRemoveButton: Locator
  readonly attendeesTable: UiTable
  readonly attendingTab: Locator
  readonly attendingText: Locator
  readonly cancelCourseButton: Locator
  readonly cancellationRequestAlert: Locator
  readonly certificateGrade: Locator
  readonly certificationTab: Locator
  readonly courseGradingNav: Locator
  readonly courseName: Locator
  readonly declinedTab: Locator
  readonly editCourseButton: Locator
  readonly gradeAllAttendees: Locator
  readonly gradingTab: Locator
  readonly header: CourseHeader
  readonly inviteAttendeesButton: Locator
  readonly invitesLeftText: Locator
  readonly manageAttendanceButtonSelector: string
  readonly noteInput: Locator
  readonly pendingTab: Locator
  readonly requestCancellationButton: Locator
  readonly saveButton: Locator
  readonly searchTrainerInput: Locator
  readonly searchTrainerOption: Locator
  readonly successMessage: Locator
  readonly startDateLabel: Locator
  readonly endDateLabel: Locator
  readonly dateFormat: string

  constructor(page: Page) {
    super(page)
    this.header = new CourseHeader(this.page)
    this.successMessage = this.page.locator('data-testid=success-alert')
    this.inviteAttendeesButton = this.page.locator(
      'data-testid=course-invite-btn'
    )
    this.courseName = this.page.locator('[data-testid=course-name]')
    this.invitesLeftText = this.page.locator('data-testid=invites-left')
    this.attendingText = this.page.locator('data-testid=attending')
    this.attendingTab = this.page.locator('data-testid=tabParticipants')
    this.pendingTab = this.page.locator('data-testid=tabPending')
    this.declinedTab = this.page.locator('data-testid=tabDeclined')
    this.attendeesTable = new UiTable(
      this.page.locator('data-testid=attending-table')
    )
    this.editCourseButton = this.page.getByText('Edit course details')
    this.saveButton = this.page.locator('[data-testid="save-button"]')
    this.cancelCourseButton = this.page.locator(
      '[data-testid="cancel-course-button"]'
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
      '[data-testid="course-grading-details-nav"]'
    )
    this.requestCancellationButton = this.page.locator(
      '[data-testid="request-cancellation-button"]'
    )
    this.cancellationRequestAlert = this.page.locator(
      '[data-testid="cancellation-alert"]'
    )
    this.approveCancellationButton = this.page.locator(
      '[data-testid="approve-cancellation-button"]'
    )
    this.certificationTab = this.page.locator(
      '[data-testid=participant-course-certification]'
    )
    this.certificateGrade = this.page.locator('[data-testid=certificate-grade]')
    this.searchTrainerInput = this.page.locator(
      '[data-testid=SearchTrainers-input]'
    )
    this.searchTrainerOption = this.page.locator(
      '[data-testid=SearchTrainers-option]'
    )
    this.gradeAllAttendees = this.page.locator(
      '[data-testid=grade-all-attendees]'
    )
    this.noteInput = this.page.locator('[data-testid="notes-input"] >> input')
    this.startDateLabel = this.page.locator('[data-testid="startDate-label"]')
    this.endDateLabel = this.page.locator('[data-testid="endDate-label"]')
    this.dateFormat = 'd MMMM yyyy'
  }

  async goto(courseId: string) {
    await super.goto(`courses/${courseId}/details`)
    await expect(this.attendingText).toBeVisible()
  }

  async checkSuccessMessage(text: string) {
    if (await this.successMessage.isVisible()) {
      await expect(this.successMessage).toHaveText(text)
    }
  }

  async checkInvitesLeftText(text: string) {
    await expect(this.invitesLeftText).toHaveText(text)
  }

  async checkAttendingText(numberOfAttendees: number, maxParticipants: number) {
    await this.page.reload()
    await expect(this.attendingText).toHaveText(
      `${numberOfAttendees} of ${maxParticipants} attending`
    )
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
    const expectedRows = users.map(toAttendeesTableRow)
    const actualRows = await this.attendeesTable.getRows()
    expectedRows.forEach(expectedRow => {
      expect(actualRows).toContainEqual(expectedRow)
    })
  }

  async checkAttendeesTableNumberOfRows(users: User[]) {
    await expect(this.attendeesTable.rows).toHaveCount(users.length)
  }

  async clickEditCourseButton() {
    await this.editCourseButton.click()
  }

  async fillNotes(inputtedNote: string) {
    await this.noteInput.fill(inputtedNote)
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

  async clickCancelCourseButton(): Promise<CancelEntireCoursePopUp> {
    await this.cancelCourseButton.click()
    return new CancelEntireCoursePopUp(this.page)
  }

  async clickManageAttendance() {
    await this.page.locator(this.manageAttendanceButtonSelector).click()
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

  async clickAttendeeReplace(): Promise<ReplaceAttendeePopUp> {
    await this.page.locator('[data-testid=attendee-replace]').click()
    return new ReplaceAttendeePopUp(this.page)
  }

  async checkAttendeeExists(user: User) {
    await this.page.reload()
    await expect(
      this.page.locator(
        `[data-testid*="course-participant-row"]:has-text("${user.givenName} ${user.familyName}")`
      )
    ).toBeVisible()
  }

  async clickGradingTab() {
    await this.gradingTab.click()
  }

  async clickGradeAllAttendees(): Promise<CourseGradingPage> {
    await this.gradeAllAttendees.click()
    return new CourseGradingPage(this.page)
  }

  async checkCourseName() {
    await expect(this.courseName).toBeVisible()
  }

  async clickParticipantByGrade(id: string): Promise<CourseGradingPage> {
    await this.page.click(
      `data-testid=attending-participant-row-${id} >> a:has-text("Grade")`
    )
    return new CourseGradingPage(this.page)
  }

  async clickRequestCancellation(): Promise<RequestCancellationPopup> {
    await this.requestCancellationButton.click()
    return new RequestCancellationPopup(this.page)
  }

  async cancellationRequestIsVisible() {
    await this.cancellationRequestAlert.isVisible()
  }

  async approveCancellation(): Promise<CancelEntireCoursePopUp> {
    await this.approveCancellationButton.click()
    return new CancelEntireCoursePopUp(this.page)
  }

  async clickCertification() {
    await this.certificationTab.click()
  }

  async checkCertification(grade: 'Pass') {
    await expect(this.certificateGrade).toContainText(grade)
  }

  async addAdditionalTrainer() {
    await this.searchTrainerInput.fill('trainer')
    await this.searchTrainerOption.first().click()
  }
}
