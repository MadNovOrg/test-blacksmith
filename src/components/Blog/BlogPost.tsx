import { CircularProgress, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useBlogPost } from '../../hooks/useBlogPosts'

type BlogPostProps = {
  postId: string
}

export const BlogPost: React.FC<BlogPostProps> = ({ postId }) => {
  const { t } = useTranslation()
  const [post, loading, error] = useBlogPost(postId)

  if (loading) {
    return <CircularProgress />
  }

  if (error || !post) {
    return (
      <Typography variant="h4" gutterBottom>
        {t('pages.membership.error')}
      </Typography>
    )
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {post.title.rendered}
      </Typography>
      <Typography variant="body2">&nbsp;</Typography>

      <Grid container spacing={2}>
        {/* TODO: We need to ensure this is safe */}
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </Grid>
    </>
  )
}
