import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { BlogPostList } from '../../components/Blog/BlogPostList'

export const BlogPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('pages.membership.blog.title')}
        </Typography>
        <Typography variant="body2">&nbsp;</Typography>
        <BlogPostList></BlogPostList>
      </Box>
    </Container>
  )
}
