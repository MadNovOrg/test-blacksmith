import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'

import { useExpandedBlogPost } from '@app/hooks/useBlogPosts'
import { WPBlogPost } from '@app/types'

type FeaturedBlogPostProps = {
  post: WPBlogPost
}

export const BlogPostGridItem: React.FC<FeaturedBlogPostProps> = ({ post }) => {
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
    <Grid item xs={4}>
      <Card>
        <CardActionArea href={`/membership-area/blog/${expandedPost?.id}`}>
          <CardMedia
            component="img"
            image={expandedPost?.featured_media?.source_url}
          />
          <CardContent>
            <Typography variant="h6">{expandedPost?.title}</Typography>
            <Typography variant="subtitle2">{expandedPost?.excerpt}</Typography>
            <Typography variant="caption">
              {expandedPost?.category?.name}
            </Typography>
            {' • '}
            <Typography variant="caption">
              Posted on: {expandedPost?.date}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}
