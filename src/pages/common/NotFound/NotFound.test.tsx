import React from 'react'

import { render, screen } from '@test/index'

import { NotFound } from './index'
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('NotFound page', () => {
  it('renders NotFound with default title', async () => {
    render(<NotFound showTitle={true} />)
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
  it('renders NotFound with custom title', async () => {
    const title = '404'
    render(<NotFound showTitle={true} title={title} />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
