import { test as base } from '@playwright/test'

import * as API from '../../api'
import { stateFilePath } from '../../hooks/global-setup'
import { EBookPage } from '../../pages/membership/EBookPage'

const test = base.extend<{
  ebooks: Awaited<ReturnType<typeof API.ebook.getEbooks>>
}>({
  ebooks: async ({}, use) => {
    const ebooks = await API.ebook.getEbooks()

    await use(ebooks)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays ebooks with featured and grid display', async ({
  page,
  ebooks,
}) => {
  const eBookPage = new EBookPage(page)
  await eBookPage.goto()
  await eBookPage.featuredImage(
    ebooks[0]?.featuredImage?.node?.mediaItemUrl ?? ''
  )
  await eBookPage.featuredTitle(ebooks[0]?.title ?? '')
  await eBookPage.checkGridItem(ebooks[1]?.id ?? '')
  await eBookPage.checkDownload()
  await eBookPage.checkPagination(ebooks.length)
})
