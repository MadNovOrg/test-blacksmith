/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import { getVideoItems } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const PER_PAGE = 12

const test = base.extend<{
  videoItems: Array<VideoItemSummaryFragment | null>
}>({
  videoItems: async ({}, use) => {
    const videoItems = await getVideoItems()

    await use(videoItems)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video items with featured and grid display', async ({
  page,
  videoItems,
}) => {
  await page.goto(`${BASE_URL}/membership/video-series`)
  await page.waitForLoadState('networkidle')

  const featuredVideoItemImage = page.locator(
    '[data-testid="featured-video-series-item"] img'
  )

  test
    .expect(featuredVideoItemImage)
    .toHaveAttribute(
      'src',
      videoItems[0]?.featuredImage?.node?.mediaItemUrl ?? ''
    )
  test
    .expect(
      page.locator(
        `data-testid=featured-video-series-item >> text="${videoItems[0]?.title}"`
      )
    )
    .toBeVisible()

  test
    .expect(
      page.locator(`data-testid=video-series-grid-item-${videoItems[1]?.id}`)
    )
    .toBeVisible()

  if (videoItems.length > PER_PAGE) {
    test
      .expect(page.locator('data-testid=video-series-pagination'))
      .toBeVisible()
  }
})
