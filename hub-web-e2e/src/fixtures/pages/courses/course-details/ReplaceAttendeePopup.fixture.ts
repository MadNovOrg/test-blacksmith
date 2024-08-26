import { expect, Locator, Page } from '@playwright/test'

import { RegistrantAddress, User } from '@qa/data/types'
import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'
export class ReplaceAttendeePopUp extends BasePage {
  readonly firstNameInput: Locator
  readonly surnameInput: Locator
  readonly emailInput: Locator
  readonly termsAcceptedCheckbox: Locator
  readonly cancelButton: Locator
  readonly submitButton: Locator
  readonly postalAddressLine1: Locator
  readonly postalAddressLine2: Locator
  readonly postalAddressCity: Locator
  readonly postalAddressPostcode: Locator
  readonly postalAddressCountry: Locator
  readonly autocompleteLoading: Locator
  readonly autocompleteOption: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = this.page.locator('input[name="profile.firstName"]')
    this.surnameInput = this.page.locator('input[name="profile.surname"]')
    this.emailInput = this.page.locator('[data-testid="user-selector"] input')
    this.termsAcceptedCheckbox = this.page.locator(
      '[data-testid="terms-checkbox"]',
    )
    this.cancelButton = this.page.locator('[data-testid=replace-cancel]')
    this.submitButton = this.page.locator('[data-testid=replace-submit]')
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
  }

  async enterDetails(firstName: string, surname: string, email: string) {
    await this.emailInput.fill(email)
    await this.firstNameInput.fill(firstName)
    await this.surnameInput.fill(surname)
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

  async clickSubmitButton() {
    if (await this.termsAcceptedCheckbox.isVisible()) {
      await this.termsAcceptedCheckbox.check()
    }
    await this.emailInput.click() // to trigger validation
    await this.submitButton.click()
  }

  async replaceAttendee(user: User, address?: RegistrantAddress) {
    await this.enterDetails(user.givenName, user.familyName, user.email)
    if (address) {
      await this.fillPostalAddressDetails(address)
    }
  }

  async clickConfirmReplace(inviteeEmail: string) {
    await Promise.all([
      this.clickSubmitButton(),
      this.page.route(`**/v1/graphql`, async route => {
        const request = route.request()
        const postData = request.postDataJSON()
        expect(postData.operationName).toBe('ReplaceParticipant')
        expect(postData.variables.input.inviteeEmail).toBe(inviteeEmail)
        route.fulfill({ status: 200, body: JSON.stringify({}) })
      }),
    ])
  }
}
