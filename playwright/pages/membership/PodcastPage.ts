import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class PodcastPage extends BasePage {
  readonly gridItems: Locator
  readonly featuredImage: Locator
  readonly pagination: Locator
  readonly playIcon: Locator
  readonly pauseIcon: Locator

  constructor(page: Page) {
    super(page)
    this.gridItems = this.page.locator(
      'data-testid=recent-podcasts >> [data-grid-item]'
    )
    this.featuredImage = this.page.locator(
      '[data-testid="featured-podcast"] img'
    )
    this.pagination = this.page.locator('data-testid=podcasts-pagination')
    this.playIcon = this.page.locator('data-testid=PlayCircleIcon')
    this.pauseIcon = this.page.locator('data-testid=PauseCircleIcon')
  }

  async goto(id?: string) {
    await super.goto(
      id
        ? `${BASE_URL}/membership/podcasts/${id}`
        : `${BASE_URL}/membership/podcasts`
    )
  }

  async checkTitle(title?: string) {
    await expect(this.page.locator('data-testid=podcast-title')).toHaveText(
      title ?? ''
    )
  }

  async clickPlayIcon() {
    await this.playIcon.click()
  }

  async checkPauseIconVisible() {
    await expect(this.pauseIcon).toBeVisible()
  }

  async checkRecentItems(count: number) {
    await expect(this.gridItems).toHaveCount(count)
  }

  async checkFeaturedImage(thumbnail: string) {
    await expect(this.featuredImage).toBeVisible()
    await expect(this.featuredImage).toHaveAttribute('src', thumbnail)
  }

  async checkFeaturedPodcast(name: string) {
    await expect(
      this.page.locator(`data-testid=featured-podcast >> text="${name}"`)
    ).toBeVisible()
  }

  async checkGridItem(id: string) {
    await expect(
      this.page.locator(`data-testid=podcast-grid-item-${id}`)
    ).toBeVisible()
  }

  async checkPagination() {
    await expect(this.pagination).toBeVisible()
  }
}
