import { Container } from '@mui/material'

import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

export const BookingContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <FullHeightPageLayout bgcolor="grey.100">
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {children}
    </Container>
  </FullHeightPageLayout>
)
