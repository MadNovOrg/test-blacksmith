import React from 'react'

import { RoleName } from '@app/types'

import { render, screen, userEvent, within } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { ProfileMenu } from './ProfileMenu'

describe('component: ProfileMenu', () => {
  it('renders verified USER role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
        verified: true,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = ['My Profile', 'Help Centre', 'Logout']

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders unverified USER role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
        verified: false,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = ['My Profile', 'Verify', 'Help Centre', 'Logout']
    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders verified TT ADMIN role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
        verified: true,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = [
      'My Profile',
      'Administrator',
      'Help Centre',
      'Knowledge Hub',
      'Events',
      'Support',
      'Logout',
    ]

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders unverified TT ADMIN role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
        verified: false,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = [
      'My Profile',
      'Verify',
      'Administrator',
      'Help Centre',
      'Knowledge Hub',
      'Events',
      'Support',
      'Logout',
    ]

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders verified TT OPS role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.TT_OPS,
        allowedRoles: new Set([RoleName.TT_OPS]),
        verified: true,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = [
      'My Profile',
      'Administrator',
      'Help Centre',
      'Knowledge Hub',
      'Events',
      'Support',
      'Logout',
    ]

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders unverified TT OPS role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.TT_OPS,
        allowedRoles: new Set([RoleName.TT_OPS]),
        verified: false,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = [
      'My Profile',
      'Verify',
      'Administrator',
      'Help Centre',
      'Knowledge Hub',
      'Events',
      'Support',
      'Logout',
    ]

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders verified TRAINER role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.TRAINER,
        allowedRoles: new Set([RoleName.TRAINER]),
        verified: true,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = ['My Profile', 'Help Centre', 'Logout']

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders unverified TRAINER role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.TRAINER,
        allowedRoles: new Set([RoleName.TRAINER]),
        verified: false,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = ['My Profile', 'Verify', 'Help Centre', 'Logout']

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders verified SALES REPRESENTATIVE role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.SALES_REPRESENTATIVE,
        allowedRoles: new Set([RoleName.SALES_REPRESENTATIVE]),
        verified: true,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = [
      'My Profile',
      'Administrator',
      'Help Centre',
      'Knowledge Hub',
      'Events',
      'Support',
      'Logout',
    ]

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })

  it('renders unverified SALES REPRESENTATIVE role items', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />, {
      auth: {
        activeRole: RoleName.SALES_REPRESENTATIVE,
        allowedRoles: new Set([RoleName.SALES_REPRESENTATIVE]),
        verified: false,
      },
    })

    const button = screen.getByRole('button', { name: profile.fullName })
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')

    const items = [
      'My Profile',
      'Verify',
      'Administrator',
      'Help Centre',
      'Knowledge Hub',
      'Events',
      'Support',
      'Logout',
    ]

    expect(listItems).toHaveLength(items.length)

    items.forEach((item, index) => {
      expect(listItems[index]).toHaveTextContent(item)
    })
  })
})
