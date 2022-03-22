import useSWR from 'swr'
import { stripHtml } from 'string-strip-html'

import { BlogPost, WPBlogPost, WPCategory, WPMedia } from '@app/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const POSTS_URL = `${import.meta.env.VITE_BASE_WORDPRESS_URL}/posts`
const STICKY_POSTS_URL = `${POSTS_URL}?sticky=true`
const BASE_MEDIA_URL = `${import.meta.env.VITE_BASE_WORDPRESS_URL}/media`
const BASE_CATEGORY_URL = `${
  import.meta.env.VITE_BASE_WORDPRESS_URL
}/categories`

export const useExpandedBlogPost = (
  wpPost: WPBlogPost
): [BlogPost?, boolean?] => {
  const { data: featured_media, error: featured_media_error } = useSWR<
    WPMedia,
    Error
  >(() => `${BASE_MEDIA_URL}/${wpPost.featured_media}`, fetcher)
  const { data: category, error: category_error } = useSWR<WPCategory, Error>(
    `${BASE_CATEGORY_URL}/${wpPost.categories[0]}`,
    fetcher
  )

  const loading =
    (featured_media === undefined && featured_media_error === undefined) ||
    (category === undefined && category_error === undefined)

  const post = loading
    ? undefined
    : {
        id: wpPost.id,
        title: wpPost.title.rendered,
        content: wpPost.content.rendered,
        excerpt: stripHtml(wpPost.excerpt.rendered).result,
        date: wpPost.date,
        featured_media: featured_media,
        category: category,
      }

  return [post, loading]
}

export const useBlogPostList = (): [
  WPBlogPost[],
  WPBlogPost[],
  boolean,
  Error?
] => {
  const { data: posts, error: posts_error } = useSWR<WPBlogPost[], Error>(
    POSTS_URL,
    fetcher
  )
  const { data: sticky_posts, error: sticky_error } = useSWR<
    WPBlogPost[],
    Error
  >(STICKY_POSTS_URL, fetcher)

  const loading =
    (posts === undefined && posts_error === undefined) ||
    (sticky_posts === undefined && sticky_error === undefined)

  return [posts || [], sticky_posts || [], loading, posts_error || sticky_error]
}

export const useBlogPost = (id?: string): [WPBlogPost?, boolean?, Error?] => {
  const { data, error } = useSWR<WPBlogPost, Error>(
    `${POSTS_URL}/${id}`,
    fetcher
  )

  const loading = data === undefined && error === undefined

  return [data, loading, error]
}

export const useCategoriesList = (): [WPCategory[], boolean, Error?] => {
  const { data, error } = useSWR<WPCategory[], Error>(
    BASE_CATEGORY_URL,
    fetcher
  )

  const loading = data === undefined && error === undefined

  return [data || [], loading, error]
}
