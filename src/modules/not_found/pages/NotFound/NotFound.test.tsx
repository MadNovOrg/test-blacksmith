import React from 'react'

import { _render, screen } from '@test/index'

import { NotFound } from './index'
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('NotFound page', () => {
  it('renders NotFound with default title', async () => {
    _render(<NotFound showTitle={true} />)
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
  it('renders NotFound with custom title', async () => {
    const title = '404'
    _render(<NotFound showTitle={true} title={title} />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
