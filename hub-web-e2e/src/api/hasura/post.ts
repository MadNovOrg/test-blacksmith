import { gql } from 'graphql-request'

import {
  BlogQuery,
  BlogQueryVariables,
  CategoryQuery,
  CategoryQueryVariables,
  PostQuery,
  PostQueryVariables,
  PostSummaryFragment,
  ResearchSummariesQuery,
  ResearchSummariesQueryVariables,
  TagQuery,
  TagQueryVariables,
} from '@app/generated/graphql'
import BLOG_QUERY from '@app/queries/membership/blog'
import CATEGORY_QUERY from '@app/queries/membership/category'
import POST_QUERY from '@app/queries/membership/post'
import researchSummaries from '@app/queries/membership/research-summaries'
import TAG_QUERY from '@app/queries/membership/tag'

import { getClient } from './client'

export async function getBlogPosts(
  first = 1000
): Promise<(PostSummaryFragment | null)[]> {
  const response = await getClient().request<BlogQuery, BlogQueryVariables>(
    BLOG_QUERY,
    {
      first,
    }
  )
  if (response.content?.posts?.nodes) {
    return response.content.posts.nodes
  }
  return []
}

export async function getPostById(
  id: string
): Promise<PostSummaryFragment | null> {
  const response = await getClient().request<PostQuery, PostQueryVariables>(
    POST_QUERY,
    { id }
  )
  return response.content?.post || null
}

export async function getFirstTagIdWithPosts(): Promise<string | null> {
  const query = gql`
    query FirstTagWithPosts {
      content {
        tags(where: { hideEmpty: true }, first: 1) {
          nodes {
            id
          }
        }
      }
    }
  `
  const response = await getClient().request<{
    content?: { tags?: { nodes?: Array<{ id: string }> } }
  }>(query)
  if (response.content?.tags?.nodes?.length) {
    return response.content.tags.nodes[0].id
  }
  return null
}

export async function getTagById(id: string) {
  const response = await getClient().request<TagQuery, TagQueryVariables>(
    TAG_QUERY,
    { id }
  )
  if (response.content?.tag) {
    return response.content.tag
  }
  return null
}

export async function getFirstCategoryIdWithPosts(): Promise<string | null> {
  const query = gql`
    query FirstCategoryWithPosts {
      content {
        categories(where: { hideEmpty: true }, first: 1) {
          nodes {
            id
          }
        }
      }
    }
  `
  const response = await getClient().request<{
    content?: { categories?: { nodes?: Array<{ id: string }> } }
  }>(query)
  if (response.content?.categories?.nodes?.length) {
    return response.content.categories.nodes[0].id
  }
  return null
}

export async function getCategoryById(id: string) {
  const response = await getClient().request<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY, { id })
  if (response.content?.category) {
    return response.content.category
  }
  return null
}

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
