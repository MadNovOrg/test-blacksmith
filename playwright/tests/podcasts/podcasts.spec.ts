import { test as base } from '@playwright/test'

import { Podcast } from '@app/generated/graphql'

import { getAllPodcasts } from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { PodcastPage } from '../../pages/membership/PodcastPage'

const test = base.extend<{ podcasts: Podcast[] }>({
  podcasts: async ({}, use) => {
    const allPodcasts = await getAllPodcasts()
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
