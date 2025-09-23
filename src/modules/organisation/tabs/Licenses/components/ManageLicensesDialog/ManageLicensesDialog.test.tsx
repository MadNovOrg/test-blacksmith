import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Go1ChangeError,
  Go1LicensesChangeMutation,
} from '@app/generated/graphql'

import { chance, _render, screen, userEvent, waitFor } from '@test/index'

import { fillForm } from '../../test-utils'
import { Type } from '../ManageLicensesForm'

import { ManageLicensesDialog } from '.'

vi.mock('@app/hooks/use-fetcher')
describe('ManageLicensesDialog', () => {
  const client = {
    executeMutation: vi.fn(() => never),
  }
  it('adds licenses to an organization', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const onSaveMock = vi.fn()
    client.executeMutation.mockImplementationOnce(() =>
      fromValue<{ data: Go1LicensesChangeMutation }>({
        data: {
          go1LicensesChange: {
            success: true,
          },
        },
      }),
    )

    _render(
      <Provider value={client as unknown as Client}>
        <ManageLicensesDialog
          orgId={orgId}
          opened
          onSave={onSaveMock}
          onClose={vi.fn()}
          currentBalance={balance}
        />
      </Provider>,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      },
    )

    await fillForm({ amount, type: Type.ADD, invoiceId })

    await userEvent.click(screen.getByText('Save details'))
    expect(client.executeMutation).toHaveBeenCalledTimes(1)

    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })

  it('removes licenses from an organization', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = vi.fn()

    client.executeMutation.mockImplementationOnce(() =>
      fromValue<{ data: Go1LicensesChangeMutation }>({
        data: {
          go1LicensesChange: {
            success: true,
          },
        },
      }),
    )

    _render(
      <Provider value={client as unknown as Client}>
        <ManageLicensesDialog
          orgId={orgId}
          opened
          onSave={onSaveMock}
          onClose={vi.fn()}
          currentBalance={balance}
        />
      </Provider>,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      },
    )

    await fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await userEvent.click(screen.getByText('Save details'))
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })

  it('handles generic error', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = vi.fn()

    client.executeMutation.mockImplementationOnce(() =>
      fromValue<{ data: Go1LicensesChangeMutation }>({
        data: {
          go1LicensesChange: {
            success: false,
          },
        },
      }),
    )
    _render(
      <Provider value={client as unknown as Client}>
        <ManageLicensesDialog
          orgId={orgId}
          opened
          onSave={onSaveMock}
          onClose={vi.fn()}
          currentBalance={balance}
        />
      </Provider>,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      },
    )

    await fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await userEvent.click(screen.getByText('Save details'))

    await waitFor(() => {
      expect(client.executeMutation).toHaveBeenCalledTimes(1)
      expect(onSaveMock).not.toHaveBeenCalled()
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"There was an error removing licences, please try again later."`,
      )
    })
  })

  it('handles invoice not authorized error', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = vi.fn()

    client.executeMutation.mockImplementationOnce(() =>
      fromValue<{ data: Go1LicensesChangeMutation }>({
        data: {
          go1LicensesChange: {
            success: false,
            error: Go1ChangeError.InvoiceNotAuthorized,
          },
        },
      }),
    )

    _render(
      <Provider value={client as unknown as Client}>
        <ManageLicensesDialog
          orgId={orgId}
          opened
          onSave={onSaveMock}
          onClose={vi.fn()}
          currentBalance={balance}
        />
      </Provider>,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      },
    )

    await fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await userEvent.click(screen.getByText('Save details'))

    await waitFor(() => {
      expect(client.executeMutation).toHaveBeenCalledTimes(1)
      expect(onSaveMock).not.toHaveBeenCalled()
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"Invoice must be authorised in Xero before issuing a refund."`,
      )
    })
  })

  it('handles invoice paid error', async () => {
    const orgId = chance.guid()
    const balance = 20
    const amount = 5
    const profileId = chance.guid()
    const fullName = chance.name({ full: true })
    const invoiceId = 'inv-001'
    const licensePrice = 15
    const onSaveMock = vi.fn()

    const client = {
      executeMutation: () =>
        fromValue<{ data: Go1LicensesChangeMutation }>({
          data: {
            go1LicensesChange: {
              success: false,
              error: Go1ChangeError.InvoicePaid,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <ManageLicensesDialog
          orgId={orgId}
          opened
          onSave={onSaveMock}
          onClose={vi.fn()}
          currentBalance={balance}
        />
      </Provider>,
      {
        auth: {
          profile: {
            id: profileId,
            fullName,
          },
        },
      },
    )

    await fillForm({
      amount,
      type: Type.REMOVE,
      invoiceId,
      licensePrice,
      issueRefund: true,
    })

    await userEvent.click(screen.getByText('Save details'))
    await waitFor(() => {
      expect(onSaveMock).not.toHaveBeenCalled()
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"Unable to issue a credit note, the invoice has already been paid."`,
      )
    })
  })
})
