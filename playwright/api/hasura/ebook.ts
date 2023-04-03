import { EbooksQuery, EbooksQueryVariables } from '@app/generated/graphql'
import EBOOKS_QUERY from '@app/queries/membership/ebooks'

import { getClient } from './client'

export async function getEbooks(first = 1000) {
  const response = await getClient().request<EbooksQuery, EbooksQueryVariables>(
    EBOOKS_QUERY,
    { first }
  )
  if (response.content?.ebooks?.nodes?.length) {
    return response.content.ebooks.nodes
  }
  return []
}
