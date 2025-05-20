import { expect, Locator, Page } from '@playwright/test'
import { format } from 'date-fns'

import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Renewal_Cycle_Enum,
  Course_Source_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { BildStrategies } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

import { isUK } from '@qa/constants'
import { Course, ResourcePacksOptions, User } from '@qa/data/types'
import { toUiTime } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

import { AssignTrainersPage } from './AssignTrainersPage.fixture'
import { CourseApprovalRequiredModal } from './CourseApprovalRequiredModal.fixture'
import { CourseOrderDetailsPage } from './CourseOrderDetailsPage.fixture'

export class CreateCoursePage extends BasePage {
  readonly creationSteps: Locator
  readonly certificateDurationRadioBtn: (duration: string) => Locator
  readonly categorySelector: Locator
  readonly categoryOption: (category: string) => Locator
  readonly levelDropDown: Locator
  readonly levelOption: (level: string) => Locator
  readonly go1Checkbox: Locator
  readonly reaccreditationCheckbox: Locator
  readonly conversionCheckbox: Locator
  readonly bildStrategyPrimaryCheckbox: Locator // Bild Strategy Primary Checkbox
  readonly bildStrategySecondaryCheckbox: Locator // Bild Strategy Secondary Checkbox
  readonly bildStrategyNonRTCheckbox: Locator // Bild Strategy Non-Restrictive Tertiary Checkbox
  readonly bildStrategyRTIntermediateCheckbox: Locator // Bild Strategy Restrictive Tertiary Intermediate Checkbox
  readonly bildStrategyPRTAdvancedCheckbox: Locator // Bild Strategy Restrictive Tertiary Advanced Checkbox
  readonly deliveryTypeRadioButton: (type: string) => Locator
  readonly venueInput: Locator
  readonly organisationInput: Locator
  readonly contactInput: Locator
  readonly autocompleteOption: Locator
  readonly startDateInput: Locator
  readonly startTimeInput: Locator
  readonly endDateInput: Locator
  readonly endTimeInput: Locator
  readonly timezoneInput: Locator
  readonly resourcePacksType: Locator
  readonly resourcePacksTypeOption: (
    resourcePackTypeOption: ResourcePacksOptions,
  ) => Locator
  readonly minAttendeesInput: Locator
  readonly maxAttendeesInput: Locator
  readonly mandatoryCourseMaterialsLabel: Locator
  readonly freeCourseMaterialsInput: Locator
  readonly acknowledgeCheckboxes: Locator
  readonly nextPageButton: Locator
  readonly exceptionsConfirmButton: Locator
  readonly freeSpacesInput: Locator
  readonly salesPersonInput: Locator
  readonly sourceDropdown: Locator
  readonly sourceOption: (source: Course_Source_Enum) => Locator
  readonly orderDetailsButton: Locator
  readonly specialInstructions: Locator
  readonly specialInstructionsDetails: Locator
  readonly parkingInstructions: Locator
  readonly parkingInstructionsDetails: Locator
  readonly bookingFirstName: Locator
  readonly bookingLastName: Locator
  readonly orgKeyContactFirstName: Locator
  readonly orgKeyContactLastName: Locator
  readonly saveChangesButton: Locator
  readonly renewalCycle: Locator
  readonly proceedButton: Locator
  readonly autocompleteLoading: Locator
  readonly priceInput: Locator

