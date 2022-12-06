import { Box, Container, Skeleton } from '@mui/material'
import React from 'react'

import { FullHeightPage } from '@app/components/FullHeightPage'
import theme from '@app/theme'

export const ResourceListSkeleton = () => (
  <FullHeightPage
    bgcolor={theme.palette.grey[100]}
    pb={3}
    data-testid="resources-list-skeleton"
  >
    <Container maxWidth="lg" sx={{ py: 5 }} disableGutters>
      <Box display="flex" gap={4}>
        <Skeleton
          variant="rectangular"
          width={410}
          height={190}
          sx={{ marginBottom: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width={410}
          height={190}
          sx={{ marginBottom: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width={410}
          height={190}
          sx={{ marginBottom: 2 }}
        />
      </Box>
    </Container>
  </FullHeightPage>
)
