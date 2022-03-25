import React from 'react'
import { Box, Typography, Container } from '@mui/material'
import { t } from 'i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { FullHeightPage } from '@app/components/FullHeightPage'
import { BackButton } from '@app/components/BackButton'

import { CreateCourseSteps } from './components/CreateCourseSteps'

import theme from '@app/theme'

export const CreateCourse = () => {
  const location = useLocation()

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
            <Typography variant="h2" mb={7}>
              {t('pages.create-course.title')}
            </Typography>
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
