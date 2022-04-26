import { Box, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { Sticky } from '@app/components/Sticky'
import { UnverifiedLayout } from '@app/components/UnverifiedLayout'

const completedMap = {
  details: [],
  review: ['details'],
  done: ['details', 'review'],
}

export const CourseBookingLayout: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const steps = useMemo(() => {
    return [
      {
        key: 'details',
        label: t('pages.book-course.step-1'),
      },
      {
        key: 'review',
        label: t('pages.book-course.step-2'),
      },
    ]
  }, [t])

  const curPage = useMemo(() => {
    return location.pathname.split('/').pop() as keyof typeof completedMap
  }, [location])

  return (
    <UnverifiedLayout>
      <Box flex={1} display="flex">
        <Box width={300} display="flex" flexDirection="column" pr={4}>
          <Sticky top={20}>
            <Box mb={7}>
              <Typography variant="h2" mb={2}>
                {t('pages.book-course.title')}
              </Typography>

              <Typography color="grey.700">{t('validation-notice')}</Typography>
            </Box>

            <StepsNavigation
              completedSteps={completedMap[curPage]}
              steps={steps}
              data-testid="create-course-nav"
            />
          </Sticky>
        </Box>

        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </UnverifiedLayout>
  )
}
