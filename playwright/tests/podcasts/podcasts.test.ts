import { test as base } from '@playwright/test'

import { Podcast } from '@app/generated/graphql'

import * as API from '@qa/api'
import { PodcastPage } from '@qa/fixtures/pages/membership/PodcastPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const test = base.extend<{ podcasts: Podcast[] }>({
  podcasts: async ({}, use) => {
    const allPodcasts = await API.podcast.getAllPodcasts()
    await use(allPodcasts)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays podcasts with featured and grid display', async ({
  page,
  podcasts,
}) => {
  const podcastPage = new PodcastPage(page)
  await podcastPage.goto()
  await podcastPage.checkFeaturedImage(podcasts[0].thumbnail)
  await podcastPage.checkFeaturedPodcast(podcasts[0].name)
  await podcastPage.checkGridItem(podcasts[1].id)
  await podcastPage.checkPagination()
})
