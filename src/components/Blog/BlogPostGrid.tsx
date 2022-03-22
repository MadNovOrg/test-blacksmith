import React, { useState } from 'react'
import { Container } from 'aws-amplify-react'
import { Box, CircularProgress, Grid, Tab, Tabs } from '@mui/material'

import { useCategoriesList } from '@app/hooks/useBlogPosts'

import { BlogPostGridItem } from './BlogPostGridItem'

import { WPBlogPost } from '@app/types'

const TabPanel: React.FC<{ index: number; value: number; children: any }> = ({
  index,
  value,
  children,
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const BlogPostGrid: React.FC<{ posts: WPBlogPost[] }> = ({ posts }) => {
  const [categories, loading] = useCategoriesList()
  const [value, setValue] = useState(0)

  if (loading) {
    return (
      <Container sx={{ pt: 2 }}>
        <Box position="relative" width="100%">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="category tabs"
        >
          {categories.map((cat, idx) => (
            <Tab label={cat.name} key={idx} />
          ))}
        </Tabs>
      </Box>
      <div>Search Bar - todo</div>
      {categories.map((cat, idx) => (
        <TabPanel value={value} index={idx} key={cat.id}>
          <Grid container spacing={2} alignItems="stretch">
            {posts
              .filter(post => post.categories.includes(cat.id))
              .map(post => (
                <BlogPostGridItem key={post.id} post={post}></BlogPostGridItem>
              ))}
          </Grid>
        </TabPanel>
      ))}
    </>
  )
}
