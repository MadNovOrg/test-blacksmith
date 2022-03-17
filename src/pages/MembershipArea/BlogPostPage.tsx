import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { BlogPost } from '../../components/Blog/BlogPost'

export const BlogPostPage: React.FC = () => {
  const { t } = useTranslation()
  const { postId } = useParams()

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box>
        {postId ? (
          <BlogPost postId={postId}></BlogPost>
        ) : (
          <Typography variant="h4" gutterBottom>
            {t('pages.membership.blog.no-post-id-error')}
          </Typography>
        )}
      </Box>
    </Container>
  )
}
