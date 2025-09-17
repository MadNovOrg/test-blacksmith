import React from 'react'

import { _render, screen, within, chance } from '@test/index'

import { Avatar } from './Avatar'

describe('component: Avatar', () => {
  it('renders as expected without props', async () => {
    const { container } = _render(<Avatar />)

    const avatar = container.querySelector('.MuiAvatar-root')
    expect(avatar).toBeInTheDocument()
    expect(
      within(avatar as HTMLElement).getByTestId('PersonIcon'),
    ).toBeInTheDocument()
  })

  it('renders image from src provided', async () => {
    const img = chance.url()

    const { container } = _render(<Avatar src={img} />)

    const avatarImg = container.querySelector(`[src="${img}"]`)
    expect(avatarImg).toBeInTheDocument()
  })

  it('renders image from src provided even if name is provided', async () => {
    const img = chance.url()
    const [firstName, lastName] = ['John', 'Doe']
    const initials = `${firstName[0]}${lastName[0]}`

    const { container } = _render(<Avatar src={img} />)

    const avatarImg = container.querySelector(`[src="${img}"]`)
    expect(avatarImg).toBeInTheDocument()
    expect(screen.queryByText(initials)).not.toBeInTheDocument()
  })

  describe('renders initials when src is missing', () => {
    it('supports names with first and last', async () => {
      const [firstName, lastName] = ['John', 'Doe']
      const initials = `${firstName[0]}${lastName[0]}`

      _render(<Avatar name={`${firstName} ${lastName}`} />)

      expect(screen.getByText(initials)).toBeInTheDocument()
    })

    it('supports names with first, middle and last', async () => {
      const [firstName, lastName] = ['John', 'Doe']
      const initials = `${firstName[0]}${lastName[0]}`

      _render(<Avatar name={`${firstName} ${lastName}`} />)

      expect(screen.getByText(initials)).toBeInTheDocument()
    })

    it('supports single names', async () => {
      const [firstName] = ['John', 'Doe']
      const initials = firstName[0]

      _render(<Avatar name={firstName} />)

      expect(screen.getByText(initials)).toBeInTheDocument()
    })
  })
})
