import {
  Box,
  CircularProgress,
  Container,
  Grid,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material'
import React from 'react'
import { Link as RRLink } from 'react-router-dom'

import { useExpandedBlogPost } from '@app/hooks/useBlogPosts'

import { WPBlogPost } from '@app/types'

export const BlogPostListItem: React.FC<{ post: WPBlogPost }> = ({ post }) => {
  const [expandedPost, loading] = useExpandedBlogPost(post)

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
    <>
      <ListItem key={post.id}>
        <ListItemButton
          component={RRLink}
          to={`/membership-area/blog/${expandedPost?.id}`}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <img
                style={{ width: '100%' }}
                src={expandedPost?.featured_media?.source_url}
                alt={expandedPost?.featured_media?.alt_text}
              ></img>
            </Grid>
            <Grid xs={10} item>
              <Grid
                sx={{ height: '100%' }}
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid item>
                  <Grid item>
                    <Typography variant="h6">{expandedPost?.title}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">
                      {expandedPost?.excerpt}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="caption">
                    {expandedPost?.category?.name}
                  </Typography>
                  {' • '}
                  <Typography variant="caption">
                    Posted on: {expandedPost?.date}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ListItemButton>
      </ListItem>
      <hr />
    </>
  )
}
