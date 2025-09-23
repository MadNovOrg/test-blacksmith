import { expect, Locator, Page } from '@playwright/test'

import {
  InvoiceDetails,
  VirtualCourseBookingDetails,
  VirtualCourseRegistrant,
} from '@qa/data/types'

import { BasePage } from '../BasePage.fixture'

import { BookingReviewPage } from './BookingReview.fixture'
export class BookingDetailsPage extends BasePage {
  readonly quantityInput: Locator
  readonly orgSelector: Locator
  readonly sourceDropdown: Locator
  readonly bookingContactEmailInput: Locator
  readonly registrantEmailInput: Locator
  readonly postalAddressLine1: Locator
  readonly postalAddressLine2: Locator
  readonly postalAddressCity: Locator
  readonly postalAddressPostcode: Locator
  readonly postalAddressCountry: Locator
  readonly invoiceOrganisationSelector: Locator
  readonly invoiceContactEmailInput: Locator
  readonly invoiceContactFirstNameInput: Locator
  readonly invoiceContactSurnameInput: Locator
  readonly invoiceContactPhoneInput: Locator
  readonly purchaseOrderInput: Locator
  readonly reviewAndConfirmButton: Locator
  readonly openPromoCodeFormButton: Locator
  readonly promoCodeInput: Locator
  readonly applyPromoCodeButton: Locator
  readonly promoCodeDiscountAmount: Locator
  readonly amountDue: Locator
  readonly autocompleteLoading: Locator
  readonly autocompleteOption: Locator

  constructor(page: Page) {
    super(page)
    this.quantityInput = this.page.getByTestId('qty-select')
    this.openPromoCodeFormButton = this.page.getByRole('button', {
      name: /apply promo or voucher code/i,
    })
    this.promoCodeInput = this.page.getByLabel('Enter promo code')
    this.applyPromoCodeButton = this.page.getByRole('button', {
      name: 'Apply',
      exact: true,
    })
    this.promoCodeDiscountAmount = this.page.getByTestId('promo-code-discount')
    this.amountDue = this.page.getByTestId('amount-due')
    this.orgSelector = this.page
      .locator('[data-testid="org-selector"] input')
      .nth(0)
    this.sourceDropdown = this.page.locator('[data-testid="source-dropdown"]')
    this.bookingContactEmailInput = this.page
      .locator('[data-testid="user-selector"] input')
      .nth(0)
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.registrantEmailInput = this.page.locator(
      '[data-testid="registrants-box"] [data-testid="user-selector"] input',
    )
    this.postalAddressLine1 = this.page.getByTestId('addr-line1')
    // this.postalAddressLine1 = this.page.locator(
    //   '[data-testid="registrants-box"] [data-testid="addr-line1"] input',
    // )
    this.postalAddressLine2 = this.page.getByTestId('addr-line2')
    // this.postalAddressLine2 = this.page.locator(
    //   '[data-testid="registrants-box"] [data-testid="addr-line2"] input',
    // )
    this.postalAddressCity = this.page.getByTestId('city')
    // this.postalAddressCity = this.page.locator(
    //   '[data-testid="registrants-box"] [data-testid="city"] input',
    // )
    this.postalAddressPostcode = this.page.getByTestId('postCode')
    // this.postalAddressPostcode = this.page.locator(
    //   '[data-testid="registrants-box"] [data-testid="postcode"] input',
    // )
    this.postalAddressCountry = this.page.locator(
      '[data-testid="registrants-box"] [data-testid="countries-selector-autocomplete"] input',
    )
    // this.postalAddressCountry = this.page.getByTestId(
    //   'countries-selector-autocomplete',
    // )
    this.invoiceOrganisationSelector = this.page
      .locator('[data-testid="org-selector"] input')
      .nth(1)
    this.invoiceContactFirstNameInput = this.page.locator(
      '[data-testid="input-first-name"]',
    )
    this.invoiceContactSurnameInput = this.page.locator(
      '[data-testid="input-surname"]',
    )
    this.invoiceContactEmailInput = this.page.locator(
      '[data-testid="input-email"]',
    )
    this.invoiceContactPhoneInput = this.page.locator(
      '[data-testid="input-phone"]',
    )
    this.purchaseOrderInput = this.page.locator('[data-testid="input-po"]')
    this.reviewAndConfirmButton = this.page.locator(
      '[data-testid="review-and-confirm"]',
    )
  }

