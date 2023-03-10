import { expect, Locator, Page } from '@playwright/test'

import { WebinarSummaryFragment } from '@app/generated/graphql'

import { BASE_URL, PER_PAGE } from '../../constants'
import { BasePage } from '../BasePage'

export class WebinarPage extends BasePage {
  readonly featuredImage: Locator
  readonly pagination: Locator
  readonly play: string
  readonly overlay: string
  readonly webinarTitle: Locator

  constructor(page: Page) {
    super(page)
    this.featuredImage = this.page.locator(
      '[data-testid="featured-webinar"] img'
    )
    this.pagination = this.page.locator('data-testid=video-series-pagination')
    this.play = '[aria-label="Play"]'
    this.overlay = '.ytp-cued-thumbnail-overlay'
    this.webinarTitle = this.page.locator(`data-testid=webinar-title`)
  }

  async goto(id?: string) {
    await super.goto(
      id
        ? `${BASE_URL}/membership/webinars/${id}`
        : `${BASE_URL}/membership/webinars`
    )
  }

  async checkTitle(title: string) {
    await expect(this.webinarTitle).toHaveText(title)
  }

  async checkFeaturedImage(source: string) {
    await expect(this.featuredImage).toHaveAttribute('src', source)
  }

  async checkFeaturedTitle(title: string) {
    await expect(
      this.page.locator(`data-testid=featured-webinar >> text="${title}"`)
    ).toBeVisible()
  }

  async checkGridItem(id: string) {
    await expect(
      this.page.locator(`data-testid=webinar-grid-item-${id}`)
    ).toBeVisible()
  }

  async checkPagination(length: number) {
    if (length > PER_PAGE) {
      await expect(this.pagination).toBeVisible()
    }
  }

  async checkWebinarContainer(id: string) {
    const ytFrame = await this.page.frameLocator(`iframe#yt-embed-${id}`)
    await expect(ytFrame.locator(this.overlay)).toHaveCount(1)
    await ytFrame.locator(this.play).click()
  }

  async checkRecent(recentItems: (WebinarSummaryFragment | null)[]) {
    const filteredItems = recentItems.filter(item => item !== null)
    await Promise.all(
      filteredItems.map(async recentItem => {
        await expect(
          this.page.locator(`data-testid=webinars-grid-item-${recentItem?.id}`)
        ).toBeVisible({ timeout: 60000 })
      })
    )
  }
}
