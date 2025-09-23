import { expect, Locator, Page } from '@playwright/test'

import { createOrderForBooking, getOrderForBookingDone } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

export class BookingDonePage extends BasePage {
  readonly bookingDoneMessage: Locator
  readonly orderLink: Locator

  constructor(page: Page) {
    super(page)
    this.bookingDoneMessage = this.page.locator(
      '[data-testid="order-success-msg"]',
    )
    this.orderLink = this.page.locator('[data-testid="order-link"]')
  }
  async goto(orderId: string) {
    const createOrderSearchStrings = ['CreateOrder']
    const getOrderForBookingSearchStrings = ['GetOrderForBookingDone']
    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (
        createOrderSearchStrings.every(str =>
          JSON.stringify(request.postDataJSON()).includes(str),
        )
      ) {
        await route.fulfill({
          json: createOrderForBooking(orderId),
        })
      } else if (
        getOrderForBookingSearchStrings.every(str =>
          JSON.stringify(request.postDataJSON()).includes(str),
        )
      ) {
        getOrderForBookingDone(orderId, 'TT-0030698')
      } else {
        await route.continue()
      }
    })
    await super.goto(`booking/done/?order_id=${orderId}`)
  }

  async checkOrderSuccessMsg() {
    await expect(this.bookingDoneMessage).toBeVisible()
  }
  async clickOrderLink() {
    await this.orderLink.click()
  }
}
