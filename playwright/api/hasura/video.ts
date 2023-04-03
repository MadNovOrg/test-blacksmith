import {
  VideoItemQuery,
  VideoItemQueryVariables,
  VideoItemSummaryFragment,
  VideoSeriesQuery,
  VideoSeriesQueryVariables,
} from '@app/generated/graphql'
import VIDEO_ITEM_QUERY from '@app/queries/membership/video-item'
import VIDEO_SERIES_QUERY from '@app/queries/membership/video-series'

import { getClient } from './client'

export async function getVideoItems(
  first = 1000
): Promise<Array<VideoItemSummaryFragment | null>> {
  const response = await getClient().request<
    VideoSeriesQuery,
    VideoSeriesQueryVariables
  >(VIDEO_SERIES_QUERY, { first })
  if (response.content?.videoSeriesItems?.nodes) {
    return response.content.videoSeriesItems.nodes
  }
  return []
}

export async function getVideoItemById(
  id: string
): Promise<VideoItemSummaryFragment | null> {
  const response = await getClient().request<
    VideoItemQuery,
    VideoItemQueryVariables
  >(VIDEO_ITEM_QUERY, { id })
  return response.content?.videoSeriesItem || null
}
