import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { BookingProvider, useBooking } from './components/BookingContext'
import { CourseBookingDetails } from './components/CourseBookingDetails'
import { CourseBookingDone } from './components/CourseBookingDone'
import { CourseBookingLayout } from './components/CourseBookingLayout'
import { CourseBookingReview } from './components/CourseBookingReview'

const BookingRoutes: React.FC = () => {
  const { booking, orderId } = useBooking()

  if (orderId) {
    return (
      <Routes>
        <Route element={<CourseBookingLayout />}>
          <Route path="done" element={<CourseBookingDone />} />
        </Route>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<CourseBookingLayout />}>
        <Route index element={<Navigate to="details" replace />} />

        <Route path="details" element={<CourseBookingDetails />} />

        {booking.emails?.length ? (
          <Route path="review" element={<CourseBookingReview />} />
        ) : null}
      </Route>
    </Routes>
  )
}

export const CourseBookingPage: React.FC = () => {
  return (
    <BookingProvider>
      <BookingRoutes />
    </BookingProvider>
  )
}
