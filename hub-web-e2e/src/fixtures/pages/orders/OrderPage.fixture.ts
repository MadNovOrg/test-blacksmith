import { Download, expect, Locator, Page } from '@playwright/test'
import { readFile } from 'xlsx'

import { OrderInfoFragment, Payment_Methods_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'

import { BasePage } from '../BasePage.fixture'

type Orders = Awaited<ReturnType<typeof API.order.getOrders>>

const PAYMENT_METHODS: Record<Payment_Methods_Enum, string> = {
  [Payment_Methods_Enum.Cc]: 'Credit Card',
  [Payment_Methods_Enum.Invoice]: 'Invoice',
}

export class OrderPage extends BasePage {
  readonly exportWholePageButton: Locator
  readonly exportAllOrders: Locator
  readonly exportSelectedOrders: Locator

  constructor(page: Page) {
    super(page)
    this.exportWholePageButton = this.page.locator(
      'button:has-text("Export whole page")',
    )
    this.exportAllOrders = this.page.locator(
      'button:has-text("Export all orders")',
    )
    this.exportSelectedOrders = this.page.locator(
      'button:has-text("Export selected")',
    )
  }

  async goto() {
    await super.goto(`orders`)
  }

  async checkOrderVisiblity(orders: OrderInfoFragment[]) {
    for (const order of orders.filter(order =>
      Boolean(order.xeroInvoiceNumber),
    )) {
      await expect(
        this.page.locator(`${order.xeroInvoiceNumber}`),
      ).toBeVisible()
    }
  }

  async selectRandomRows(orders: Orders) {
    const selectOrders = Math.ceil(orders.length / 2)
    for (let i = 0; i < selectOrders; i++) {
      await this.page.click(
        `data-testid=${orders[i].id} >> data-testid=TableChecks-Row`,
      )
    }
  }

  async selectPaymentMethod(type: 'Credit card' | 'Invoice') {
    await this.page.click('text=Payment Method')
    await this.page.click(`text="${type}"`)
  }

  async waitForDownload() {
    await this.page.waitForEvent('download')
  }

  async exportWholePage() {
    await this.exportWholePageButton.click()
  }

  async expectSelectedDisabled() {
    await expect(this.exportSelectedOrders).toBeDisabled()
  }

  async download(selector: 'all' | 'selected') {
    let clickMethod
    if (selector === 'all') {
      clickMethod = this.exportAllOrders
    } else {
      clickMethod = this.exportSelectedOrders
    }
    return await Promise.all([
      this.page.waitForEvent('download'),
      clickMethod.click(),
    ])
  }

  async assertDownloadedCSV(download: Download, data: OrderInfoFragment[]) {
    const downloadPath = (await download.path()) as string

    const workbook = readFile(downloadPath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    expect(sheet['A1'].v).toMatch(/Invoice no\./)
    expect(sheet['B1'].v).toMatch(/Reference no\./)
    expect(sheet['C1'].v).toMatch(/Bill to/)
    expect(sheet['D1'].v).toMatch(/Payment Method/)
    expect(sheet['E1'].v).toMatch(/Amount/)
    expect(sheet['F1'].v).toMatch(/Due/)
    expect(sheet['G1'].v).toMatch(/Due Date/)
    expect(sheet['H1'].v).toMatch(/Status/)

    expect(data).not.toBe(null)
    expect(data).not.toBe(undefined)

    data?.forEach((order, index) => {
      const cellIndex = index + 2

      expect(sheet[`A${cellIndex}`]?.v ?? null).toBe(order?.xeroInvoiceNumber)
      expect(sheet[`C${cellIndex}`]?.v ?? null).toContain(
        order?.organization?.name,
      )
      expect(sheet[`C${cellIndex}`]?.v ?? null).toContain(
        order?.organization?.address?.line1,
      )
      expect(sheet[`C${cellIndex}`]?.v ?? null).toContain(
        order?.organization?.address?.city,
      )
      expect(sheet[`C${cellIndex}`]?.v ?? null).toContain(
        order?.organization?.address?.postCode,
      )

      const paymentMethod = order?.paymentMethod
        ? PAYMENT_METHODS[order.paymentMethod]
        : 'error'

      expect(sheet[`D${cellIndex}`]?.v ?? null).toMatch(
        new RegExp(paymentMethod),
      )
      expect(sheet[`E${cellIndex}`]?.v ?? 0).toBe(Number(order?.orderTotal))

      if (order?.orderDue) {
        expect(sheet[`F${cellIndex}`]?.v ?? null).toBe(order?.orderDue ?? '')
      }
    })
  }
}
