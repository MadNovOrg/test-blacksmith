import { Box, Container, Typography } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import theme from '@app/theme'

import { CourseExceptionsLogTabs } from '../../components/CourseExceptionsLogTabs'

export const CourseExceptionsLog: FC<PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()

  return (
    <FullHeightPageLayout data-testid="course-exceptions-log" sx={{ mb: 10 }}>
      <Helmet>
        <title>{t('pages.browser-tab-titles.admin.course-exceptions')}</title>
      </Helmet>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BackButton label={t('pages.admin.back-to-settings')} />
          <Typography variant="h1" py={2} fontWeight={600}>
            {t(`pages.admin.course-exceptions-log.title`)}
          </Typography>
        </Container>
      </Box>
      <Box sx={{ px: 3 }}>
        <CourseExceptionsLogTabs />
      </Box>
    </FullHeightPageLayout>
  )
}
