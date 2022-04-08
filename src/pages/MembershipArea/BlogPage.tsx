import { Box, CircularProgress, Container, Grid } from '@mui/material'
import React from 'react'

import { BlogPostGrid } from '@app/components/Blog/BlogPostGrid'
import { BlogPostList } from '@app/components/Blog/BlogPostList'
import { FeaturedBlogPost } from '@app/components/Blog/FeaturedBlogPost'
import { useBlogPostList } from '@app/hooks/useBlogPosts'

export const BlogPage: React.FC = () => {
  const [posts, sticky_posts, loading] = useBlogPostList()

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box position="relative" width="100%">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box>
        <Grid container spacing={2} rowSpacing={6}>
          <Grid item container xs={12} spacing={4}>
            <Grid item xs={12} md={8}>
              {sticky_posts.length > 0 && (
                <FeaturedBlogPost post={sticky_posts[0]} primary />
              )}
            </Grid>
            <Grid item container md={4} spacing={1}>
              <Grid item sm={6} md={12}>
                {sticky_posts.length > 1 && (
                  <FeaturedBlogPost post={sticky_posts[1]} />
                )}
              </Grid>
              <Grid item sm={6} md={12}>
                {sticky_posts.length > 2 && (
                  <FeaturedBlogPost post={sticky_posts[2]} />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={8}>
            <BlogPostList posts={posts}></BlogPostList>
          </Grid>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12}>
            <BlogPostGrid posts={posts}></BlogPostGrid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
