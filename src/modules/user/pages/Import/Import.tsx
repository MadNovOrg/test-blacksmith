import { Typography, Container, Box, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { Step, ImportStepsEnum, ImportSteps } from '@app/components/ImportSteps'
import { ImportProvider } from '@app/components/ImportSteps/context'
import { Sticky } from '@app/components/Sticky'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'

export const Import: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })

  const steps: Array<Step> = [
    { label: t('steps.choose.title'), key: ImportStepsEnum.CHOOSE },
    { label: t('steps.configure.title'), key: ImportStepsEnum.CONFIGURE },
    { label: t('steps.preview.title'), key: ImportStepsEnum.PREVIEW },
    { label: t('steps.importing.title'), key: ImportStepsEnum.IMPORTING },
    { label: t('steps.results.title'), key: ImportStepsEnum.RESULTS },
  ]

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

                <ImportSteps steps={steps} />
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
