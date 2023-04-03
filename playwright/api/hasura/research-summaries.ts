import {
  ResearchSummariesQuery,
  ResearchSummariesQueryVariables,
} from '@app/generated/graphql'
import researchSummaries from '@app/queries/membership/research-summaries'

import { getClient } from './client'

export async function getResearchSummaries(first = 1000) {
  const response = await getClient().request<
    ResearchSummariesQuery,
    ResearchSummariesQueryVariables
  >(researchSummaries, { first })
  if (response.content?.researchSummaries?.nodes?.length) {
    return response.content.researchSummaries.nodes
  }
  return []
}
