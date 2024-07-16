import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'
import { CertificationPage } from '../certificate/CertificationPage.fixture'

export class ProfilePage extends BasePage {
  readonly editProfile: Locator
  readonly saveChanges: Locator
  readonly certificateButton: Locator
  readonly phoneNumberField: Locator
  readonly autocompleteOption: Locator

  readonly jobTitleSelector: Locator
  readonly viewPhoneNumber: Locator
  readonly deleteProfile: Locator
  readonly countrySelector: Locator

  constructor(page: Page) {
    super(page)
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.editProfile = this.page.locator('data-testid=edit-profile')
    this.saveChanges = this.page.locator('data-testid=profile-save-changes')
    this.certificateButton = this.page.locator(
      `[data-testid*=certificate] button`,
    )
    this.phoneNumberField = this.page.locator('[data-testid="phone"]')
    this.jobTitleSelector = this.page.locator('data-testid=job-title-selector')
    this.viewPhoneNumber = this.page.locator('[data-testid="profile-phone"]')
    this.deleteProfile = this.page.locator('data-testid=delete-profile-button')
    this.countrySelector = this.page.locator(
      '[data-testid="countries-selector-autocomplete"] input',
    )
  }

  async goto(profileId?: string, orgId?: string) {
    const url = orgId
      ? `profile/${profileId}?orgId=${orgId}`
      : `profile/${profileId ?? ''}`

    await super.goto(url)
  }

  async clickEditButton() {
    await this.editProfile.click()
  }

  async clickDeleteProfileButton() {
    await this.page.route(/.*\/v1\/graphql/, async route => {
      const request = route.request()

      if (JSON.stringify(request.postDataJSON()).includes('DeleteProfile')) {
        await route.fulfill({
          json: {
            data: {
              deleteUser: {
                success: true,
                error: null,
                courseIds: null,
                __typename: 'DeleteUserOutput',
              },
            },
          },
        })
      } else {
        await route.continue()
      }
    })

    await this.page.waitForSelector('data-testid=delete-profile-button', {
      state: 'visible',
    })
    await this.deleteProfile.click()
  }

  async clickConfirmDeleteCheckbox() {
    await this.page.waitForSelector('data-testid=profile-delete-checkbox')
    await this.page.locator('data-testid=profile-delete-checkbox').click()
  }

  async deleteUserProfile() {
    await this.page.locator('data-testid=profile-delete-confirm-btn').click()
  }

  async selectJobTitle(jobTitle: string) {
    await this.jobTitleSelector.click()
    await this.page.locator(`data-testid=job-position-${jobTitle}`).click()
  }

  async selectCountry(name: string) {
    await this.countrySelector.clear()
    await this.countrySelector.fill(name)
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async enterPhoneNumber(phoneNumber: string) {
    const currentPhoneNumberValue = await this.phoneNumberField.inputValue()

    await this.phoneNumberField.click()

    for (let i = 0; i <= currentPhoneNumberValue.length; i++) {
      await this.page.keyboard.press('Backspace')
    }

    await this.phoneNumberField.type(phoneNumber)

    await expect(this.phoneNumberField).toHaveValue(phoneNumber)
  }

  async clickSaveChanges() {
    let stringifyData: string | null = null
    const regex = new RegExp('\\b' + 'UpdateProfile' + '\\b')

    await this.page.route(/.*\/v1\/graphql/, async route => {
      const request = route.request()

      if (JSON.stringify(request.postDataJSON()).match(regex)) {
        await route.fulfill({
          json: { data: { updateUserProfile: true } },
        })
        stringifyData = JSON.stringify(request.postDataJSON())
      } else {
        await route.continue()
      }
    })

    await this.saveChanges.click()

    await expect(this.editProfile).toBeVisible()
    await this.page.reload()

    return stringifyData
  }

  async checkJobTitle(jobTitle: string) {
    await expect(this.page.locator('data-testid=profile-job-title')).toHaveText(
      jobTitle,
    )
  }

  async checkPhoneNumber(phoneNumber: string) {
    await expect(this.viewPhoneNumber).toHaveText(phoneNumber)
  }

  async checkLicenceIdExists(licenseId: string, exists: boolean) {
    const locator = this.page.locator(`data-testid=go1-license-${licenseId}`)
    if (exists) {
      await expect(locator).toBeVisible()
    } else {
      await expect(locator).toBeHidden()
    }
  }

  async clickEditProfile() {
    await this.editProfile.click()
  }

  async clickRemoveLicenceById(licenseId: string) {
    await this.page.click(
      `data-testid=go1-license-${licenseId} >> button:has-text("Remove")`,
    )
    await expect(
      this.page.locator(`data-testid=go1-license-${licenseId}`),
    ).toHaveCount(0)
  }

  async checkCertificate(certificateId: string | null) {
    await expect(
      this.page.locator(`data-testid=certificate-${certificateId}`),
    ).toBeVisible()
  }

  async clickFirstCertificate() {
    await this.certificateButton.first().click()
    return new CertificationPage(this.page)
  }

  async checkCourseHistory(courseId: number, action: string) {
    await expect(
      this.page
        .locator(`data-testid=course-row-${courseId}`)
        .locator('data-testid=course-action'),
    ).toHaveText(action)
  }
}
