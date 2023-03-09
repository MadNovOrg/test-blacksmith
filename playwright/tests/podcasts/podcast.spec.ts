import { test as base } from '@playwright/test'

import { Podcast } from '@app/generated/graphql'

import { getAllPodcasts, getPodcastById } from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { PodcastPage } from '../../pages/membership/PodcastPage'

const test = base.extend<{ podcast: Podcast | null }>({
  podcast: async ({}, use) => {
    const allPodcasts = await getAllPodcasts()
    const podcast = await getPodcastById(allPodcasts[0].id)
    await use(podcast)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays single podcast with the player', async ({ podcast, page }) => {
  const podcastPage = new PodcastPage(page)
  await podcastPage.goto()
  await podcastPage.checkTitle(podcast?.name)
  await podcastPage.clickPlayIcon()
  await podcastPage.checkPauseIconVisible()
  await podcastPage.checkRecentItems(4)
})
