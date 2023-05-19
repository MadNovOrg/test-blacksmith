import { Locator, Page } from '@playwright/test'
import { format } from 'date-fns'

import { Course_Source_Enum } from '@app/generated/graphql'
import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

import { Course } from '@qa/data/types'
import { toUiTime } from '@qa/util'

import { BasePage } from '../BasePage'

import { AssignTrainersPage } from './AssignTrainersPage'
import { CourseApprovalRequiredModal } from './CourseApprovalRequiredModal'
import { CourseOrderDetailsPage } from './CourseOrderDetailsPage'

export class CreateCoursePage extends BasePage {
  readonly creationSteps: Locator
  readonly levelDropDown: Locator
  readonly levelOption: (level: string) => Locator
  readonly go1Checkbox: Locator
  readonly reaccreditationCheckbox: Locator
  readonly deliveryTypeRadioButton: (type: string) => Locator
  readonly venueInput: Locator
  readonly onlineMeetingLinkInput: Locator
  readonly organisationInput: Locator
  readonly contactInput: Locator
  readonly autocompleteOption: Locator
  readonly startDateInput: Locator
  readonly startTimeInput: Locator
  readonly endDateInput: Locator
  readonly endTimeInput: Locator
  readonly minAttendeesInput: Locator
  readonly maxAttendeesInput: Locator
  readonly acknowledgeCheckboxes: Locator
  readonly nextPageButton: Locator
  readonly freeSpacesInput: Locator
  readonly salesPersonInput: Locator
  readonly sourceDropdown: Locator
  readonly sourceOption: (source: Course_Source_Enum) => Locator
  readonly orderDetailsButton: Locator
  readonly specialInstructions: Locator
  readonly specialInstructionsDetails: Locator
  readonly parkingInstructions: Locator
  readonly parkingInstructionsDetails: Locator

  constructor(page: Page) {
    super(page)
    this.creationSteps = this.page.locator('data-testid=create-course-nav')
    this.levelDropDown = this.page.locator('#course-level')
    this.levelOption = (level: string) =>
      this.page.locator(`data-testid=course-level-option-${level}`)
    this.go1Checkbox = this.page.locator('input[name="blendedLearning"]')
    this.reaccreditationCheckbox = this.page.locator(
      'input[name="reaccreditation"]'
    )
    this.deliveryTypeRadioButton = (type: string) =>
      this.page.locator(
        `input[name="row-radio-buttons-group"][value="${type}"]`
      )
    this.venueInput = this.page.locator('[data-testid="venue-selector"] input')
    this.organisationInput = this.page.locator(
      '[data-testid="org-selector"] input'
    )
    this.contactInput = this.page.locator(
      '[data-testid="profile-selector"] input'
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option'
    )
    this.startDateInput = this.page.locator(
      '[data-testid="Start date-datePicker-textField"] input'
    )
    this.startTimeInput = this.page.locator('[data-testid="start-time"] input')
    this.endDateInput = this.page.locator(
      '[data-testid="End date-datePicker-textField"] input'
    )
    this.endTimeInput = this.page.locator('[data-testid="end-time"] input')
    this.minAttendeesInput = this.page.locator(
      '[data-testid="min-attendees"] input'
    )
    this.maxAttendeesInput = this.page.locator(
      '[data-testid="max-attendees"] input'
    )
    this.acknowledgeCheckboxes = this.page.locator(
      '[data-testid="acknowledge-checks"] input'
    )
    this.nextPageButton = this.page.locator('data-testid=next-page-btn')
    this.orderDetailsButton = this.page.locator('[data-testid="next-page-btn"]')
    this.onlineMeetingLinkInput = this.page.locator(
      '[data-testid="onlineMeetingLink-input"] input'
    )
    this.freeSpacesInput = this.page.locator(
      '[data-testid="free-spaces"] input'
    )
    this.salesPersonInput = this.page.locator(
      '[data-testid="profile-selector-sales-representative"] input'
    )
    this.sourceDropdown = this.page.locator('[data-testid="source-dropdown"]')
    this.sourceOption = (source: Course_Source_Enum) => {
      return this.page.locator(`[data-testid="source-option-${source}"]`)
    }
    this.specialInstructions = this.page.locator(
      'data-testid=course-form-special-instructions'
    )
    this.specialInstructionsDetails = this.page.locator(
      '[data-testid=course-form-special-instructions-details]'
    )
    this.parkingInstructions = this.page.locator(
      'data-testid=course-form-parking-instructions'
    )
    this.parkingInstructionsDetails = this.page.locator(
      '[data-testid=course-form-parking-instructions-details]'
    )
  }

  async goto(courseType: string) {
    await super.goto(`courses/new?type=${courseType}`)
  }

  async selectCourseLevel(level: CourseLevel) {
    await this.levelDropDown.click()
    await this.levelOption(level).click()
  }

  async selectGo1() {
    await this.go1Checkbox.check()
  }

  async selectReaccreditation() {
    await this.reaccreditationCheckbox.check()
  }

  async selectDeliveryType(type: CourseDeliveryType) {
    await this.deliveryTypeRadioButton(type).check()
  }

