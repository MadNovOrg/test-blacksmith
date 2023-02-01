import { Typography } from '@mui/material'
import React from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'

import { RoleName } from '@app/types'

import { render, userEvent, screen, within, waitFor } from '@test/index'
import { generateRolesUpTo } from '@test/utils'

import { CreateCourseMenu } from '.'

const CourseTypeMock = () => {
  const [searchParams] = useSearchParams()

  return <Typography>{searchParams.get('type')} form</Typography>
}

describe('components: CreateCourseMenu', () => {
  it('given the user is TT admin, it redirects to the course creation page for the open course', async () => {
    render(
      <Routes>
        <Route path="/" element={<CreateCourseMenu />} />
        <Route path="/courses/new" element={<CourseTypeMock />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: ['/'] }
    )

    userEvent.click(screen.getByText('Create course'))

    userEvent.click(
      within(screen.getByTestId('create-course-options')).getByText(
        'Open course'
      )
    )

    await waitFor(() =>
      expect(screen.getByText('OPEN form')).toBeInTheDocument()
    )
  })

  it('given the user is TT admin, it redirects to the course creation page for the closed course', async () => {
    render(
      <Routes>
        <Route path="/" element={<CreateCourseMenu />} />
        <Route path="/courses/new" element={<CourseTypeMock />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },

      { initialEntries: ['/'] }
    )

    userEvent.click(screen.getByText('Create course'))

    userEvent.click(
      within(screen.getByTestId('create-course-options')).getByText(
        'Closed course'
      )
    )

    await waitFor(async () => {
      expect(screen.getByText('CLOSED form')).toBeInTheDocument()
    })
  })

  it('given the user is TT admin, it redirects to the course creation page for the indirect course', async () => {
    render(
      <Routes>
        <Route path="/" element={<CreateCourseMenu />} />
        <Route path="/courses/new" element={<CourseTypeMock />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: ['/'] }
    )

    userEvent.click(screen.getByText('Create course'))

    userEvent.click(
      within(screen.getByTestId('create-course-options')).getByText(
        'Indirect course'
      )
    )

    await waitFor(() => {
      expect(screen.getByText('INDIRECT form')).toBeInTheDocument()
    })
  })

  it("given the user is TT ops, it doesn't display the indirect course creation option", async () => {
    render(
      <Routes>
        <Route path="/" element={<CreateCourseMenu />} />
        <Route path="/courses/new" element={<CourseTypeMock />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      },
      { initialEntries: ['/'] }
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
      <Routes>
        <Route path="/" element={<CreateCourseMenu />} />
        <Route path="/courses/new" element={<CourseTypeMock />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          allowedRoles: generateRolesUpTo(RoleName.TRAINER),
        },
      },
      { initialEntries: ['/'] }
    )

    userEvent.click(screen.getByText('Create course'))

    await waitFor(() => {
      expect(screen.getByText('INDIRECT form')).toBeInTheDocument()
    })
  })
})
