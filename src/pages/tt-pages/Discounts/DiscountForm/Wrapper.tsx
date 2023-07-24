import { Box, Container, Typography } from '@mui/material'
import React from 'react'

import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

type Props = {
  title: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

export const Wrapper: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
  onSubmit,
}) => {
  return (
    <FullHeightPageLayout bgcolor="grey.100">
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" gap={4}>
          <Box width={300}>
            <Typography variant="h2" mb={2}>
              {title}
            </Typography>
          </Box>

          <Box
            component="form"
            flex={1}
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
