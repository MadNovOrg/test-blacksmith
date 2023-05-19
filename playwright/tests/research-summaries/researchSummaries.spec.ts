import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { stateFilePath } from '@qa/hooks/global-setup'
import { ResearchSummariesPage } from '@qa/pages/membership/ResearchSummariesPage'

const test = base.extend<{
  researchSummaries: Awaited<
    ReturnType<typeof API.research_summaries.getResearchSummaries>
  >
}>({
  researchSummaries: async ({}, use) => {
    const researchSummaries =
      await API.research_summaries.getResearchSummaries()

    await use(researchSummaries)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays research summaries with featured and grid display', async ({
  page,
  researchSummaries,
}) => {
  const researchPage = new ResearchSummariesPage(page)
  await researchPage.goto()
  await researchPage.checkFeaturedImage(
    researchSummaries[0]?.featuredImage?.node?.mediaItemUrl ?? ''
  )
  await researchPage.checkTitle(researchSummaries[0]?.title ?? '')
  await researchPage.checkGridItem(researchSummaries[1]?.id ?? '')
  await researchPage.checkDownload()
  await researchPage.checkPagination(researchSummaries.length)
})
