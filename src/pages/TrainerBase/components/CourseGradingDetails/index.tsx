import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { FullHeightPage } from '@app/components/FullHeightPage'
import useCourse from '@app/hooks/useCourse'
import { CourseDetailsTabs } from '@app/pages/TrainerBase/components/CourseDetails'
import theme from '@app/theme'
import { LoadingStatus } from '@app/util'

import { CourseGradingSteps } from './CourseGradingSteps'

export const CourseGradingDetails = () => {
  const { id: courseId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const completedSteps = !location.pathname.includes('modules')
    ? []
    : ['attendance']

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
            <Box mb={2}>
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{ marginBottom: 2 }}
                onClick={() =>
                  navigate(
                    `/trainer-base/course/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`
                  )
                }
              >
                {t('pages.course-grading-details.back-button-text')}
              </Button>
            </Box>
            <Box display="flex">
              <Box width={400} display="flex" flexDirection="column" pr={4}>
                <Typography variant="h2" mb={2}>
                  {t('pages.course-grading-details.title')}
                </Typography>
                <Typography variant="h3" mb={5}>
                  {course?.name}
                </Typography>
                <CourseGradingSteps completedSteps={completedSteps} />
              </Box>

              <Box flex={1}>
                <Outlet />
              </Box>
            </Box>
          </>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
