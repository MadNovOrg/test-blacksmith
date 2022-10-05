import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import useCourse from '@app/hooks/useCourse'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import theme from '@app/theme'
import { LoadingStatus } from '@app/util'

import { CourseGradingSteps } from './CourseGradingSteps'

export const CourseGradingDetails = () => {
  const { id: courseId } = useParams()
  const { t } = useTranslation()
  const location = useLocation()

  const onModulesStep = location.pathname.includes('modules')

  const currentStepKey = onModulesStep ? 'modules' : 'grading-clearance'

  const completedSteps = onModulesStep ? ['grading-clearance'] : ['']

  const { data: course, status } = useCourse(courseId ?? '')

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
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
          <Alert severity="error">
            {t('pages.course-grading-details.course-error-alert-text')}
          </Alert>
        ) : null}
        {course ? (
          <>
            <Box display="flex">
              <Box width={400} display="flex" flexDirection="column" pr={4}>
                <Sticky top={20}>
                  <Box mb={2}>
                    <BackButton
                      to={`/courses/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`}
                      label={t('pages.course-grading-details.back-button-text')}
                    />
                  </Box>
                  <Typography variant="h2" mb={2}>
                    {t('pages.course-grading-details.title')}
                  </Typography>
                  <Typography variant="h3" mb={5} fontWeight="600">
                    {course?.name}
                  </Typography>
                  <CourseGradingSteps
                    completedSteps={completedSteps}
                    currentStepKey={currentStepKey}
                  />
                </Sticky>
              </Box>

              <Box flex={1}>
                <Box mt={'6px'}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
