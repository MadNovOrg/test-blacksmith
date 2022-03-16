import React from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import useCourse from '@app/hooks/useCourse'

import { CourseGradingSteps } from './CourseGradingSteps'

import { LoadingStatus } from '@app/util'
import theme from '@app/theme'

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
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        minHeight: 'calc(100vh - 114px)',
      }}
    >
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
                  navigate(`/trainer-base/course/${courseId}/participants`)
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
    </Box>
  )
}
