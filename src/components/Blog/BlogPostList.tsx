import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import React from 'react'
import { Link as RRLink } from 'react-router-dom'

import { useBlogPostList } from '../../hooks/useBlogPosts'

export const BlogPostList: React.FC = () => {
  const [posts, loading] = useBlogPostList()

  if (loading) {
    return (
      <Box position="relative" width="100%">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <List>
      {posts.map(post => (
        <ListItem key={post.id}>
          <ListItemButton
            component={RRLink}
            to={`/membership-area/blog/${post.id}`}
          >
            <ListItemText primary={post.title.rendered} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
