import {
  WebinarQuery,
  WebinarQueryVariables,
  WebinarsQuery,
  WebinarsQueryVariables,
  WebinarSummaryFragment,
} from '@app/generated/graphql'
import WEBINAR_QUERY from '@app/queries/membership/webinar'
import WEBINARS_QUERY from '@app/queries/membership/webinars'

import { getClient } from './client'

export async function getWebinars(
  first = 1000
): Promise<Array<WebinarSummaryFragment | null>> {
  const response = await getClient().request<
    WebinarsQuery,
    WebinarsQueryVariables
  >(WEBINARS_QUERY, { first })
  if (response.content?.webinars?.nodes) {
    return response.content.webinars.nodes
  }
  return []
}

export async function getWebinarById(
  id: string
): Promise<WebinarSummaryFragment | null> {
  const response = await getClient().request<
    WebinarQuery,
    WebinarQueryVariables
  >(WEBINAR_QUERY, { id })
  return response.content?.webinar || null
}