  constructor(page: Page) {
    super(page)
    this.creationSteps = this.page.locator('data-testid=create-course-nav')

    this.certificateDurationRadioBtn = (duration: string) =>
      this.page.locator(`input[name="renewalCycle"][value="${duration}"]`)

    this.categorySelector = this.page.locator('#course-category')
    this.levelDropDown = this.page.locator('#course-level')
    this.levelOption = (level: string) =>
      this.page.locator(`data-testid=course-level-option-${level}`)
    this.categoryOption = (category: string) =>
      this.page.locator(`data-testid=course-category-option-${category}`)

    this.go1Checkbox = this.page.locator('input[name="blendedLearning"]')
    this.reaccreditationCheckbox = this.page.locator(
      'input[name="reaccreditation"]',
    )
    this.conversionCheckbox = this.page.locator('input[name="conversion"]')
    this.bildStrategyPrimaryCheckbox = this.page.locator(
      `input[name="bildStrategies.${BildStrategies.Primary}"]`,
    )
    this.bildStrategySecondaryCheckbox = this.page.locator(
      `input[name="bildStrategies.${BildStrategies.Secondary}"]`,
    )
    this.bildStrategyNonRTCheckbox = this.page.locator(
      `input[name="bildStrategies.${BildStrategies.NonRestrictiveTertiary}"]`,
    )
    this.bildStrategyRTIntermediateCheckbox = this.page.locator(
      `input[name="bildStrategies.${BildStrategies.RestrictiveTertiaryIntermediate}"]`,
    )
    this.bildStrategyPRTAdvancedCheckbox = this.page.locator(
      `input[name="bildStrategies.${BildStrategies.RestrictiveTertiaryAdvanced}"]`,
    )

    this.deliveryTypeRadioButton = (type: string) =>
      this.page.locator(`input[name="delivery-type-radio"][value="${type}"]`)
    this.venueInput = this.page.locator('[data-testid="venue-selector"] input')
    this.organisationInput = this.page.locator(
      '[data-testid="org-selector"] input',
    )
    this.contactInput = this.page.locator('[data-testid="user-selector"] input')
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.startDateInput = this.page.locator(
      '[data-testid="Start date-datePicker-textField"] input',
    )
    this.startTimeInput = this.page.locator('[data-testid="start-time"] input')
    this.endDateInput = this.page.locator(
      '[data-testid="End date-datePicker-textField"] input',
    )
    this.endTimeInput = this.page.locator('[data-testid="end-time"] input')
    this.timezoneInput = this.page.locator(
      '[data-testid="timezone-selector-autocomplete"]',
    )
    this.resourcePacksType = this.page.locator(
      '[data-testid="course-resource-packs-type-select"]',
    )
    this.resourcePacksTypeOption = (
      resourcePackTypeOption: ResourcePacksOptions,
    ) =>
      this.page.locator(
        `[data-testid="course-resource-packs-type-select-${resourcePackTypeOption}"]`,
      )

    this.minAttendeesInput = this.page.locator(
      '[data-testid="min-attendees"] input',
    )
    this.maxAttendeesInput = this.page.locator(
      '[data-testid="max-attendees"] input',
    )
    this.mandatoryCourseMaterialsLabel = this.page.locator(
      '[data-testid="mandatory-course-materials"]',
    )
    this.freeCourseMaterialsInput = this.page.locator(
      '[data-testid="free-course-materials"] input',
    )
    this.acknowledgeCheckboxes = this.page.locator(
      '[data-testid="acknowledge-checks"] input',
    )
    this.nextPageButton = this.page.locator('data-testid=next-page-btn')
    this.orderDetailsButton = this.page.locator('[data-testid="next-page-btn"]')
    this.freeSpacesInput = this.page.locator(
      '[data-testid="free-spaces"] input',
    )
    this.salesPersonInput = this.page.locator(
      '[data-testid="profile-selector-sales-representative"] input',
    )
    this.sourceDropdown = this.page.locator('[data-testid="source-dropdown"]')
    this.sourceOption = (source: Course_Source_Enum) => {
      return this.page.locator(`[data-testid="source-option-${source}"]`)
    }
    this.specialInstructions = this.page.locator(
      'data-testid=course-form-special-instructions',
    )
    this.specialInstructionsDetails = this.page.locator(
      '[data-testid=course-form-special-instructions-details]',
    )
    this.parkingInstructions = this.page.locator(
      'data-testid=course-form-parking-instructions',
    )
    this.parkingInstructionsDetails = this.page.locator(
      '[data-testid=course-form-parking-instructions-details]',
    )
    this.bookingFirstName = this.page.locator(
      'input[name="bookingContact.firstName"]',
    )
    this.bookingLastName = this.page.locator(
      'input[name="bookingContact.lastName"]',
    )
    this.orgKeyContactFirstName = this.page.locator(
      'input[name="organizationKeyContact.firstName"]',
    )
    this.orgKeyContactLastName = this.page.locator(
      'input[name="organizationKeyContact.lastName"]',
    )
    this.priceInput = this.page.locator('[data-testid="price-input"]')
    this.renewalCycle = this.page.locator('[data-testid]="renewal-cycle"')
    this.saveChangesButton = this.page.locator('[data-testid="save-button"]')
    this.exceptionsConfirmButton = this.page.locator(
      '[data-testid="proceed-button"]',
    )
    this.proceedButton = this.page.locator('[data-testid="proceed-button"]')
  }

  async goto(courseType: string) {
    await super.goto(`courses/new?type=${courseType}`)
  }

