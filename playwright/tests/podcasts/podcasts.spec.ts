/* eslint-disable no-empty-pattern */
import { expect, test as base } from '@playwright/test'

import { Podcast } from '@app/generated/graphql'

import { getAllPodcasts } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{ podcasts: Podcast[] }>({
  podcasts: async ({}, use) => {
    const allPodcasts = await getAllPodcasts()
    await use(allPodcasts)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test.describe('podcasts page', () => {
  test('displays podcasts with featured and grid display', async ({
    page,
    podcasts,
  }) => {
    await page.goto(`${BASE_URL}/membership/podcasts`)
    await waitForPageLoad(page)

    const featuredPodcastImage = page.locator(
      '[data-testid="featured-podcast"] img'
    )

    await expect(featuredPodcastImage).toBeVisible()
    await expect(featuredPodcastImage).toHaveAttribute(
      'src',
      podcasts[0].thumbnail
    )
    await expect(
      page.locator(`data-testid=featured-podcast >> text="${podcasts[0].name}"`)
    ).toBeVisible()

    await expect(
      page.locator(`data-testid=podcast-grid-item-${podcasts[1].id}`)
    ).toBeVisible()
    await expect(page.locator('data-testid=podcasts-pagination')).toBeVisible()
  })
})
