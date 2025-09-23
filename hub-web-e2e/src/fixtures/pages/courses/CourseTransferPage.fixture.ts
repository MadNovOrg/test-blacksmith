import { expect, Locator, Page } from '@playwright/test'

import { RegistrantAddress, TransferEligibleCourses } from '@qa/data/types'
import { getTransferEligibleCourses } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

export class CourseTransferPage extends BasePage {
  readonly transferDetails: Locator
  readonly transferReason: Locator
  readonly reviewAndConfirm: Locator
  readonly confirmTransfer: Locator
  readonly postalAddressLine1: Locator
  readonly postalAddressLine2: Locator
  readonly postalAddressCity: Locator
  readonly postalAddressPostcode: Locator
  readonly postalAddressCountry: Locator
  readonly autocompleteLoading: Locator
  readonly autocompleteOption: Locator
  readonly applyTermsAsTransferFee: Locator
  constructor(page: Page) {
    super(page)
    this.transferDetails = this.page.locator('[data-testId=transfer-details]')
    this.transferReason = this.page.locator(
      '[data-testid="reasonForTransfer"] input',
    )
    this.reviewAndConfirm = this.page.locator(
      '[data-testid="review-and-confirm"]',
    )
    this.confirmTransfer = this.page.locator('[data-testid="confirm-transfer"]')
    this.postalAddressLine1 = this.page.getByTestId('addr-line1')
    this.postalAddressLine2 = this.page.getByTestId('addr-line2')
    this.postalAddressCity = this.page.getByTestId('city')
    this.postalAddressPostcode = this.page.getByTestId('postCode')
    this.postalAddressCountry = this.page.locator(
      '[data-testid="countries-selector-autocomplete"] input',
    )
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.applyTermsAsTransferFee = this.page.locator(
      '[data-testid="applyTerms-radio-button"]',
    )
  }

  async selectCourseId(
    courseId: number,
    transferEligibleCourse: TransferEligibleCourses,
  ) {
    const searchStrings = ['TransferEligibleCourses', 'eligibleTransferCourses']
    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (
        searchStrings.every(str =>
          JSON.stringify(request.postDataJSON()).includes(str),
        )
      ) {
        await route.fulfill({
          json: getTransferEligibleCourses(transferEligibleCourse),
        })
      } else {
        await route.continue()
      }
    })
    await this.page.locator(`[data-testid=change-course-${courseId}]`).click()
  }

  async clickTransferDetails() {
    await this.transferDetails.click()
  }

  async fillPostalAddressDetails(address: RegistrantAddress) {
    await this.postalAddressLine1.fill(address.addresLine1)
    await this.postalAddressLine2.fill(address.addresLine2)
    await this.postalAddressCity.fill(address.city)
    await this.postalAddressPostcode.fill(address.postcode)
    await this.postalAddressCountry.fill(address.country)
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.autocompleteOption
      .locator(`text=${address.country}`)
      .first()
      .click()
  }

  async setTransferReason(reason: string) {
    await this.transferReason.waitFor({ state: 'visible' })
    await this.transferReason.fill(reason)
  }

  async clickReviewAndConfirm() {
    await this.reviewAndConfirm.click()
  }

  async applyFeeGroup(value: 'APPLY_TERMS' | 'CUSTOM_FEE' | 'FREE') {
    await this.page.locator(`input[value=${value}]`).check()
  }

  async clickApplyTermsAsTransferFee() {
    await this.applyTermsAsTransferFee.click()
  }

  async clickConfirmTransfer(toCourseId: number, reason: string) {
    await Promise.all([
      this.confirmTransfer.click(),
      this.page.route(`**/v1/graphql`, async route => {
        const request = route.request()
        const postData = request.postDataJSON()
        expect(postData.operationName).toBe('TransferParticipant')
        expect(postData.variables.input.toCourseId).toBe(toCourseId)
        expect(postData.variables.input.reason).toBe(reason)
        route.fulfill({ status: 200, body: JSON.stringify({}) })
      }),
    ])
  }
}
