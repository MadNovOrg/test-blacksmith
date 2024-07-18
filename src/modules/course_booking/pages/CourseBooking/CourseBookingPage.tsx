import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Accreditors_Enum } from '@app/generated/graphql'
import { NotFound } from '@app/modules/not_found/pages/NotFound'

import { BookingContainer } from '../../components/BookingContainer'
import { BookingProvider, useBooking } from '../../components/BookingContext'
import { CourseBookingDetails } from '../../components/CourseBookingDetails'
import { CourseBookingLayout } from '../../components/CourseBookingLayout'
import { CourseBookingPayment } from '../../components/CourseBookingPayment'
import { CourseBookingReview } from '../../components/CourseBookingReview'
import { CourseFull } from '../../components/CourseFull'

const BookingRoutes: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { booking, availableSeats, course, error, isBooked, internalBooking } =
    useBooking()

  if (
    (course?.accreditedBy === Accreditors_Enum.Bild && !internalBooking) ||
    error
  ) {
    return <NotFound />
  }

  if (!isBooked && !availableSeats) {
    return (
      <BookingContainer>
        <CourseFull courseId={course?.id || 0} />
      </BookingContainer>
    )
  }

  return (
    <BookingContainer>
      <Routes>
        <Route element={<CourseBookingLayout />}>
          <Route path="details" element={<CourseBookingDetails />} />

          {booking.participants?.length ? (
            <Route path="review" element={<CourseBookingReview />} />
          ) : null}

          <Route path="payment/:orderId" element={<CourseBookingPayment />} />
        </Route>
      </Routes>
    </BookingContainer>
  )
}

export const CourseBookingPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  return (
    <BookingProvider>
      <BookingRoutes />
    </BookingProvider>
  )
}
