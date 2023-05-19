import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { stateFilePath } from '@qa/hooks/global-setup'
import { WebinarPage } from '@qa/pages/membership/WebinarPage'

const test = base.extend<{
  webinars: Awaited<ReturnType<typeof API.webinar.getWebinars>>
}>({
  webinars: async ({}, use) => {
    const webinars = await API.webinar.getWebinars()

    await use(webinars)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays webinars with featured and grid display', async ({
  page,
  webinars,
}) => {
  const webinarPage = new WebinarPage(page)
  await webinarPage.goto()
  await webinarPage.checkFeaturedImage(
    webinars[0]?.featuredImage?.node?.mediaItemUrl ?? ''
  )
  await webinarPage.checkFeaturedTitle(webinars[0]?.title ?? '')
  await webinarPage.checkGridItem(webinars[1]?.id ?? '')
  await webinarPage.checkPagination(webinars.length)
})