  async selectCourseLevel(level: Course_Level_Enum) {
    await this.levelDropDown.click()
    await this.levelOption(level).click()
  }
  async selectCategory(category: string) {
    await this.categorySelector.click()
    await this.categoryOption(category).click()
  }

  async selectGo1() {
    await this.go1Checkbox.check()
  }

  async selectReaccreditation() {
    await this.reaccreditationCheckbox.check()
  }

  async selectConverison() {
    await this.conversionCheckbox.check()
  }

  async selectBildStrategies() {
    await this.bildStrategyPrimaryCheckbox.check()
    await this.bildStrategySecondaryCheckbox.check()
    await this.bildStrategyNonRTCheckbox.check()
    await this.bildStrategyRTIntermediateCheckbox.check()
    await this.bildStrategyPRTAdvancedCheckbox.check()
  }

  async selectDeliveryType(type: Course_Delivery_Type_Enum) {
    await this.deliveryTypeRadioButton(type).check()
  }

  async selectCertificateDuration(duration: Course_Renewal_Cycle_Enum) {
    await this.certificateDurationRadioBtn(duration).check()
  }

  async selectVenue(venue: string) {
    await this.venueInput.fill(venue)
    await this.page.waitForResponse(
      resp => resp.url().includes('/v1/graphql') && resp.status() === 200,
    )
    await this.autocompleteOption.locator(`text=${venue}`).first().click()
  }

