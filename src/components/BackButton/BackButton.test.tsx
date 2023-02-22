import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { BackButton } from './index'
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('BackButton component', () => {
  it('renders BackButton', async () => {
    const label = 'Go back'
    render(<BackButton label={label} />)
    await userEvent.click(screen.getByText('Go back'))
    expect(mockNavigate).toHaveBeenCalledWith(-1, { replace: false })
  })
})
