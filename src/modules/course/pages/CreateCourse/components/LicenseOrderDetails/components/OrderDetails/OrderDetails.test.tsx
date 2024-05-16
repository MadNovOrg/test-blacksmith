import React from 'react'

import { render, screen } from '@test/index'

import { calculateGo1LicenseCost } from '../../../../utils'

import { OrderDetails } from '.'

describe('component: OrderDetails', () => {
  it('calculates correctly if there is a full license allowance', () => {
    const costs = calculateGo1LicenseCost(2, 6)

    render(<OrderDetails licensesBalance={6} numberOfLicenses={2} {...costs} />)

    expect(screen.queryByText(/license allowance/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('amount-allowance')).not.toBeInTheDocument()
    expect(screen.queryByTestId('amount-subtotal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('amount-vat')).not.toBeInTheDocument()

    expect(screen.getByTestId('amount-due')).toHaveTextContent('£0.00')
  })

  it('calculates correctly if there is a partial license allowance', () => {
    const costs = calculateGo1LicenseCost(2, 1)

    render(<OrderDetails licensesBalance={1} numberOfLicenses={2} {...costs} />)

    expect(screen.getByTestId('amount-allowance')).toHaveTextContent('-£50.00')
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£100.00')
    expect(screen.getByTestId('amount-vat')).toHaveTextContent('£10.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£60.00')
  })

  it('calculates correctly if there is no license allowance', () => {
    const costs = calculateGo1LicenseCost(2, 0)
    render(<OrderDetails licensesBalance={0} numberOfLicenses={2} {...costs} />)

    expect(screen.queryByTestId('amount-allowance')).not.toBeInTheDocument()
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£100.00')
    expect(screen.getByTestId('amount-vat')).toHaveTextContent('£20.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£120.00')
  })
})
