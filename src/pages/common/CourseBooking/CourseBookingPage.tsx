import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { BookingProvider, useBooking } from './components/BookingContext'
import { CourseBookingDetails } from './components/CourseBookingDetails'
import { CourseBookingDone } from './components/CourseBookingDone'
import { CourseBookingLayout } from './components/CourseBookingLayout'
import { CourseBookingReview } from './components/CourseBookingReview'

const BookingRoutes: React.FC = () => {
  const { booking } = useBooking()

  return (
    <Routes>
      <Route element={<CourseBookingLayout />}>
        <Route index element={<Navigate to="details" replace />} />

        <Route path="details" element={<CourseBookingDetails />} />

        {booking.emails.length ? (
          <Route path="review" element={<CourseBookingReview />} />
        ) : null}

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
    <BookingProvider>
      <BookingRoutes />
    </BookingProvider>
  )
}
