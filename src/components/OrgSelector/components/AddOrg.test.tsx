import React from 'react'

import { render, screen } from '@test/index'

import { AddOrg } from './AddOrg'

describe('AddOrg component', () => {
  it('renders AddOrg', async () => {
    const option = {
      id: 'id',
      urn: 'urn',
      name: 'name',
    }

    render(<AddOrg option={option} onSuccess={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Organisation Name')).toBeInTheDocument()
    expect(screen.getByText('Trust type')).toBeInTheDocument()
    expect(screen.getByText('Trust name')).toBeInTheDocument()
    expect(screen.getByText('Line 1')).toBeInTheDocument()
    expect(screen.getByText('Line 2')).toBeInTheDocument()
    expect(screen.getByText('City')).toBeInTheDocument()
    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('Post code')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
