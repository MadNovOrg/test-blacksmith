import { expect, Locator, Page } from '@playwright/test'

import { Grade_Enum } from '@app/generated/graphql'

import { UiTable } from '../../components/UiTable'
import { BasePage } from '../BasePage'
import { ProfilePage } from '../profile/ProfilePage'

import { CertificatePage } from './CertificatePage'

class ModifyGradeModal {
  readonly page: Page
  readonly gradingMenu: Locator
  readonly notesInput: Locator
  readonly confirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.gradingMenu = this.page.locator(
      '[data-testid=course-grading-menu-selected]'
    )
    this.notesInput = this.page.locator(
      '[data-testid=modify-grade-modal-notes] input'
    )
    this.confirmButton = this.page.locator(
      '[data-testid=modify-grade-modal-confirm]'
    )
  }

  async addNote(reason = 'reason') {
    await this.notesInput.type(reason)
  }

  async setGrade(grade: Grade_Enum) {
    await this.gradingMenu.click()
    await this.page.locator(`[data-testid=modify-grade-${grade}]`).click()
  }

  async clickConfirm() {
    await this.confirmButton.click()
  }
}

export class CertificationPage extends BasePage {
  readonly name: Locator
  readonly table: UiTable
  readonly certificateGrade: Locator
  readonly manageCertificationButton: Locator
  readonly manageModifyGrade: Locator

  constructor(page: Page) {
    super(page)
    this.name = this.page.locator('[data-testid=name]')
    this.table = new UiTable(
      this.page.locator('[data-testid=certification-table]')
    )
    this.manageCertificationButton = this.page.locator(
      '[data-testid=manage-certification-button]'
    )
    this.manageModifyGrade = this.page.locator(
      '[data-testid=manage-certificate-modify-grade]'
    )
    this.certificateGrade = this.page.locator('[data-testid=certificate-grade]')
  }

  async goto(id?: string) {
    await super.goto(`certifications${id ? `?q=${id}` : ''}`)
  }

  async getFirstCertificate() {
    return this.table.firstRow
      .locator('[data-testid=certificate-number]')
      .textContent()
  }

  async clickFirstUser() {
    await this.table.firstRow.locator('[data-testid=name]').click()
    return new ProfilePage(this.page)
  }

  async clickFirstViewCertificate(): Promise<CertificatePage> {
    await this.table.firstRow.locator('[data-testid=view-certificate]').click()
    return new CertificatePage(this.page)
  }

  async clickManageCertification() {
    await this.manageCertificationButton.click()
  }

  async clickModifyGrade() {
    await this.manageModifyGrade.click()
    return new ModifyGradeModal(this.page)
  }

  async confirmGrade(grade: Grade_Enum) {
    await expect(this.certificateGrade).toHaveText(grade, { ignoreCase: true })
  }
}
