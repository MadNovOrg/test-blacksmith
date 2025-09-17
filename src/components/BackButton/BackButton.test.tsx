import React from 'react'

import { _render, screen, userEvent } from '@test/index'

import { BackButton } from './index'
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('BackButton component', () => {
  it('renders BackButton', async () => {
    const label = 'Go back'
    _render(<BackButton label={label} />)
    await userEvent.click(screen.getByText('Go back'))
    expect(mockNavigate).toHaveBeenCalledWith(-1, { replace: false })
  })
})
