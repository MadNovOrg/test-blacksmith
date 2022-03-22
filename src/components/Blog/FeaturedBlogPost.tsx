import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import React from 'react'

import { useExpandedBlogPost } from '@app/hooks/useBlogPosts'

import { WPBlogPost } from '@app/types'

type FeaturedBlogPostProps = {
  post: WPBlogPost
  primary?: boolean
}

export const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({
  post,
  primary,
}) => {
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

  const styles = {
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    card: {
      position: 'relative',
      boxShadow: 'none',
    },
    overlay: {
      position: 'absolute' as const,
      bottom: '0px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'black',
      backgroundColor: 'white',
      border: '0px',
      maxWidth: '100%',
      width: '90%',
    },
  }

  return (
    <>
      <Card sx={styles.card}>
        <CardActionArea href={`/membership-area/blog/${expandedPost?.id}`}>
          <CardMedia
            image={expandedPost?.featured_media?.source_url}
            style={styles.media}
          />
          <div style={styles.overlay}>
            <Typography variant="h6">{expandedPost?.title}</Typography>
            <Typography variant="subtitle2">{expandedPost?.excerpt}</Typography>
            {primary && (
              <>
                <Typography variant="caption">
                  {expandedPost?.category?.name}
                </Typography>
                {' • '}
                <Typography variant="caption">
                  Posted on: {expandedPost?.date}
                </Typography>
              </>
            )}
          </div>
        </CardActionArea>
      </Card>
    </>
  )
}
