import React from 'react'

import { RoleName } from '@app/types'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { ProfileMenu } from './ProfileMenu'

describe('component: ProfileMenu', () => {
  it('shows menu items on click', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />)

    const button = screen.getByRole('button', { name: profile.fullName })
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await waitFor(() => userEvent.click(button))
    expect(screen.queryByRole('list')).toBeInTheDocument()
  })

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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(3)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Notifications')
    expect(listItems[2]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(4)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Verify')
    expect(listItems[2]).toHaveTextContent('Notifications')
    expect(listItems[3]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(4)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Administrator')
    expect(listItems[2]).toHaveTextContent('Notifications')
    expect(listItems[3]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(5)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Verify')
    expect(listItems[2]).toHaveTextContent('Administrator')
    expect(listItems[3]).toHaveTextContent('Notifications')
    expect(listItems[4]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(4)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Administrator')
    expect(listItems[2]).toHaveTextContent('Notifications')
    expect(listItems[3]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(5)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Verify')
    expect(listItems[2]).toHaveTextContent('Administrator')
    expect(listItems[3]).toHaveTextContent('Notifications')
    expect(listItems[4]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(3)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Notifications')
    expect(listItems[2]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(4)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Verify')
    expect(listItems[2]).toHaveTextContent('Notifications')
    expect(listItems[3]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(3)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Notifications')
    expect(listItems[2]).toHaveTextContent('Logout')
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
    await waitFor(() => userEvent.click(button))
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(4)
    expect(listItems[0]).toHaveTextContent('My Profile')
    expect(listItems[1]).toHaveTextContent('Verify')
    expect(listItems[2]).toHaveTextContent('Notifications')
    expect(listItems[3]).toHaveTextContent('Logout')
  })
})
