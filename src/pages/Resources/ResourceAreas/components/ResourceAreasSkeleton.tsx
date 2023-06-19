import {
  Box,
  Container,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

import { FullHeightPage } from '@app/components/FullHeightPage'

export const ResourceListSkeleton = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <FullHeightPage
      bgcolor={theme.palette.grey[100]}
      pb={3}
      data-testid="resources-list-skeleton"
    >
      <Container maxWidth="lg" sx={{ py: 5 }} disableGutters>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={4}>
          <Skeleton
            variant="rectangular"
            width={isMobile ? undefined : 410}
            height={190}
            sx={{ marginBottom: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={isMobile ? undefined : 410}
            height={190}
            sx={{ marginBottom: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={isMobile ? undefined : 410}
            height={190}
            sx={{ marginBottom: 2 }}
          />
        </Box>
      </Container>
    </FullHeightPage>
  )
}
