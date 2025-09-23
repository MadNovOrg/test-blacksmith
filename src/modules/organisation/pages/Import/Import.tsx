import { Box, Container, Grid, Typography, useMediaQuery } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { ImportSteps, ImportStepsEnum, Step } from '@app/components/ImportSteps'
import { ImportProvider } from '@app/components/ImportSteps/context'
import { Sticky } from '@app/components/Sticky'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'

export const OrganisationImport: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation('pages', { keyPrefix: 'import-organisations' })

  const steps: Array<Step> = [
    { label: t('steps.upload.title'), key: ImportStepsEnum.CHOOSE },
    { label: t('steps.preview.title'), key: ImportStepsEnum.PREVIEW },
    { label: t('steps.importing.title'), key: ImportStepsEnum.IMPORTING },
    { label: t('steps.results.title'), key: ImportStepsEnum.RESULTS },
  ]

  return (
    <ImportProvider>
      <FullHeightPageLayout bgcolor="grey.100">
        <Helmet>
          <title>{t('title')}</title>
        </Helmet>
        <Container maxWidth="lg" sx={{ padding: theme.spacing(4, 0, 4, 0) }}>
          <Grid
            container
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Grid
              item
              xs={12}
              md={3}
              display="flex"
              flexDirection="column"
              pr={6}
            >
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
            </Grid>

            <Grid item xs={12} md={9}>
              <Outlet />
            </Grid>
          </Grid>
        </Container>
      </FullHeightPageLayout>
    </ImportProvider>
  )
}
