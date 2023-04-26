import React from 'react'
import useSWR from 'swr'

import { RoleName } from '@app/types'

import { render, screen } from '@test/index'

import { NavLinks } from './NavLinks'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)

function registerMocks(certificateCount: number, courseCount: number) {
  useSWRMock.mockReturnValueOnce({
    data: {
      certificates: { aggregate: { count: certificateCount } },
      participant: { aggregate: { count: courseCount } },
    },
    mutate: jest.fn(),
    isValidating: false,
    error: null,
    isLoading: false,
  })
}

describe('component: NavLinks', () => {
  it('renders USER role links', async () => {
    registerMocks(2, 1)

    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const membershipLink = screen.getByRole('link', { name: 'Membership' })
    expect(membershipLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', { name: 'Resources' })
    expect(resourcesLink).toBeInTheDocument()
  })

  it('do not render resource if user do not have 0 course and 0 certificates', async () => {
    registerMocks(0, 0)

    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const membershipLink = screen.getByRole('link', { name: 'Membership' })
    expect(membershipLink).toBeInTheDocument()
    const resourcesLink = screen.queryByRole('link', { name: 'Resources' })
    expect(resourcesLink).not.toBeInTheDocument()
  })

  it('renders SALES ADMIN role links', async () => {
    registerMocks(2, 1)

    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.SALES_ADMIN,
        allowedRoles: new Set([RoleName.SALES_ADMIN]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'Manage Courses' })
    expect(coursesLink).toBeInTheDocument()
    expect(coursesLink).toBeInTheDocument()
    const organisationsLink = screen.getByRole('link', {
      name: 'Organisations',
    })
    expect(organisationsLink).toBeInTheDocument()
    const certificationsLink = screen.getByRole('link', {
      name: 'Certifications',
    })
    expect(certificationsLink).toBeInTheDocument()
    const ordersLink = screen.getByRole('link', { name: 'Orders' })
    expect(ordersLink).toBeInTheDocument()
  })

  it('renders TT ADMIN role links', async () => {
    registerMocks(2, 1)

    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'Manage Courses' })
    expect(coursesLink).toBeInTheDocument()
    const organisationsLink = screen.getByRole('link', {
      name: 'Organisations',
    })
    expect(organisationsLink).toBeInTheDocument()
    const certificationsLink = screen.getByRole('link', {
      name: 'Certifications',
    })
    expect(certificationsLink).toBeInTheDocument()
    const ordersLink = screen.getByRole('link', { name: 'Orders' })
    expect(ordersLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', { name: 'Resources' })
    expect(resourcesLink).toBeInTheDocument()
  })

  it('renders TT OPS role links', async () => {
    registerMocks(2, 1)

    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TT_OPS,
        allowedRoles: new Set([RoleName.TT_OPS]),
      },
    })

    const organisationsLink = screen.getByRole('link', {
      name: 'Organisations',
    })
    expect(organisationsLink).toBeInTheDocument()

    const certificationsLink = screen.getByRole('link', {
      name: 'Certifications',
    })
    expect(certificationsLink).toBeInTheDocument()
    const ordersLink = screen.getByRole('link', { name: 'Orders' })
    expect(ordersLink).toBeInTheDocument()
  })

  it('renders TRAINER role links', async () => {
    registerMocks(2, 1)

    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TRAINER,
        allowedRoles: new Set([RoleName.TRAINER]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const membershipLink = screen.getByRole('link', {
      name: 'Membership',
    })
    expect(membershipLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', { name: 'Resources' })
    expect(resourcesLink).toBeInTheDocument()
  })
})