  async goto(id?: string) {
    await this.page.route(/.*\/v1\/graphql/, async route => {
      const request = route.request()

      if (JSON.stringify(request.postDataJSON()).includes('GetCoursePricing')) {
        await route.fulfill({
          json: {
            data: {
              pricing: {
                priceAmount: 200,
                priceCurrency: 'GBP',
                xeroCode: 'LEVEL1.OP',
                __typename: 'GetCoursePricingOutput',
              },
            },
          },
        })
      } else if (
        JSON.stringify(request.postDataJSON()).includes('CanApplyPromoCode')
      ) {
        await route.fulfill({
          json: {
            data: {
              canApplyPromoCode: {
                result: {
                  code: '5_PERCENT_OFF',
                  amount: 5,
                  type: 'PERCENT',
                  __typename: 'PromoCodeOutput',
                },
                __typename: 'CanApplyPromoCodeOutput',
              },
            },
          },
        })
      } else {
        route.continue()
      }
    })
    await super.goto(`registration${id ? `?course_id=${id}&quantity=1` : ''}`)
  }
  async setQuantity(quantity: number) {
    await this.quantityInput.selectOption({ value: quantity.toString() })
  }
  async selectOrganisation(name: string) {
    await this.orgSelector.fill(name)
    await this.orgSelector.click()
    await this.page.waitForResponse(
      resp => resp.url().includes('/v1/graphql') && resp.status() === 200,
    )
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async selectInvoiceOrganisation(name: string) {
    await this.invoiceOrganisationSelector.fill(name)
    await this.invoiceOrganisationSelector.click()
    // await this.page.waitForResponse(
    //   resp => resp.url().includes('/v1/graphql') && resp.status() === 200,
    // )
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async selectSource() {
    await this.sourceDropdown.click()
    await this.sourceDropdown.press('ArrowDown')
    await this.sourceDropdown.press('Enter')
  }

  async fillBookingContactEmail(email: string) {
    await this.bookingContactEmailInput.fill(email)
    await this.page.waitForResponse(
      resp => resp.url().includes('/v1/graphql') && resp.status() === 200,
    )
    await this.bookingContactEmailInput.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.autocompleteOption.locator(`text=${email}`).first().click()
  }

  async fillRegistrants(registrants: VirtualCourseRegistrant[]) {
    for (const [index, registrant] of registrants.entries()) {
      const registrantUserSelector = this.registrantEmailInput.nth(index)
      const registrantAddressLine1 = this.postalAddressLine1.nth(index)
      const registrantAddressLine2 = this.postalAddressLine2.nth(index)
      const registrantAddressCity = this.postalAddressCity.nth(index)
      const registrantAddressPostcode = this.postalAddressPostcode.nth(index)
      const registrantAddressCountry = this.postalAddressCountry.nth(index)

      await registrantUserSelector.fill(registrant.email)
      await this.page.waitForResponse(
        resp => resp.url().includes('/v1/graphql') && resp.status() === 200,
      )
      await registrantUserSelector.click()
      await expect(this.autocompleteLoading).toHaveCount(0)
      await this.autocompleteOption
        .locator(`text=${registrant.email}`)
        .first()
        .click()

      const address = registrant.address
      await registrantAddressLine1.fill(address.addresLine1)
      await registrantAddressLine2.fill(address.addresLine2)
      await registrantAddressCity.fill(address.city)
      await registrantAddressPostcode.fill(address.postcode)
      await registrantAddressCountry.fill(address.country)
      await expect(this.autocompleteLoading).toHaveCount(0)
      await this.autocompleteOption
        .locator(`text=${address.country}`)
        .first()
        .click()
    }
  }

  async fillInvoiceDetails(invoiceDetails: InvoiceDetails | undefined) {
    if (invoiceDetails === undefined) {
      throw new Error('Missing invoice details in the course object')
    }
    await this.selectInvoiceOrganisation(invoiceDetails.organisation)
    await this.invoiceContactFirstNameInput.fill(invoiceDetails.firstName)
    await this.invoiceContactSurnameInput.fill(invoiceDetails.lastName)
    await this.invoiceContactEmailInput.fill(invoiceDetails.email)
    await this.invoiceContactPhoneInput.clear()
    await this.invoiceContactPhoneInput.fill(invoiceDetails.phone)
    invoiceDetails.purchaseOrder &&
      (await this.purchaseOrderInput.fill(invoiceDetails.purchaseOrder))
  }

  async fillBookingDetails(
    virtualCourseBookingDetails: VirtualCourseBookingDetails,
  ) {
    await this.setQuantity(virtualCourseBookingDetails.registrants.length)
    await this.selectOrganisation(virtualCourseBookingDetails.organization)
    await this.selectSource()
    await this.fillBookingContactEmail(
      virtualCourseBookingDetails.bookingContactEmail,
    )
    await this.fillRegistrants(virtualCourseBookingDetails.registrants)
    await this.fillInvoiceDetails(virtualCourseBookingDetails.invoiceDetails)
  }

  async clickReviewAndConfirmButton() {
    await this.reviewAndConfirmButton.click()
    return new BookingReviewPage(this.page)
  }
}
