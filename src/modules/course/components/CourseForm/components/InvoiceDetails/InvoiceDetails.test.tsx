import React from 'react'

import { render, screen } from '@test/index'

import { InvoiceDetails } from './index'

describe('InvoiceDetails component', () => {
  it('renders InvoiceDetails', async () => {
    const details = {
      orgId: '1',
      orgName: 'Test Organisation',
      billingAddress: '11 Baker Street',
      firstName: 'Jill',
      surname: 'Dunn',
      email: 'email@email.com',
      phone: '02073432164',
      purchaseOrder: 'PO1231',
    }

    render(<InvoiceDetails details={details} />)
    expect(screen.getByText('Test Organisation')).toBeInTheDocument()
    expect(screen.getByText('11 Baker Street')).toBeInTheDocument()
    expect(screen.getByText('Jill')).toBeInTheDocument()
    expect(screen.getByText('Dunn')).toBeInTheDocument()
    expect(screen.getByText('email@email.com')).toBeInTheDocument()
    expect(screen.getByText('02073432164')).toBeInTheDocument()
    expect(screen.getByText('PO1231')).toBeInTheDocument()
  })
})
