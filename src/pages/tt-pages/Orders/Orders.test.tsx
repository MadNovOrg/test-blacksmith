import React from 'react'

import { screen, render } from '@test/index'

import { Orders } from './index'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('page: Orders', () => {
  it('renders empty page with filters', async () => {
    render(<Orders />)
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByTestId('FilterSearch-Input')).toBeInTheDocument()
    expect(screen.getByText('Currency')).toBeInTheDocument()
  })
})