  async selectOrganisation(name: string) {
    await this.organisationInput.fill(name)
    await this.organisationInput.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async selectContact(user: User, existsContact = false) {
    await this.contactInput.fill(user.email)

    if (!existsContact) {
      await this.bookingFirstName.fill(user.givenName)
      await this.bookingLastName.fill(user.familyName)
    }
  }

  async selectOrgKeyContact(user: User, existsContact = false) {
    await this.contactInput.fill(user.email)

    if (!existsContact) {
      await this.orgKeyContactFirstName.fill(user.givenName)
      await this.orgKeyContactLastName.fill(user.familyName)
    }
  }

  async selectResourcePacksType(option: ResourcePacksOptions) {
    await this.resourcePacksType.click()
    await this.resourcePacksTypeOption(option).click()
  }

  async selectSalesPerson(name: string) {
    await this.salesPersonInput.fill(name)
    await this.page.waitForResponse(
      resp => resp.url().includes('/v1/graphql') && resp.status() === 200,
    )
    await this.salesPersonInput.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

  async selectSource(source: Course_Source_Enum) {
    await this.sourceDropdown.click()
    await this.sourceOption(source).click()
  }

  async setStartDateTime(dateTime: Date) {
    await this.startDateInput.clear()
    await this.startDateInput.fill(format(dateTime, INPUT_DATE_FORMAT))
    const time = toUiTime(dateTime)
    time !== '08:00' && (await this.startTimeInput.fill(time))
  }

  async setEndDateTime(dateTime: Date) {
    await this.endDateInput.clear()
    await this.endDateInput.fill(format(dateTime, INPUT_DATE_FORMAT))
    const time = toUiTime(dateTime)
    time !== '17:00' && (await this.endTimeInput.fill(time))
  }

  async selectTimezone() {
    await this.timezoneInput.click()
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

  async setMinAttendees(value: number) {
    await this.minAttendeesInput.fill(value.toString())
  }

  async setMaxAttendees(value: number) {
    await this.maxAttendeesInput.fill(value.toString())
  }

  async setFreeCourseMaterials(value: number) {
    await this.freeCourseMaterialsInput.fill(value.toString())
  }
  async setPricePerAttendee() {
    await this.priceInput.click()
    await this.priceInput.type('500')
  }

  async clickSaveChangesButton() {
    await this.saveChangesButton.click()
  }

  async clickAssignTrainersButton(): Promise<AssignTrainersPage> {
    await expect(this.nextPageButton).toBeEnabled()
    await this.nextPageButton.click()
    return new AssignTrainersPage(this.page)
  }

  async clickOrderDetailsButton() {
    await this.nextPageButton.click()
    const approvalExceptionModal = new CourseApprovalRequiredModal(this.page)
    await approvalExceptionModal.confirmCourseException()
    return new CourseOrderDetailsPage(this.page)
  }

  async clickCreateCourseButton(): Promise<{
    id: number
    courseCode: string
  }> {
    await this.nextPageButton.click()
    await this.proceedOnExceptions()

    await this.page.waitForURL(/.*\/courses\/new\/modules/)

    return {
      id: 0,
      courseCode: 'code',
    }
  }

  async proceedOnExceptions() {
    if (await this.proceedButton.isVisible()) {
      await this.proceedButton.click()
    }
  }

  async checkAcknowledgeCheckboxes() {
    const count = await this.acknowledgeCheckboxes.count()
    for (let i = 0; i < count; i++) {
      await this.acknowledgeCheckboxes.nth(i).check()
    }
  }

  async setSpecialInstructions(
    instructions = 'Some special instructions for the course',
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

  async fillCourseDetails(course: Course, ignoreOrganisationSelect = false) {
    if (isUK() && course.type !== Course_Type_Enum.Indirect) {
      await this.selectCategory(course.accreditedBy)
    }
    if (
      course.type !== Course_Type_Enum.Open &&
      course.organization &&
      !ignoreOrganisationSelect
    ) {
      await this.selectOrganisation(course.organization.name)
    }
    if (
      course.type === Course_Type_Enum.Closed &&
      course.bookingContactProfile
    ) {
      await this.selectContact(course.bookingContactProfile, true)
    }

    if (
      course.type === Course_Type_Enum.Indirect &&
      course.organizationKeyContactProfile
    ) {
      await this.selectOrgKeyContact(course.organizationKeyContactProfile, true)
    }

    await this.selectCourseLevel(course.level)
    if (
      course.type === Course_Type_Enum.Closed &&
      course.accreditedBy === Accreditors_Enum.Bild &&
      course.level === Course_Level_Enum.BildRegular
    ) {
      await this.selectBildStrategies()
    }

    if (course.accreditedBy === Accreditors_Enum.Bild && course.conversion) {
      await this.selectConverison()
    }
    await this.selectDeliveryType(course.deliveryType)

    if (course.go1Integration) await this.selectGo1()
    if (course.reaccreditation) await this.selectReaccreditation()
    if (course.deliveryType !== Course_Delivery_Type_Enum.Virtual) {
      await this.selectVenue(course.schedule[0].venue?.name as string)
    }
    // TODO workaround - remove this if after fixing /TTHP-1216
    if (
      course.deliveryType === Course_Delivery_Type_Enum.Virtual ||
      course.deliveryType === Course_Delivery_Type_Enum.Mixed
    )
      await this.setSpecialInstructions()
    if (course.deliveryType != Course_Delivery_Type_Enum.Virtual) {
      await this.setParkingInstructions()
    }
    await this.setStartDateTime(course.schedule[0].start)
    await this.setEndDateTime(course.schedule[0].end)
    if (course.type === Course_Type_Enum.Open) {
      await this.setMinAttendees(course.min_participants)
    }

    if (!isUK() && course.deliveryType === Course_Delivery_Type_Enum.Virtual) {
      await this.selectTimezone()
    }

    if (!isUK() && course.type === Course_Type_Enum.Indirect) {
      await this.selectResourcePacksType(ResourcePacksOptions.DigitalWorkbook)
    }

    await this.setMaxAttendees(course.max_participants)
    if (course.type === Course_Type_Enum.Closed && course.freeCourseMaterials) {
      await this.setFreeCourseMaterials(course.freeCourseMaterials)
    }
    if (course.type === Course_Type_Enum.Indirect) {
      await this.checkAcknowledgeCheckboxes()
    }

    if (
      isUK() &&
      ((course.level === Course_Level_Enum.FoundationTrainerPlus &&
        course.type === Course_Type_Enum.Indirect) ||
        (course.type === Course_Type_Enum.Closed &&
          course.level === Course_Level_Enum.Level_1Bs))
    ) {
      await this.setPricePerAttendee()
    }

    if (
      [Course_Type_Enum.Open, Course_Type_Enum.Closed].includes(course.type) &&
      [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2].includes(
        course.level,
      )
    ) {
      await this.selectCertificateDuration(Course_Renewal_Cycle_Enum.One)
    }

    if (
      course.freeSpaces &&
      course.salesRepresentative &&
      course.type === Course_Type_Enum.Closed &&
      course.source
    ) {
      await this.freeSpacesInput.fill(course.freeSpaces.toString())
      await this.selectSalesPerson(
        `${course.salesRepresentative.givenName} ${course.salesRepresentative.familyName}`,
      )
      await this.selectSource(course.source)
    }
    if (course.accreditedBy === Accreditors_Enum.Bild) {
      await this.setPricePerAttendee()
    }
  }
}
