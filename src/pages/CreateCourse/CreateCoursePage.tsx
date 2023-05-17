import { Box, Typography, Container } from '@mui/material'
import { t } from 'i18next'
import React, { useMemo } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import theme from '@app/theme'
import { CourseType } from '@app/types'

import { NotFound } from '../common/NotFound'

import { useCreateCourse } from './components/CreateCourseProvider'
import { CreateCourseSteps } from './components/CreateCourseSteps'

export const CreateCoursePage = () => {
  const [searchParams] = useSearchParams()
  const { acl } = useAuth()
  const { completedSteps, courseData, currentStepKey } = useCreateCourse()

  const courseType = useMemo(() => {
    const qsType = (searchParams.get('type') as CourseType) ?? CourseType.OPEN
    return courseData?.type ?? qsType
  }, [courseData, searchParams])

  if (!acl.canCreateCourse(courseType)) {
    return <NotFound />
  }

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box display="flex">
          <Box width={400} display="flex" flexDirection="column" pr={4}>
            <Sticky top={20}>
              <Box mb={2}>
                <BackButton
                  label={t('pages.create-course.back-button-text')}
                  to="/courses"
                />
              </Box>
              <Box mb={7}>
                <Typography variant="h2" mb={2}>
                  {t(`pages.create-course.${courseType}-course-title`)}
                </Typography>
              </Box>

              <CreateCourseSteps
                completedSteps={completedSteps ?? []}
                type={courseType}
                currentStepKey={currentStepKey ?? undefined}
                blendedLearning={courseData?.blendedLearning ?? false}
              />
            </Sticky>
          </Box>

          <Box flex={1}>
            <Box mt={8}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
