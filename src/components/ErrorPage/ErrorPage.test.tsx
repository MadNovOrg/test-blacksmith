import React from 'react'

import { _render, screen, userEvent } from '@test/index'

import { ErrorPage } from './index'
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('ErrorPage page', () => {
  it('renders ErrorPage', async () => {
    _render(<ErrorPage debug={true} />)
    expect(screen.getByText('Error message:')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Home'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
