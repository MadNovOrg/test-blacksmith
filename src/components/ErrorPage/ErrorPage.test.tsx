import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { ErrorPage } from './index'
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('ErrorPage page', () => {
  it('renders ErrorPage', async () => {
    render(<ErrorPage debug={true} />)
    expect(screen.getByText('Error message:')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Home'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
