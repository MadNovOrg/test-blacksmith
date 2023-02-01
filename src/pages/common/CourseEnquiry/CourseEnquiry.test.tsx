import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { gqlRequest } from '@app/lib/gql-request'
import insertEnquiry from '@app/queries/booking/insert-enquiry'
import { CourseType } from '@app/types'

import { screen, render, userEvent, waitFor, waitForCalls } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { sectors } from '../CourseBooking/components/org-data'

import { CourseEnquiry } from '.'

jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/lib/gql-request')

const gqlRequestMocked = jest.mocked(gqlRequest)

function fillForm() {
  const data = {
    interest: 'Course',
    firstName: 'John',
    lastName: 'Doe',
    email: 'example@example.com',
    orgName: 'Org example',
    phone: '1111111111',
    sector: sectors.edu,
    source: 'Facebook',
    message: 'Message',
  }

  userEvent.type(
    screen.getByLabelText('What is your interest? *'),
    data.interest
  )
  userEvent.type(screen.getByLabelText('First Name *'), data.firstName)
  userEvent.type(screen.getByLabelText('Last Name *'), data.lastName)
  userEvent.type(screen.getByLabelText('Work email *'), data.email)
  userEvent.type(screen.getByLabelText('Organisation Name *'), data.orgName)
  userEvent.type(screen.getByLabelText('Phone *'), data.phone)

  userEvent.click(screen.getByLabelText('Sector'))
  userEvent.click(screen.getByText(data.sector))

  userEvent.click(
    screen.getByLabelText('How did you hear about us? (optional)')
  )
  userEvent.click(screen.getByText(data.source))

  userEvent.type(screen.getByLabelText('Message (optional)'), data.message)

  return data
}

describe('page: CourseEnquiry', () => {
  it('saves the course enquiry', async () => {
    gqlRequestMocked.mockResolvedValue({
      insert_course_enquiry: {
        affected_rows: 1,
      },
    })

    const openCourse = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })

    render(
      <Routes>
        <Route path="/enquiry" element={<CourseEnquiry />} />
      </Routes>,
      {},
      { initialEntries: [`/enquiry?course_id=${openCourse.id}`] }
    )

    fillForm()

    userEvent.click(screen.getByTestId('btn-submit'))

    await waitForCalls(gqlRequestMocked, 1)

    expect(gqlRequestMocked).toHaveBeenCalledWith(insertEnquiry, {
      enquiry: expect.objectContaining({ courseId: Number(openCourse.id) }),
    })

    expect(screen.getByText('Thank you for your enquiry')).toBeInTheDocument()
  })

  it('displays not found page if there is no query param for course id', () => {
    render(
      <Routes>
        <Route path="/enquiry" element={<CourseEnquiry />} />
      </Routes>,
      {},
      { initialEntries: ['/enquiry'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('validates the form', async () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })

    render(
      <Routes>
        <Route path="/enquiry" element={<CourseEnquiry />} />
      </Routes>,
      {},
      { initialEntries: [`/enquiry?course_id=${openCourse.id}`] }
    )

    userEvent.type(screen.getByLabelText('Work email *'), 'test.com')
    userEvent.click(screen.getByTestId('btn-submit'))

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

  it("displays an error message if course enquiry wasn't saved", async () => {
    gqlRequestMocked.mockRejectedValue(new Error())

    const openCourse = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })

    render(
      <Routes>
        <Route path="/enquiry" element={<CourseEnquiry />} />
      </Routes>,
      {},
      { initialEntries: [`/enquiry?course_id=${openCourse.id}`] }
    )

    fillForm()

    userEvent.click(screen.getByTestId('btn-submit'))

    await waitForCalls(gqlRequestMocked, 1)

    expect(
      screen.getByText('There was an error saving the enquiry')
    ).toBeInTheDocument()
  })
})
