import { expect, Locator, Page } from '@playwright/test'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import { PER_PAGE } from '@qa/constants'

import { BasePage } from '../BasePage'

export class VideoPage extends BasePage {
  readonly featuredImage: Locator
  readonly pagination: Locator
  readonly play: string
  readonly overlay: string
  readonly videoTitle: Locator

  constructor(page: Page) {
    super(page)
    this.featuredImage = this.page.locator(
      '[data-testid="featured-video-series-item"] img'
    )
    this.pagination = this.page.locator('data-testid=video-series-pagination')
    this.play = '[aria-label="Play"]'
    this.overlay = '.ytp-cued-thumbnail-overlay'
    this.videoTitle = this.page.locator(`data-testid=video-item-title`)
  }

  async goto(id?: string) {
    await super.goto(`membership/video-series/${id ?? ''}`)
  }

  async checkVideoTitle(text: string) {
    await expect(this.videoTitle).toHaveText(text)
  }

  async checkFeaturedImage(source: string) {
    await expect(this.featuredImage).toHaveAttribute('src', source)
  }

  async checkFeaturedTitle(title: string) {
    await expect(
      this.page.locator(
        `data-testid=featured-video-series-item >> text="${title}"`
      )
    ).toBeVisible()
  }

  async checkGridItem(id: string) {
    await expect(
      this.page.locator(`data-testid=video-series-grid-item-${id}`)
    ).toBeVisible()
  }

  async checkPagination(length: number) {
    if (length > PER_PAGE) {
      await expect(this.pagination).toBeVisible()
    }
  }

  async checkVideoContainer(id: string) {
    const ytFrame = await this.page.frameLocator(`iframe#yt-embed-${id}`)
    await expect(ytFrame.locator(this.overlay)).toHaveCount(1)
    await ytFrame.locator(this.play).click()
  }

  async checkRecent(recentItems: (VideoItemSummaryFragment | null)[]) {
    const filteredItems = recentItems.filter(item => item !== null)
    await Promise.all(
      filteredItems.map(async recentItem => {
        await expect(
          this.page.locator(
            `data-testid=video-series-grid-item-${recentItem?.id}`
          )
        ).toBeVisible({ timeout: 60000 })
      })
    )
  }
}
