import { Typography, Container, Box, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { Sticky } from '@app/components/Sticky'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'

import { ImportSteps } from './components/ImportSteps/ImportSteps'
import { ImportProvider } from './context/ImportProvider'

export const Import: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })

  return (
    <ImportProvider>
      <FullHeightPageLayout bgcolor="grey.100">
        <Container maxWidth="lg" sx={{ padding: theme.spacing(4, 0, 4, 0) }}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
            <Box width={400} display="flex" flexDirection="column" pr={6}>
              <Sticky top={50}>
                <Box mb={4}>
                  <Typography variant="h2" mb={1}>
                    {t('title')}
                  </Typography>
                  <Typography color="grey.700">
                    {t('helper-description')}
                  </Typography>
                </Box>

                <ImportSteps />
              </Sticky>
            </Box>

            <Box flex={1}>
              <Box>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </Container>
      </FullHeightPageLayout>
    </ImportProvider>
  )
}
