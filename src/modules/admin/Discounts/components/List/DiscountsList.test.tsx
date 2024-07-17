import React from 'react'

import { render, screen } from '@test/index'

import { DiscountsList } from './DiscountsList'

describe('DiscountsList component', () => {
  it('renders DiscountsList', async () => {
    render(<DiscountsList />)
    expect(screen.getByText('Discount code')).toBeInTheDocument()
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeInTheDocument()
    expect(screen.getByText('Created by')).toBeInTheDocument()
    expect(screen.getByText('Applies to')).toBeInTheDocument()
  })
})
