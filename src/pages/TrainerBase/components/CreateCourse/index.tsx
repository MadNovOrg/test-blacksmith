import { Box, Typography, Container } from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import theme from '@app/theme'
import { CourseType } from '@app/types'

import { CreateCourseSteps } from './components/CreateCourseSteps'

export const CreateCourse = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const courseType = (searchParams.get('type') as CourseType) ?? CourseType.OPEN

  const completedSteps = !location.pathname.includes('assign-trainer')
    ? []
    : ['course-details']

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box mb={2}>
          <BackButton
            label={t('pages.create-course.back-button-text')}
            to="/trainer-base/course"
          />
        </Box>
        <Box display="flex">
          <Box width={400} display="flex" flexDirection="column" pr={4}>
            <Box mb={7}>
              <Typography variant="h2" mb={2}>
                {t(`pages.create-course.${courseType}-course-title`)}
              </Typography>

              <Typography color={theme.palette.grey[700]}>
                {t('pages.create-course.validation-notice')}
              </Typography>
            </Box>

            <CreateCourseSteps completedSteps={completedSteps} />
          </Box>

          <Box flex={1}>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
