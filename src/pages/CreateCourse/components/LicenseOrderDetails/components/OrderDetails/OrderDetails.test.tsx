import React from 'react'

import { render, screen } from '@test/index'

import { OrderDetails } from '.'

describe('component: OrderDetails', () => {
  it('calculates correctly if there is a full license allowance', () => {
    render(<OrderDetails licenseBalance={6} numberOfLicenses={2} />)

    expect(screen.getByText('License allowance (4 left)')).toBeInTheDocument()
    expect(screen.getByTestId('amount-allowance')).toHaveTextContent('-£50.00')
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£50.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£0.00')
    expect(screen.queryByTestId('amount-vat')).not.toBeInTheDocument()
  })

  it('calculates correctly if there is a partial license allowance', () => {
    render(<OrderDetails licenseBalance={1} numberOfLicenses={2} />)

    expect(screen.getByTestId('amount-allowance')).toHaveTextContent('-£25.00')
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£50.00')
    expect(screen.getByTestId('amount-vat')).toHaveTextContent('£5.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£30.00')
  })

  it('calculates correctly if there is no license allowance', () => {
    render(<OrderDetails licenseBalance={0} numberOfLicenses={2} />)

    expect(screen.queryByTestId('amount-allowance')).not.toBeInTheDocument()
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£50.00')
    expect(screen.getByTestId('amount-vat')).toHaveTextContent('£10.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£60.00')
  })
})