  async selectVenue(venue: string) {
    await this.venueInput.type(venue)
    await this.autocompleteOption.locator(`text=${venue}`).first().click()
  }

  async selectOrganisation(name: string) {
    await this.organisationInput.type(name)
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async selectContact(name: string) {
    await this.contactInput.type(name)
    await this.autocompleteOption.first().click()
  }

  async selectSalesPerson(name: string) {
    await this.salesPersonInput.type(name)
    await this.autocompleteOption.first().click()
  }

  async selectSource(source: Course_Source_Enum) {
    await this.sourceDropdown.click()
    await this.sourceOption(source).click()
  }

  async setStartDateTime(dateTime: Date) {
    await this.startDateInput.click()
    await this.startDateInput.type(format(dateTime, INPUT_DATE_FORMAT))
    const time = toUiTime(dateTime)
    time !== '08:00' && (await this.startTimeInput.fill(time))
  }

  async setEndDateTime(dateTime: Date) {
    await this.endDateInput.click()
    await this.endDateInput.type(format(dateTime, INPUT_DATE_FORMAT))
    const time = toUiTime(dateTime)
    time !== '17:00' && (await this.endTimeInput.fill(time))
  }

  async setMinAttendees(value: number) {
    await this.minAttendeesInput.fill(value.toString())
  }

  async setMaxAttendees(value: number) {
    await this.maxAttendeesInput.fill(value.toString())
  }

  async clickAssignTrainersButton(): Promise<AssignTrainersPage> {
    await this.nextPageButton.click()
    return new AssignTrainersPage(this.page)
  }

  async clickOrderDetailsButton() {
    await this.nextPageButton.click()
    const approvalExceptionModal = new CourseApprovalRequiredModal(this.page)
    await approvalExceptionModal.confirmCourseException()
    return new CourseOrderDetailsPage(this.page)
  }

  async clickCreateCourseButton(): Promise<number> {
    const responses = await Promise.all([
      this.page.waitForResponse(
        res =>
          res.request().url().includes('/graphql') &&
          (res.request().postData() as string).includes('insert_course')
      ),
      this.nextPageButton.click(),
    ])
    const data = await responses[0].json()
    return data.data.insertCourse.inserted[0].id
  }

  async checkAcknowledgeCheckboxes() {
    const count = await this.acknowledgeCheckboxes.count()
    for (let i = 0; i < count; i++) {
      await this.acknowledgeCheckboxes.nth(i).check()
    }
  }

  async setSpecialInstructions(
    instructions = 'Some special instructions for the course'
  ) {
    await this.specialInstructions.click()
    await this.specialInstructionsDetails.locator('button').click()
    await this.specialInstructionsDetails
      .locator('[role=textbox]')
      .fill(instructions)
    await this.specialInstructionsDetails
      .locator('button:text("Save changes")')
      .click()
  }

  async setParkingInstructions(instructions = 'Come to the main car park!') {
    await this.parkingInstructions.click()
    await this.parkingInstructionsDetails.locator('button').click()
    await this.parkingInstructionsDetails
      .locator('[role=textbox]')
      .fill(instructions)
    await this.parkingInstructionsDetails
      .locator('button:text("Save changes")')
      .click()
  }

  async fillCourseDetails(course: Course) {
    if (course.type !== CourseType.OPEN && course.organization) {
      await this.selectOrganisation(course.organization.name)
    }
    if (course.type === CourseType.CLOSED && course.contactProfile) {
      const name = `${course.contactProfile.givenName} ${course.contactProfile.familyName}`
      await this.selectContact(name)
    }
    await this.selectCourseLevel(course.level)
    if (course.go1Integration) await this.selectGo1()
    if (course.reaccreditation) await this.selectReaccreditation()
    await this.selectDeliveryType(course.deliveryType)
    if (course.deliveryType !== CourseDeliveryType.VIRTUAL) {
      await this.selectVenue(course.schedule[0].venue?.name as string)
    }
    // TODO workaround - remove this if after fixing /TTHP-1216
    if (
      (course.deliveryType === CourseDeliveryType.VIRTUAL ||
        course.deliveryType === CourseDeliveryType.MIXED) &&
      (await this.onlineMeetingLinkInput.inputValue()) === ''
    ) {
      await this.onlineMeetingLinkInput.type('www.zoom.com/blabla')
    }
    await this.setSpecialInstructions()
    if (course.deliveryType != CourseDeliveryType.VIRTUAL) {
      await this.setParkingInstructions()
    }
    await this.setStartDateTime(course.schedule[0].start)
    await this.setEndDateTime(course.schedule[0].end)
    if (course.type === CourseType.OPEN) {
      await this.setMinAttendees(course.min_participants)
    }

    await this.setMaxAttendees(course.max_participants)
    if (course.type === CourseType.INDIRECT) {
      await this.checkAcknowledgeCheckboxes()
    }

    if (
      course.freeSpaces &&
      course.salesRepresentative &&
      course.type === CourseType.CLOSED &&
      course.source
    ) {
      await this.freeSpacesInput.type(course.freeSpaces.toString())
      await this.selectSalesPerson(
        `${course.salesRepresentative.givenName} ${course.salesRepresentative.familyName}`
      )
      await this.selectSource(course.source)
    }
  }
}
