import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { BookingProvider, useBooking } from './components/BookingContext'
import { CourseBookingDetails } from './components/CourseBookingDetails'
import { CourseBookingLayout } from './components/CourseBookingLayout'
import { CourseBookingPayment } from './components/CourseBookingPayment'
import { CourseBookingReview } from './components/CourseBookingReview'
import { CourseFull } from './components/CourseFull'

const BookingRoutes: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { booking, availableSeats, course, error, isBooked } = useBooking()

  if (error) {
    return <Typography>{error}</Typography>
  }

  if (!isBooked && !availableSeats) {
    return <CourseFull courseId={course.id} />
  }

  return (
    <Routes>
      <Route element={<CourseBookingLayout />}>
        <Route index element={<Navigate to="details" replace />} />

        <Route path="details" element={<CourseBookingDetails />} />

        {booking.emails?.length ? (
          <Route path="review" element={<CourseBookingReview />} />
        ) : null}

        <Route path="payment/:orderId" element={<CourseBookingPayment />} />
      </Route>
    </Routes>
  )
}

export const CourseBookingPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  return (
    <Box bgcolor="grey.100">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <BookingProvider>
          <BookingRoutes />
        </BookingProvider>
      </Container>
    </Box>
  )
}
