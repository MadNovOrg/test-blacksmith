import React from 'react'

import { render, screen, within, chance } from '@test/index'

import { Avatar } from './Avatar'

const givenName = () => chance.first()
const familyName = () => chance.last().replace(' ', '')

describe('component: Avatar', () => {
  it('renders as expected without props', async () => {
    const { container } = render(<Avatar />)

    const avatar = container.querySelector('.MuiAvatar-root')
    expect(avatar).toBeInTheDocument()
    expect(
      within(avatar as HTMLElement).getByTestId('PersonIcon')
    ).toBeInTheDocument()
  })

  it('renders image from src provided', async () => {
    const img = chance.url()

    const { container } = render(<Avatar src={img} />)

    const avatarImg = container.querySelector(`[src="${img}"]`)
    expect(avatarImg).toBeInTheDocument()
  })

  it('renders image from src provided even if name is provided', async () => {
    const img = chance.url()
    const [firstName, lastName] = [givenName(), familyName()]
    const initials = `${firstName[0]}${lastName[0]}`

    const { container } = render(<Avatar src={img} />)

    const avatarImg = container.querySelector(`[src="${img}"]`)
    expect(avatarImg).toBeInTheDocument()
    expect(screen.queryByText(initials)).toBeNull()
  })

  describe('renders initials when src is missing', () => {
    it('supports names with first and last', async () => {
      const [firstName, lastName] = [givenName(), familyName()]
      const initials = `${firstName[0]}${lastName[0]}`

      render(<Avatar name={`${firstName} ${lastName}`} />)

      expect(screen.queryByText(initials)).toBeInTheDocument()
    })

    it('supports names with first, middle and last', async () => {
      const [firstName, lastName] = [givenName(), familyName()]
      const initials = `${firstName[0]}${lastName[0]}`

      render(<Avatar name={`${firstName} ??? ${lastName}`} />)

      expect(screen.queryByText(initials)).toBeInTheDocument()
    })

    it('supports single names', async () => {
      const [firstName] = [givenName()]
      const initials = firstName[0]

      render(<Avatar name={firstName} />)

      expect(screen.queryByText(initials)).toBeInTheDocument()
    })
  })
})
