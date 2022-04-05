import { List, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { WPBlogPost } from '@app/types'

import { BlogPostListItem } from './BlogPostListItem'

export const BlogPostList: React.FC<{ posts: WPBlogPost[] }> = ({ posts }) => {
  const { t } = useTranslation()
  return (
    <>
      <Typography variant="h6">{t('pages.membership.blog.title')}</Typography>
      <List>
        {posts.map(post => (
          <BlogPostListItem post={post} key={post.id} />
        ))}
      </List>
    </>
  )
}
