import React from 'react'

import { RoleName } from '@app/types'

import { render, screen } from '@test/index'

import { NavLinks } from './NavLinks'

describe('component: NavLinks', () => {
  it('renders USER role links', async () => {
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

  it('renders TT ADMIN role links', async () => {
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
