import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { fillForm } from '../../test-utils'

import { ManageLicensesForm, Type } from '.'

describe('component: ManageLicencesForm', () => {
  it('validates amount field to be a positive number', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    await fillForm({ amount: -1 })

    await waitFor(() => {
      expect(
        screen.getByText('Amount must be a positive number')
      ).toBeInTheDocument()
    })
  })

  it('displays number of remaining licences', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    await fillForm({ amount: 50, type: Type.ADD })

    await waitFor(() => {
      expect(
        screen.getByText('Total remaining licences 150')
      ).toBeInTheDocument()
    })
  })

  it('validates invoice field', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    const invoiceField = screen.getByLabelText('Invoice number *')

    await fillForm({ invoiceId: 'INV.1234' })
    await userEvent.clear(invoiceField)

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

    await fillForm({ amount: 50, invoiceId, note, type: Type.ADD })

    await waitFor(() => {
      expect(screen.getByText('Save details')).toBeEnabled()
    })

    await userEvent.click(screen.getByText('Save details'))

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1)
      expect(onSaveMock).toHaveBeenCalledWith({
        type: 'ADD',
        amount: 50,
        invoiceId,
        licensePrice: null,
        issueRefund: false,
        note,
      })
    })
  })

  it('makes an invoice id a required field when issue refund is checked and type is REMOVE', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    await fillForm({
      type: Type.REMOVE,
      issueRefund: true,
      amount: 20,
      invoiceId: 'INV',
    })

    const invoiceField = screen.getByLabelText('Invoice number *')

    await userEvent.clear(invoiceField)

    await waitFor(() => {
      expect(screen.getByText('Save details')).toBeDisabled()
      expect(invoiceField.textContent).toMatchInlineSnapshot(`""`)
    })
  })

  it('makes a license price a required field when issue refund is checked and type is REMOVE', async () => {
    render(<ManageLicensesForm currentBalance={100} />)

    await fillForm({
      type: Type.REMOVE,
      issueRefund: true,
      amount: 20,
      invoiceId: 'INV',
      licensePrice: 125.5,
    })

    await userEvent.clear(screen.getByLabelText('Price per licence *'))

    await waitFor(() => {
      expect(screen.getByText('Save details')).toBeDisabled()
    })
  })

  it('makes an invoice id an optional field for REMOVE type and when issue refund is not checked', async () => {
    const onSaveMock = jest.fn()
    const note = 'Note'

    render(<ManageLicensesForm currentBalance={100} onSave={onSaveMock} />)

    await fillForm({ type: Type.REMOVE, amount: 50, note })

    await waitFor(() => {
      expect(screen.getByText('Save details')).toBeEnabled()
    })

    await userEvent.click(screen.getByText('Save details'))

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1)
      expect(onSaveMock).toHaveBeenCalledWith({
        type: 'REMOVE',
        amount: 50,
        invoiceId: '',
        issueRefund: false,
        licensePrice: null,
        note,
      })
    })
  })

  it('calls callback with correct data when type is REMOVE and issue refund is checked', async () => {
    const onSaveMock = jest.fn()
    const note = 'Note'
    const invoiceId = 'INV-0001'

    render(<ManageLicensesForm currentBalance={100} onSave={onSaveMock} />)

    await fillForm({
      type: Type.REMOVE,
      amount: 5,
      issueRefund: true,
      note,
      invoiceId,
      licensePrice: 125.5,
    })

    await waitFor(() => {
      expect(screen.getByText('Save details')).toBeEnabled()
    })

    await userEvent.click(screen.getByText('Save details'))

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1)
      expect(onSaveMock).toHaveBeenCalledWith({
        type: 'REMOVE',
        amount: 5,
        invoiceId,
        issueRefund: true,
        note,
        licensePrice: 125.5,
      })
    })
  })

  it('constrains number of licences field to the number of organization licences when removing', async () => {
    render(<ManageLicensesForm currentBalance={1} />)

    await fillForm({ amount: 2, type: Type.REMOVE })

    await waitFor(() => {
      expect(
        screen.getByText(/maximum number of licences to remove is 1/i)
      ).toBeInTheDocument()
    })
  })

  it('enables save button when issue refund is toggled', async () => {
    render(<ManageLicensesForm currentBalance={10} />)

    await fillForm({ amount: 2, type: Type.REMOVE })

    await userEvent.click(screen.getByTestId('issue-refund-checkbox'))

    await waitFor(() => {
      expect(screen.getByText(/save details/i)).toBeDisabled()
    })

    await userEvent.click(screen.getByTestId('issue-refund-checkbox'))

    await waitFor(() => {
      expect(screen.getByText(/save details/i)).toBeEnabled()
    })
  })
})
