import { Container } from '@mui/material'

import { FullHeightPage } from '@app/components/FullHeightPage'

export const BookingContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <FullHeightPage bgcolor="grey.100">
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {children}
    </Container>
  </FullHeightPage>
)
