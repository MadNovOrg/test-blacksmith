import { test as base } from '@playwright/test'

import { WebinarSummaryFragment } from '@app/generated/graphql'

import { getWebinarById, getWebinars } from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { WebinarPage } from '../../pages/membership/WebinarPage'

const test = base.extend<{
  data: {
    webinar: WebinarSummaryFragment | null
    recentItems: (WebinarSummaryFragment | null)[]
  }
}>({
  data: async ({}, use) => {
    const recentWebinars = await getWebinars(5)
    const webinar = await getWebinarById(recentWebinars[0]?.id ?? '')

    await use({ webinar, recentItems: recentWebinars.slice(1) })
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video item details and recent items', async ({ page, data }) => {
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!data.webinar) {
    return test.fail()
  }
  const webinarPage = new WebinarPage(page)
  await webinarPage.goto(data.webinar.id)
  await webinarPage.checkTitle(data.webinar.title ?? '')
  await webinarPage.checkWebinarContainer(data.webinar.id)
  await webinarPage.checkRecent(data.recentItems)
})
