import React from 'react'

import { CourseLevel, RoleName } from '@app/types'

import { render, screen } from '@test/index'

import { NavLinks } from './NavLinks'

describe('component: NavLinks', () => {
  it('renders USER role links', async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
        activeCertificates: [CourseLevel.Level_1],
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const membershipLink = screen.getByRole('link', { name: 'Membership' })
    expect(membershipLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', { name: 'Resources' })
    expect(resourcesLink).toBeInTheDocument()
    const usersLink = screen.queryByRole('link', { name: 'Users' })
    expect(usersLink).not.toBeInTheDocument()
  })

  it("does not render resource and membership if user doesn't have a valid certificate", async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const membershipLink = screen.queryByRole('link', { name: 'Membership' })
    expect(membershipLink).not.toBeInTheDocument()
    const resourcesLink = screen.queryByRole('link', { name: 'Resources' })
    expect(resourcesLink).not.toBeInTheDocument()
    const usersLink = screen.queryByRole('link', { name: 'Users' })
    expect(usersLink).not.toBeInTheDocument()
  })

  it("doesn't render resources link if a trainer doesn't have a valid certificate", () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TRAINER,
        activeCertificates: [],
      },
    })

    expect(
      screen.queryByRole('link', { name: /resources/i })
    ).not.toBeInTheDocument()
  })

  it('renders resources link if a trainer has a valid certificate', () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TRAINER,
        activeCertificates: [CourseLevel.AdvancedTrainer],
      },
    })

    expect(screen.getByRole('link', { name: /resources/i })).toBeInTheDocument()
  })

  it('renders SALES ADMIN role links', async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.SALES_ADMIN,
        allowedRoles: new Set([RoleName.SALES_ADMIN]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'Manage Courses' })
    expect(coursesLink).toBeInTheDocument()
    const usersLink = screen.getByRole('link', {
      name: 'Users',
    })
    expect(usersLink).toBeInTheDocument()
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
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
      },
    })

    const coursesLink = screen.getByRole('link', { name: 'Manage Courses' })
    expect(coursesLink).toBeInTheDocument()
    const usersLink = screen.getByRole('link', {
      name: 'Users',
    })
    expect(usersLink).toBeInTheDocument()
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

    const usersLink = screen.getByRole('link', {
      name: 'Users',
    })
    expect(usersLink).toBeInTheDocument()

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
    const usersLink = screen.queryByRole('link', { name: 'Users' })
    expect(usersLink).not.toBeInTheDocument()
  })
})
