import { Locator, Page } from '@playwright/test'
import { format } from 'date-fns'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

import { BASE_URL } from '../../constants'
import { Course } from '../../data/types'
import { toUiTime } from '../../util'
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
  readonly acknowledgeCheckboxes: Locator
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
    this.acknowledgeCheckboxes = this.page.locator(
      '[data-testid="acknowledge-checks"] input'
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
    await this.startTimeInput.fill(toUiTime(dateTime))
    await this.startDateInput.fill(format(dateTime, INPUT_DATE_FORMAT))
  }

  async setEndDateTime(dateTime: Date) {
    await this.endTimeInput.fill(toUiTime(dateTime))
    await this.endDateInput.fill(format(dateTime, INPUT_DATE_FORMAT))
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
    await this.setStartDateTime(course.schedule[0].start)
    await this.setEndDateTime(course.schedule[0].end)
    if (course.type === CourseType.OPEN) {
      await this.setMinAttendees(course.min_participants)
    }
    await this.setMaxAttendees(course.max_participants)
    if (course.type === CourseType.INDIRECT) {
      await this.checkAcknowledgeCheckboxes()
    }
  }
}
