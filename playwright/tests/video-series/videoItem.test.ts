import { test as base } from '@playwright/test'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import * as API from '@qa/api'
import { VideoPage } from '@qa/fixtures/pages/membership/VideoPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const test = base.extend<{
  data: {
    videoItem: VideoItemSummaryFragment | null
    recentItems: (VideoItemSummaryFragment | null)[]
  }
}>({
  data: async ({}, use) => {
    const videoItems = await API.video.getVideoItems(5)
    const videoItem = await API.video.getVideoItemById(videoItems[0]?.id ?? '')
    await use({ videoItem, recentItems: videoItems.slice(1) })
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video item details and recent items', async ({ page, data }) => {
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!data.videoItem) {
    return test.fail()
  }
  const videoPage = new VideoPage(page)
  await videoPage.goto(data.videoItem.id)
  await videoPage.checkVideoTitle(data.videoItem.title ?? '')
  await videoPage.checkVideoContainer(data.videoItem.id)
  await videoPage.checkRecent(data.recentItems)
})
