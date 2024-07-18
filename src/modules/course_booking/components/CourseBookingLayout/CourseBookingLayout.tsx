import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { Sticky } from '@app/components/Sticky'
import { PaymentMethod } from '@app/generated/graphql'

import { useBooking } from '../BookingContext'

const completedMap = {
  details: [],
  review: ['details'],
  payment: ['details', 'review'],
  done: ['details', 'review', 'payment'],
}

export const CourseBookingLayout: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { error, booking } = useBooking()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
      booking.paymentMethod === PaymentMethod.Cc
        ? { key: 'payment', label: t('pages.book-course.step-3') }
        : null,
    ].filter(Boolean)
  }, [t, booking])

  const curPage = useMemo(() => {
    return location.pathname.split('/')[2] as keyof typeof completedMap
  }, [location])

  return (
    <Box flex={1} display="flex" flexDirection={isMobile ? 'column' : 'row'}>
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
            currentStepKey={curPage}
            steps={steps}
            data-testid="create-course-nav"
          />
        </Sticky>
      </Box>

      <Box flex={1}>{error ? error : <Outlet />}</Box>
    </Box>
  )
}
