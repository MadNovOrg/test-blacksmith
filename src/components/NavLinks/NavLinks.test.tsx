import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { RoleName } from '@app/types'

import { render, screen } from '@test/index'

import { NavLinks } from './NavLinks'

describe('component: NavLinks', () => {
  it('renders USER role links', async () => {
    render(
      <MemoryRouter>
        <NavLinks />
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.USER,
          allowedRoles: new Set([RoleName.USER]),
        },
      }
    )

    expect(screen.getAllByRole('link')).toHaveLength(4)
    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const communityLink = screen.getByRole('link', { name: 'Community' })
    expect(communityLink).toBeInTheDocument()
    const membershipLink = screen.getByRole('link', { name: 'Membership' })
    expect(membershipLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', { name: 'Resources' })
    expect(resourcesLink).toBeInTheDocument()
  })

  it('renders TT ADMIN role links', async () => {
    render(
      <MemoryRouter>
        <NavLinks />
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
          allowedRoles: new Set([RoleName.TT_ADMIN]),
        },
      }
    )

    expect(screen.getAllByRole('link')).toHaveLength(7)
    const coursesLink = screen.getByRole('link', { name: 'Manage Courses' })
    expect(coursesLink).toBeInTheDocument()
    const organisationsLink = screen.getByRole('link', {
      name: 'Organisations',
    })
    expect(organisationsLink).toBeInTheDocument()
    const contactsLink = screen.getByRole('link', { name: 'Contacts' })
    expect(contactsLink).toBeInTheDocument()
    const communityLink = screen.getByRole('link', { name: 'Community' })
    expect(communityLink).toBeInTheDocument()
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
    render(
      <MemoryRouter>
        <NavLinks />
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
          allowedRoles: new Set([RoleName.TT_OPS]),
        },
      }
    )

    expect(screen.getAllByRole('link')).toHaveLength(4)
    const organisationsLink = screen.getByRole('link', {
      name: 'Organisations',
    })
    expect(organisationsLink).toBeInTheDocument()
    const communityLink = screen.getByRole('link', { name: 'Community' })
    expect(communityLink).toBeInTheDocument()
    const certificationsLink = screen.getByRole('link', {
      name: 'Certifications',
    })
    expect(certificationsLink).toBeInTheDocument()
    const ordersLink = screen.getByRole('link', { name: 'Orders' })
    expect(ordersLink).toBeInTheDocument()
  })

  it('renders TRAINER role links', async () => {
    render(
      <MemoryRouter>
        <NavLinks />
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          allowedRoles: new Set([RoleName.TRAINER]),
        },
      }
    )

    expect(screen.getAllByRole('link')).toHaveLength(4)
    const coursesLink = screen.getByRole('link', { name: 'My Courses' })
    expect(coursesLink).toBeInTheDocument()
    const communityLink = screen.getByRole('link', { name: 'Community' })
    expect(communityLink).toBeInTheDocument()
    const membershipLink = screen.getByRole('link', {
      name: 'Membership',
    })
    expect(membershipLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', { name: 'Resources' })
    expect(resourcesLink).toBeInTheDocument()
  })

  it('renders UNVERIFIED role links', async () => {
    render(
      <MemoryRouter>
        <NavLinks />
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.UNVERIFIED,
          allowedRoles: new Set([RoleName.UNVERIFIED]),
        },
      }
    )

    expect(screen.getAllByRole('link')).toHaveLength(1)
    const communityLink = screen.getByRole('link', { name: 'Community' })
    expect(communityLink).toBeInTheDocument()
  })

  it('renders SALES REPRESENTATIVE role links', async () => {
    render(
      <MemoryRouter>
        <NavLinks />
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.SALES_REPRESENTATIVE,
          allowedRoles: new Set([RoleName.SALES_REPRESENTATIVE]),
        },
      }
    )

    expect(screen.getAllByRole('link')).toHaveLength(1)
    const communityLink = screen.getByRole('link', { name: 'Community' })
    expect(communityLink).toBeInTheDocument()
  })
})
