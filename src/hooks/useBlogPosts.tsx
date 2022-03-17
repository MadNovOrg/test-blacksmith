import useSWR from 'swr'

import { BlogPost } from '@app/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const POSTS_URL = `${import.meta.env.VITE_BASE_WORDPRESS_URL}/posts`

export const useBlogPostList = (): [BlogPost[], boolean, Error?] => {
  const { data, error } = useSWR<BlogPost[], Error>(POSTS_URL, fetcher)

  const loading = data === undefined && error === undefined

  return [data || [], loading, error]
}

export const useBlogPost = (id?: string): [BlogPost?, boolean?, Error?] => {
  const { data, error } = useSWR<BlogPost, Error>(`${POSTS_URL}/${id}`, fetcher)

  const loading = data === undefined && error === undefined

  return [data, loading, error]
}
