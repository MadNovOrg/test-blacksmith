import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { gqlRequest } from '@app/lib/gql-request'
import insertBookPrivateCourse from '@app/queries/booking/insert-book-private-course'
import { CourseType } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { sectors } from '../CourseBooking/components/org-data'

import { BookPrivateCourse } from '.'

jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/lib/gql-request')

const gqlRequestMocked = jest.mocked(gqlRequest)

async function fillForm() {
  const data = {
    numParticipants: 5,
    firstName: 'John',
    lastName: 'Doe',
    email: 'example@example.com',
    orgName: 'Org example',
    phone: '1234567890',
    sector: sectors.edu,
    source: 'Facebook',
    message: 'Message',
  }

  await userEvent.type(
    screen.getByLabelText('Number of course participants'),
    String(data.numParticipants)
  )
  await userEvent.type(screen.getByLabelText('First Name *'), data.firstName)
  await userEvent.type(screen.getByLabelText('Last Name *'), data.lastName)
  await userEvent.type(screen.getByLabelText('Work email *'), data.email)
  await userEvent.type(
    screen.getByLabelText('Organisation Name *'),
    data.orgName
  )
  await userEvent.type(screen.getByLabelText('Phone *'), data.phone)

  await userEvent.click(screen.getByLabelText('Sector *'))
  await userEvent.click(screen.getByText(data.sector))

  await userEvent.click(
    screen.getByLabelText('How did you hear about us? (optional)')
  )
  await userEvent.click(screen.getByText(data.source))

  await userEvent.type(
    screen.getByLabelText('Message (optional)'),
    data.message
  )

  return data
}

describe('page: BookPrivateCourse', () => {
  it('saves the booking', async () => {
    gqlRequestMocked.mockResolvedValue({
      insert_private_course_booking: {
        affected_rows: 1,
      },
    })

    const openCourse = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    render(
      <Routes>
        <Route path="/book-private-course" element={<BookPrivateCourse />} />
      </Routes>,
      {},
      { initialEntries: [`/book-private-course?course_id=${openCourse.id}`] }
    )

    await fillForm()

    await userEvent.click(screen.getByTestId('btn-submit'))

    await waitFor(() => {
      expect(gqlRequestMocked).toHaveBeenCalledTimes(1)

      expect(gqlRequestMocked).toHaveBeenCalledWith(insertBookPrivateCourse, {
        booking: expect.objectContaining({ courseId: Number(openCourse.id) }),
      })

      expect(screen.getByText('Thank you for your enquiry')).toBeInTheDocument()
    })
  })

  it('displays not found page if there is no query param for course id', () => {
    render(
      <Routes>
        <Route path="/book-private-course" element={<BookPrivateCourse />} />
      </Routes>,
      {},
      { initialEntries: ['/book-private-course'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('validates the form', async () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    render(
      <Routes>
        <Route path="/book-private-course" element={<BookPrivateCourse />} />
      </Routes>,
      {},
      { initialEntries: [`/book-private-course?course_id=${openCourse.id}`] }
    )

    await userEvent.type(screen.getByLabelText('Work email *'), 'test.com')
    await userEvent.click(screen.getByTestId('btn-submit'))

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument()
      expect(screen.getByText('Phone is required')).toBeInTheDocument()
      expect(
        screen.getByText('Organisation name is required')
      ).toBeInTheDocument()
      expect(screen.getByText('Sector is required')).toBeInTheDocument()
    })
  })

  it("displays an error message if course booking wasn't saved", async () => {
    gqlRequestMocked.mockRejectedValue(new Error())

    const openCourse = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    render(
      <Routes>
        <Route path="/book-private-course" element={<BookPrivateCourse />} />
      </Routes>,
      {},
      { initialEntries: [`/book-private-course?course_id=${openCourse.id}`] }
    )

    await fillForm()

    await userEvent.click(screen.getByTestId('btn-submit'))

    await waitFor(() => {
      expect(gqlRequestMocked).toHaveBeenCalledTimes(1)

      expect(
        screen.getByText('There was an error saving the enquiry')
      ).toBeInTheDocument()
    })
  })
})
