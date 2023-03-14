import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class EnquiryPage extends BasePage {
  readonly enquireNow: Locator
  readonly interest: Locator
  readonly firstName: Locator
  readonly lastName: Locator
  readonly message: Locator
  readonly numberOfCourseParticipants: Locator
  readonly organisationName: Locator
  readonly phoneNumber: Locator
  readonly sectorEdu: Locator
  readonly sectorSelect: Locator
  readonly sourceFacebook: Locator
  readonly sourceSelect: Locator
  readonly thankyou: Locator
  readonly workEmail: Locator

  constructor(page: Page) {
    super(page)
    this.enquireNow = this.page.locator('button:has-text("Enquire now")')
    this.interest = this.page.locator('text=What is your interest? *')
    this.firstName = this.page.locator('text=First Name *')
    this.lastName = this.page.locator('text=Last Name *')
    this.message = this.page.locator('text=Message (optional)')
    this.numberOfCourseParticipants = this.page.locator(
      'text=Number of course participants'
    )
    this.organisationName = this.page.locator('text=Organisation Name *')
    this.phoneNumber = this.page.locator('text=Phone *')
    this.sectorEdu = this.page.locator('data-testid=sector-edu')
    this.sectorSelect = this.page.locator('data-testid=sector-select')
    this.sourceFacebook = this.page.locator('data-testid=source-facebook')
    this.sourceSelect = this.page.locator('data-testid=source-select')
    this.thankyou = this.page.locator('text=Thank you for your enquiry')
    this.workEmail = this.page.locator('text=Work email *')
  }

  async goto(id?: string) {
    await super.goto(
      id ? `${BASE_URL}/enquiry?course_id=${id}` : `${BASE_URL}/enquiry`
    )
  }

  async fillInterest(interest: string) {
    await this.interest.type(interest)
  }

  async setFirstName(name: string) {
    await this.firstName.type(name)
  }

  async setLastName(name: string) {
    await this.lastName.type(name)
  }

  async setEmail(email: string) {
    await this.workEmail.type(email)
  }

  async setOrganisation(name: string) {
    await this.organisationName.type(name)
  }

  async setPhoneNumber(phone: string) {
    await this.phoneNumber.type(phone)
  }

  async setMessage(message: string) {
    await this.message.type(message)
  }

  async clickSectorSelect() {
    await this.sectorSelect.click()
  }

  async clickSectorEdu() {
    await this.sectorEdu.click()
  }

  async clickSourceSelect() {
    await this.sourceSelect.click()
  }

  async clickSourceFacebook() {
    await this.sourceFacebook.click()
  }

  async clickEnquireNow() {
    await this.enquireNow.click()
  }

  async checkEnquiry() {
    await expect(this.thankyou).toBeVisible()
  }
}
