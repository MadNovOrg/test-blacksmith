/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import { getVideoItemById, getVideoItems } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  data: {
    videoItem: VideoItemSummaryFragment | null
    recentItems: (VideoItemSummaryFragment | null)[]
  }
}>({
  data: async ({}, use) => {
    const videoItems = await getVideoItems(4)
    const videoItem = await getVideoItemById(videoItems[0]?.id ?? '')

    await use({ videoItem, recentItems: videoItems })
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video item details and recent items', async ({ page, data }) => {
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!data.videoItem) {
    return test.fail()
  }

  await page.goto(`${BASE_URL}/membership/video-series/${data.videoItem.id}`)
  await waitForPageLoad(page)

  await test
    .expect(page.locator(`data-testid=video-item-title`))
    .toHaveText(data.videoItem.title ?? '')

  const ytFrame = page.frameLocator(`#yt-embed-${data.videoItem.id}`)

  await test
    .expect(page.locator(`#yt-embed-${data.videoItem.id}`))
    .toHaveCount(1, { timeout: 60000 })
  await test
    .expect(ytFrame.locator('.ytp-cued-thumbnail-overlay'))
    .toHaveCount(1, { timeout: 60000 })
  await ytFrame.locator('[aria-label="Play"]').click()

  data.recentItems.map(async recentItem => {
    if (!recentItem) {
      return
    }

    await test
      .expect(
        page.locator(`data-testid=video-series-grid-item-${recentItem.id}`)
      )
      .toBeVisible({ timeout: 60000 })
  })
})
