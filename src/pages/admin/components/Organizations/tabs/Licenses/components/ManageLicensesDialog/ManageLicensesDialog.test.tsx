import React from 'react'

import { Go1ChangeError, Go1ChangeType } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import go1LicensesHistoryChange from '@app/queries/go1-licensing/go1-licenses-history-change'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { fillForm } from '../../test-utils'
import { Type } from '../ManageLicensesForm'

import { ManageLicensesDialog } from './'

jest.mock('@app/hooks/use-fetcher')
const useFetcherMock = jest.mocked(useFetcher)

describe('ManageLicensesDialog', () => {
  it('adds licenses to an organization', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const onSaveMock = jest.fn()

    const fetcherMock = jest.fn()

    fetcherMock.mockResolvedValue({
      go1LicensesChange: {
        success: true,
      },
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <ManageLicensesDialog
        orgId={orgId}
        opened
        onSave={onSaveMock}
        onClose={jest.fn()}
        currentBalance={balance}
      />,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      }
    )

    fillForm({ amount, type: Type.ADD, invoiceId })

    await waitFor(() => {
      userEvent.click(screen.getByText('Save details'))
    })

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(onSaveMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(go1LicensesHistoryChange, {
      input: {
        type: Go1ChangeType.LicensesAdded,
        amount,
        orgId,
        payload: {
          invoiceId,
          invokedBy: fullName,
          invokedById: profileId,
          note: expect.any(String),
        },
      },
    })
  })

  it('removes licenses from an organization', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = jest.fn()

    const fetcherMock = jest.fn()

    fetcherMock.mockResolvedValue({
      go1LicensesChange: {
        success: true,
      },
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <ManageLicensesDialog
        orgId={orgId}
        opened
        onSave={onSaveMock}
        onClose={jest.fn()}
        currentBalance={balance}
      />,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      }
    )

    fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await waitFor(() => {
      userEvent.click(screen.getByText('Save details'))
    })

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(onSaveMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(go1LicensesHistoryChange, {
      input: {
        type: Go1ChangeType.LicensesRemoved,
        amount,
        orgId,
        payload: {
          invoiceId,
          invokedBy: fullName,
          invokedById: profileId,
          note: expect.any(String),
          licensePrice,
        },
      },
    })
  })

  it('handles generic error', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = jest.fn()

    const fetcherMock = jest.fn()

    fetcherMock.mockResolvedValue({
      go1LicensesChange: {
        success: false,
      },
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <ManageLicensesDialog
        orgId={orgId}
        opened
        onSave={onSaveMock}
        onClose={jest.fn()}
        currentBalance={balance}
      />,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      }
    )

    fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await waitFor(() => {
      userEvent.click(screen.getByText('Save details'))
    })

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(onSaveMock).not.toHaveBeenCalled()
    expect(fetcherMock).toHaveBeenCalledWith(go1LicensesHistoryChange, {
      input: {
        type: Go1ChangeType.LicensesRemoved,
        amount,
        orgId,
        payload: {
          invoiceId,
          invokedBy: fullName,
          invokedById: profileId,
          note: expect.any(String),
          licensePrice,
        },
      },
    })

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"There was an error removing licences, please try again later."`
    )
  })

  it('handles invoice not authorized error', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = jest.fn()

    const fetcherMock = jest.fn()

    fetcherMock.mockResolvedValue({
      go1LicensesChange: {
        success: false,
        error: Go1ChangeError.InvoiceNotAuthorized,
      },
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <ManageLicensesDialog
        orgId={orgId}
        opened
        onSave={onSaveMock}
        onClose={jest.fn()}
        currentBalance={balance}
      />,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      }
    )

    fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await waitFor(() => {
      userEvent.click(screen.getByText('Save details'))
    })

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(onSaveMock).not.toHaveBeenCalled()
    expect(fetcherMock).toHaveBeenCalledWith(go1LicensesHistoryChange, {
      input: {
        type: Go1ChangeType.LicensesRemoved,
        amount,
        orgId,
        payload: {
          invoiceId,
          invokedBy: fullName,
          invokedById: profileId,
          note: expect.any(String),
          licensePrice,
        },
      },
    })

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"Invoice must be authorised in Xero before issuing a refund."`
    )
  })
})
