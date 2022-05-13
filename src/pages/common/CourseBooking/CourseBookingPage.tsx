import { Box, Container } from '@mui/material'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { BookingProvider, useBooking } from './components/BookingContext'
import { CourseBookingDetails } from './components/CourseBookingDetails'
import { CourseBookingDone } from './components/CourseBookingDone'
import { CourseBookingLayout } from './components/CourseBookingLayout'
import { CourseBookingPayment } from './components/CourseBookingPayment'
import { CourseBookingReview } from './components/CourseBookingReview'
import { CourseFull } from './components/CourseFull'

const BookingRoutes: React.FC = () => {
  const { booking, availableSeats, course } = useBooking()

  if (!availableSeats) {
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

        {/** TODO: constant condition for now but will be replaced with actual one when we start placing orders */}
        {Date.now() > 0 ? (
          <Route path="done" element={<CourseBookingDone />} />
        ) : null}
      </Route>
    </Routes>
  )
}

export const CourseBookingPage: React.FC = () => {
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
