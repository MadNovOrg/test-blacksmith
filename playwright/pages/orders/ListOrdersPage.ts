import fs from 'fs'

import { expect, Locator, Page } from '@playwright/test'
import * as XLSX from 'xlsx'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

type Filters = {
  cc: boolean
  invoice: boolean
}

export class ListOrdersPage extends BasePage {
  filters: Filters
  pageLoaded: boolean

  readonly ccInvoiceRow: Locator
  readonly ccFilterButton: Locator
  readonly canPageBeLoaded: boolean
  readonly exportAllButton: Locator
  readonly circularProgress: Locator
  readonly invoiceInvoiceRow: Locator
  readonly dueDateTableHeader: Locator
  readonly invoiceFilterButton: Locator
  readonly pageLoadedIndicator: Locator
  readonly exportSelectedButton: Locator
  readonly paymentMethodsFilterAccordion: Locator

  constructor(page: Page, canPageBeLoaded = true) {
    super(page)

    this.pageLoaded = false
    this.canPageBeLoaded = canPageBeLoaded
    this.filters = {
      cc: false,
      invoice: false,
    }

    this.pageLoadedIndicator = this.page.locator(
      'data-testid=list-orders-heading'
    )
    this.circularProgress = this.page.locator(
      'data-testid=list-orders-circular-progress'
    )

    this.ccInvoiceRow = this.page.locator(
      'data-testid=6107ec8c-38fc-429d-b837-51df5c8cfc53'
    )
    this.invoiceInvoiceRow = this.page.locator(
      'data-testid=0ad5cce2-abbc-484a-8a8c-353a3d08da0a'
    )

    this.paymentMethodsFilterAccordion = this.page.locator(
      'div[data-testid="FilterAccordion"]:has-text("Payment Method")'
    )
    this.ccFilterButton = this.page.locator(
      'div[data-testid="FilterAccordion-option"]:has-text("Credit card")'
    )
    this.invoiceFilterButton = this.page.locator(
      'div[data-testid="FilterAccordion-option"]:has-text("Invoice")'
    )
    this.exportSelectedButton = this.page.locator(
      'data-testid=list-orders-export-selected-button'
    )
    this.exportAllButton = this.page.locator(
      'data-testid=list-orders-export-all-button'
    )

    this.dueDateTableHeader = this.page.locator('th:has-text("Due Date")')
  }

  async goto() {
    const mandatoryElement = this.canPageBeLoaded
      ? this.pageLoadedIndicator
      : this.page.locator('h2:has-text("Page not found")')

    await super.goto(`${BASE_URL}/orders`, mandatoryElement, 5000)

    if (this.canPageBeLoaded) {
      await this.circularProgress.waitFor({ state: 'hidden', timeout: 5000 })

      // Sort invoices by ascending due date
      await this.dueDateTableHeader.click()

      await this.paymentMethodsFilterAccordion.click()
    }

    this.pageLoaded = true
  }

  checkIfPageLoaded() {
    expect(this.pageLoaded).toBe(true)
  }

  async toggleCCFilter() {
    await this.ccFilterButton.click()
    this.filters.cc = !this.filters.cc
  }

  async toggleInvoiceFilter() {
    await this.invoiceFilterButton.click()
    this.filters.invoice = !this.filters.invoice
  }

  async checkFilters() {
    await expect(await this.ccInvoiceRow.isVisible()).toBe(
      this.filters.cc || !(this.filters.cc || this.filters.invoice)
    )
    await expect(await this.invoiceInvoiceRow.isVisible()).toBe(
      this.filters.invoice || !(this.filters.cc || this.filters.invoice)
    )
  }

  async checkExport() {
    await expect(this.exportSelectedButton).toBeDisabled()
    await expect(this.exportAllButton).toBeEnabled()

    if (!this.filters.invoice) {
      await this.invoiceFilterButton.click()
    }

    await this.invoiceInvoiceRow.locator('data-testid=TableChecks-Row').click()
    await expect(this.exportSelectedButton).toBeEnabled()

    const [selectedExportDownload] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportSelectedButton.click(),
    ])

    const [allExportDownload] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportAllButton.click(),
    ])

    const selectedExportFilePath =
      (await selectedExportDownload.path()) as string
    const allExportFilePath = (await allExportDownload.path()) as string

    const selectedExportFileSize = fs.statSync(selectedExportFilePath).size
    const allExportFileSize = fs.statSync(allExportFilePath).size
    await expect(selectedExportFileSize < allExportFileSize).toBe(true)

    const workbooks = [
      XLSX.readFile(selectedExportFilePath),
      XLSX.readFile(allExportFilePath),
    ]
    for (const wb of workbooks) {
      const ws = wb.Sheets[wb.SheetNames[0]]
      expect(ws['A1'].v).toMatch('Invoice no.')
      expect(ws['B1'].v).toMatch('Organisation')
      expect(ws['C1'].v).toMatch('Payment Method')
      expect(ws['D1'].v).toMatch('Amount')
      expect(ws['E1'].v).toMatch('Due')
      expect(ws['F1'].v).toMatch('Due Date')
      expect(ws['G1'].v).toMatch('Status')
    }
  }
}
