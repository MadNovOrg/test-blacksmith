import { expect, Locator, Page } from '@playwright/test'

import * as API from '../../../api'
import { CourseHeader } from '../../../components/CourseHeader'
import { UiTable } from '../../../components/UiTable'
import { toAttendeesTableRow } from '../../../data/mappings'
import { User } from '../../../data/types'
import { BasePage } from '../../BasePage'
import { CourseGradingPage } from '../CourseGradingPage'
import { CourseTransferPage } from '../CourseTransferPage'

import { CancelEntireCoursePopUp } from './CancelEntireCoursePopup'
import { InviteAttendeesPopUp } from './InviteAttendeesPopup'
import { RemoveAttendeePopUp } from './RemoveAttendeePopup'
import { ReplaceAttendeePopUp } from './ReplaceAttendeePopup'
import { RequestCancellationPopup } from './RequestCancellationPopup'

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
  readonly invitesLeftText: Locator
  readonly manageAttendanceButtonSelector: string
  readonly pendingTab: Locator
  readonly saveButton: Locator
  readonly successMessage: Locator
  readonly requestCancellationButton: Locator
  readonly cancellationRequestAlert: Locator
  readonly approveCancellationButton: Locator
  readonly certificationTab: Locator
  readonly certificateGrade: Locator
  readonly searchTrainerInput: Locator
  readonly searchTrainerOption: Locator

  constructor(page: Page) {
    super(page)
    this.header = new CourseHeader(this.page)
    this.successMessage = this.page.locator('data-testid=success-alert')
    this.inviteAttendeesButton = this.page.locator(
      'data-testid=course-invite-btn'
    )
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
  }

  async goto(courseId: string) {
    await super.goto(`courses/${courseId}/details`)
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
    await this.page.reload()
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

  async clickAttendeeReplace(): Promise<ReplaceAttendeePopUp> {
    await this.page.locator('[data-testid=attendee-replace]').click()
    return new ReplaceAttendeePopUp(this.page)
  }

  async checkAttendeeExists(user: User) {
    const attendee = await this.page.locator('tr', {
      has: this.page.locator(
        `a[href="/profile/${await API.profile.getProfileId(user.email)}"]`
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
