import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { ManageLicensesForm } from '.'

describe('component: ManageLicensesForm', () => {
  it('validates amount field to be a positive number', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    userEvent.type(screen.getByLabelText('Amount *'), '-1')

    await waitFor(() => {
      expect(
        screen.getByText('Amount must be a positive number')
      ).toBeInTheDocument()
    })
  })

  it('displays number of remaining licenses', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    userEvent.type(screen.getByLabelText('Amount *'), '50')

    await waitFor(() => {
      expect(
        screen.getByText('Total remaining licenses 150')
      ).toBeInTheDocument()
    })
  })

  it('validates invoice field', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    const invoiceField = screen.getByLabelText('Invoice number *')

    userEvent.type(invoiceField, 'INV.1234')
    userEvent.clear(invoiceField)

    await waitFor(() => {
      expect(
        screen.getByText('Invoice number is a required field')
      ).toBeInTheDocument()
    })
  })

  it('calls callback on save with entered data', async () => {
    const onSaveMock = jest.fn()
    const invoiceId = 'INV.1234'
    const note = 'Note'

    render(<ManageLicensesForm currentBalance={100} onSave={onSaveMock} />)

    userEvent.type(screen.getByLabelText('Amount *'), '50')
    userEvent.type(screen.getByLabelText('Invoice number *'), invoiceId)
    userEvent.type(screen.getByLabelText('Add a note (optional)'), note)

    await waitFor(() => {
      expect(screen.getByText('Save details')).toBeEnabled()

      userEvent.click(screen.getByText('Save details'))
    })

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1)
      expect(onSaveMock).toHaveBeenCalledWith({
        type: 'ADD',
        amount: 50,
        invoiceId,
        note,
      })
    })
  })
})
