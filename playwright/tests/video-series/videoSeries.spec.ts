import { test as base } from '@playwright/test'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import * as API from '../../api'
import { stateFilePath } from '../../hooks/global-setup'
import { VideoPage } from '../../pages/membership/VideoPage'

const test = base.extend<{
  videoItems: Array<VideoItemSummaryFragment | null>
}>({
  videoItems: async ({}, use) => {
    const videoItems = await API.video.getVideoItems()
    await use(videoItems)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video items with featured and grid display', async ({
  page,
  videoItems,
}) => {
  const videoPage = new VideoPage(page)
  await videoPage.goto()
  await videoPage.checkFeaturedImage(
    videoItems[0]?.featuredImage?.node?.mediaItemUrl ?? ''
  )
  await videoPage.checkFeaturedTitle(videoItems[0]?.title ?? '')
  await videoPage.checkGridItem(videoItems[0]?.id ?? '')
  await videoPage.checkPagination(videoItems.length)
})
