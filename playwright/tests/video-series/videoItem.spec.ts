/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import { getVideoItemById, getVideoItems } from '../../api/hasura-api'
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
  if (!data.videoItem) {
    return test.fail()
  }

  await page.goto(`${BASE_URL}/membership/video-series/${data.videoItem.id}`)
  await page.waitForLoadState('networkidle')

  test
    .expect(page.locator(`data-testid=video-item-title`))
    .toHaveText(data.videoItem.title ?? '')

  const ytFrame = page.frameLocator(`#yt-embed-${data.videoItem.id}`)

  await ytFrame.locator('[aria-label="Play"]').click()

  data.recentItems.map(recentItem => {
    if (!recentItem) {
      return
    }

    test
      .expect(
        page.locator(`data-testid=video-series-grid-item-${recentItem.id}`)
      )
      .toBeVisible()
  })
})
