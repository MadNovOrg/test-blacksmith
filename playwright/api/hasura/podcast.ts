import {
  Podcast,
  PodcastQuery,
  PodcastQueryVariables,
  PodcastsQuery,
  PodcastsQueryVariables,
} from '@app/generated/graphql'
import PODCAST_QUERY from '@app/queries/membership/podcast'
import PODCASTS_QUERY from '@app/queries/membership/podcasts'

import { getClient } from './client'

export async function getAllPodcasts(): Promise<Podcast[]> {
  const response = await getClient().request<
    PodcastsQuery,
    PodcastsQueryVariables
  >(PODCASTS_QUERY, { input: { paging: { page: 1, perPage: 1000 } } })
  return response.podcasts?.records ?? []
}

export async function getPodcastById(id: string): Promise<Podcast | null> {
  const response = await getClient().request<
    PodcastQuery,
    PodcastQueryVariables
  >(PODCAST_QUERY, { id })
  return response.podcast?.podcast ?? null
}
