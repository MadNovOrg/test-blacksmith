import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import useCourse from '@app/hooks/useCourse'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import { LoadingStatus } from '@app/util'

import { CourseGradingSteps } from './CourseGradingSteps'
import { GradingDetailsProvider } from './GradingDetailsProvider'

export const CourseGradingDetails = () => {
  const { id: courseId } = useParams()
  const { t } = useTranslation('pages', { keyPrefix: 'course-grading-details' })

  const { data: course, status } = useCourse(courseId ?? '')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {status === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {status === LoadingStatus.ERROR ? (
          <Alert severity="error">{t('course-error-alert-text')}</Alert>
        ) : null}
        {course ? (
          <GradingDetailsProvider accreditedBy={course.accreditedBy}>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
              <Box width={400} display="flex" flexDirection="column" pr={4}>
                <Sticky top={20}>
                  <Box mb={2}>
                    <BackButton
                      to={`/courses/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`}
                      label={t('back-button-text')}
                    />
                  </Box>
                  <Typography variant="h2" mb={2}>
                    {t('title')}
                  </Typography>
                  <Typography variant="h3" mb={5} fontWeight="600">
                    {course?.name}
                  </Typography>
                  <CourseGradingSteps />
                </Sticky>
              </Box>

              <Box flex={1}>
                <Box mt={isMobile ? 0 : 8}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </GradingDetailsProvider>
        ) : null}
      </Container>
    </FullHeightPageLayout>
  )
}
