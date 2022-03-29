import React from 'react'
import { MemoryRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import { Typography } from '@mui/material'

import { CreateCourseMenu } from '.'

import { render, userEvent, screen, within, waitForText } from '@test/index'
import { RoleName } from '@app/types'
import { generateRolesUpTo } from '@test/utils'

const CourseTypeMock = () => {
  const [searchParams] = useSearchParams()

  return <Typography>{searchParams.get('type')} form</Typography>
}

describe('components: CreateCourseMenu', () => {
  it('given the user is TT admin, it redirects to the course creation page for the open course', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CreateCourseMenu />} />
          <Route path="/trainer-base/course/new" element={<CourseTypeMock />} />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          allowedRoles: generateRolesUpTo(RoleName.TT_ADMIN),
        },
      }
    )

    userEvent.click(screen.getByText('Create course'))

    userEvent.click(
      within(screen.getByTestId('create-course-options')).getByText(
        'Open course'
      )
    )

    await waitForText('OPEN form')
  })

  it('given the user is TT admin, it redirects to the course creation page for the closed course', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CreateCourseMenu />} />
          <Route path="/trainer-base/course/new" element={<CourseTypeMock />} />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          allowedRoles: generateRolesUpTo(RoleName.TT_ADMIN),
        },
      }
    )

    userEvent.click(screen.getByText('Create course'))

    userEvent.click(
      within(screen.getByTestId('create-course-options')).getByText(
        'Closed course'
      )
    )

    await waitForText('CLOSED form')
  })

  it('given the user is TT admin, it redirects to the course creation page for the indirect course', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CreateCourseMenu />} />
          <Route path="/trainer-base/course/new" element={<CourseTypeMock />} />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          allowedRoles: generateRolesUpTo(RoleName.TT_ADMIN),
        },
      }
    )

    userEvent.click(screen.getByText('Create course'))

    userEvent.click(
      within(screen.getByTestId('create-course-options')).getByText(
        'Indirect course'
      )
    )

    await waitForText('INDIRECT form')
  })

  it("given the user is TT ops, it doesn't display the indirect course creation option", async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CreateCourseMenu />} />
          <Route path="/trainer-base/course/new" element={<CourseTypeMock />} />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          allowedRoles: generateRolesUpTo(RoleName.TT_OPS),
        },
      }
    )

    userEvent.click(screen.getByText('Create course'))

    expect(
      within(screen.getByTestId('create-course-options')).queryByText(
        'Indirect course'
      )
    ).not.toBeInTheDocument()
  })

  it("given the user is a trainer it doesn't display options and navigates to the create course page for indirect course", async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CreateCourseMenu />} />
          <Route path="/trainer-base/course/new" element={<CourseTypeMock />} />
        </Routes>
      </MemoryRouter>,
      { auth: { allowedRoles: generateRolesUpTo(RoleName.TRAINER) } }
    )

    userEvent.click(screen.getByText('Create course'))

    await waitForText('INDIRECT form')
  })
})
