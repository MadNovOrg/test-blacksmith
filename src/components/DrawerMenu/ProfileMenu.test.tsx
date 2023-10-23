import React from 'react'
import { useTranslation } from 'react-i18next'

import { RoleName } from '@app/types'

import { render, renderHook, screen, userEvent, within } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { ProfileMenu } from './ProfileMenu'

describe('component: ProfileMenu', () => {
  const { result } = renderHook(() => useTranslation())
  const {
    current: { t },
  } = result

  it('shows menu items on click', async () => {
    const profile = buildProfile()
    render(<ProfileMenu profile={profile} />)

    const button = screen.getByRole('button', { name: profile.fullName })
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await userEvent.click(button)
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
    await userEvent.click(button)
    const listItems = within(screen.getByRole('list')).getAllByRole('button')
    expect(listItems).toHaveLength(2)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(3)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.verify'))
    expect(listItems[2]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(6)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.admin'))
    expect(listItems[2]).toHaveTextContent(t('common.knowledge-hub'))
    expect(listItems[3]).toHaveTextContent(t('common.events'))
    expect(listItems[4]).toHaveTextContent(t('common.support'))
    expect(listItems[5]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(7)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.verify'))
    expect(listItems[2]).toHaveTextContent(t('common.admin'))
    expect(listItems[3]).toHaveTextContent(t('common.knowledge-hub'))
    expect(listItems[4]).toHaveTextContent(t('common.events'))
    expect(listItems[5]).toHaveTextContent(t('common.support'))
    expect(listItems[6]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(6)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.admin'))
    expect(listItems[2]).toHaveTextContent(t('common.knowledge-hub'))
    expect(listItems[3]).toHaveTextContent(t('common.events'))
    expect(listItems[4]).toHaveTextContent(t('common.support'))
    expect(listItems[5]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(7)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.verify'))
    expect(listItems[2]).toHaveTextContent(t('common.admin'))
    expect(listItems[3]).toHaveTextContent(t('common.knowledge-hub'))
    expect(listItems[4]).toHaveTextContent(t('common.events'))
    expect(listItems[5]).toHaveTextContent(t('common.support'))
    expect(listItems[6]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(2)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(3)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.verify'))
    expect(listItems[2]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(6)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.admin'))
    expect(listItems[2]).toHaveTextContent(t('common.knowledge-hub'))
    expect(listItems[3]).toHaveTextContent(t('common.events'))
    expect(listItems[4]).toHaveTextContent(t('common.support'))
    expect(listItems[5]).toHaveTextContent(t('common.logout'))
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
    expect(listItems).toHaveLength(7)
    expect(listItems[0]).toHaveTextContent(t('common.my-profile'))
    expect(listItems[1]).toHaveTextContent(t('common.verify'))
    expect(listItems[2]).toHaveTextContent(t('common.admin'))
    expect(listItems[3]).toHaveTextContent(t('common.knowledge-hub'))
    expect(listItems[4]).toHaveTextContent(t('common.events'))
    expect(listItems[5]).toHaveTextContent(t('common.support'))
    expect(listItems[6]).toHaveTextContent(t('common.logout'))
  })
})
