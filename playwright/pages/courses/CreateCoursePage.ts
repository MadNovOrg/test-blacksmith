import { Locator, Page } from '@playwright/test'

import { CourseDeliveryType, CourseLevel } from '../../../src/types'
import { BASE_URL } from '../../constants'
import { Course } from '../../data/types'
import { BasePage } from '../BasePage'

import { AssignTrainersPage } from './AssignTrainersPage'

export class CreateCoursePage extends BasePage {
  readonly creationSteps: Locator
  readonly levelDropDown: Locator
  readonly levelOption: (level: string) => Locator
  readonly go1Checkbox: Locator
  readonly reaccreditationCheckbox: Locator
  readonly deliveryTypeRadioButton: (type: string) => Locator
  readonly venueInput: Locator
  readonly organisationInput: Locator
  readonly contactInput: Locator
  readonly autocompleteOption: Locator
  readonly startDateInput: Locator
  readonly startTimeInput: Locator
  readonly endDateInput: Locator
  readonly endTimeInput: Locator
  readonly minAttendeesInput: Locator
  readonly maxAttendeesInput: Locator
  readonly nextPageButton: Locator

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
    this.startDateInput = this.page.locator('[data-testid="start-date"] input')
    this.startTimeInput = this.page.locator('[data-testid="start-time"] input')
    this.endDateInput = this.page.locator('[data-testid="end-date"] input')
    this.endTimeInput = this.page.locator('[data-testid="end-time"] input')
    this.minAttendeesInput = this.page.locator(
      '[data-testid="min-attendees"] input'
    )
    this.maxAttendeesInput = this.page.locator(
      '[data-testid="max-attendees"] input'
    )
    this.nextPageButton = this.page.locator('data-testid=next-page-btn')
  }

  async goto(courseType: string) {
    await super.goto(
      `${BASE_URL}/courses/new?type=${courseType}`,
      this.creationSteps
    )
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
    await this.autocompleteOption.first().click()
  }

  async selectOrganisation(name: string) {
    await this.organisationInput.type(name)
    await this.autocompleteOption.first().click()
  }

  async selectContact(name: string) {
    await this.contactInput.type(name)
    await this.autocompleteOption.first().click()
  }

  async setStartDateTime(dateTime: Date) {
    await this.startDateInput.type(dateTime.toISOString().substring(0, 10))
    await this.startTimeInput.type(
      `${dateTime.getHours()}:${dateTime.getMinutes()}`
    )
  }

  async setEndDateTime(dateTime: Date) {
    await this.endDateInput.type(dateTime.toISOString().substring(0, 10))
    await this.endTimeInput.type(
      `${dateTime.getHours()}:${dateTime.getMinutes()}`
    )
  }

  async setMinAttendees(value: number) {
    await this.minAttendeesInput.type(value.toString())
  }

  async setMaxAttendees(value: number) {
    await this.maxAttendeesInput.type(value.toString())
  }

  async clickAssignTrainersButton(): Promise<AssignTrainersPage> {
    await this.nextPageButton.click()
    return new AssignTrainersPage(this.page)
  }

  async fillOpenCourseDetails(course: Course) {
    await this.selectCourseLevel(course.level)
    if (course.go1Integration) await this.selectGo1()
    if (course.reaccreditation) await this.selectReaccreditation()
    await this.selectDeliveryType(course.deliveryType)
    if (course.deliveryType !== CourseDeliveryType.VIRTUAL) {
      await this.selectVenue(course.schedule[0].venue)
    }
    await this.setStartDateTime(course.schedule[0].start)
    await this.setEndDateTime(course.schedule[0].end)
    await this.setMinAttendees(course.min_participants)
    await this.setMaxAttendees(course.max_participants)
  }
}
