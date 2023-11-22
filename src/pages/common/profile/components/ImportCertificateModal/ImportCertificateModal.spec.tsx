import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  ImportLegacyCertificateError,
  ImportLegacyCertificateMutation,
  ImportLegacyCertificateMutationVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent } from '@test/index'

import { ImportCertificateModal, MUTATION } from '.'

const user = userEvent.setup()

it('disables submit button when code not entered', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={vi.fn}
      />
    </Provider>
  )

  expect(
    screen.getByRole('button', { name: /add certificate/i })
  ).toBeDisabled()
})

it('calls a function when clicked on cancel button', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  const onCancel = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={onCancel}
        onClose={vi.fn}
        onSubmit={vi.fn}
      />
    </Provider>
  )

  await user.click(screen.getByRole('button', { name: /cancel/i }))

  expect(onCancel).toHaveBeenCalledTimes(1)
})

it('imports legacy certificate', async () => {
  const client = {
    executeMutation: ({
      variables,
    }: {
      variables: ImportLegacyCertificateMutationVariables
      query: TypedDocumentNode
    }) => {
      const matches = variables.input.code === 'code'

      return fromValue<{ data: ImportLegacyCertificateMutation }>({
        data: {
          importLegacyCertificate: {
            success: matches,
          },
        },
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).toHaveBeenCalledTimes(1)
})

it('imports certificate for other user if profile id is passed', async () => {
  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: ImportLegacyCertificateMutationVariables
      query: TypedDocumentNode
    }) => {
      const matches =
        variables.input.code === 'code' &&
        variables.input.profileId === 'profile-id' &&
        query === MUTATION

      return fromValue<{ data: ImportLegacyCertificateMutation }>({
        data: {
          importLegacyCertificate: {
            success: matches,
          },
        },
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
        profileId="profile-id"
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).toHaveBeenCalledTimes(1)
})

it('shows an alert when there is a generic error', async () => {
  const client = {
    executeMutation: () => {
      return fromValue({
        error: new CombinedError({ networkError: Error('network error') }),
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).not.toHaveBeenCalled()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"There was an error importing certificate"'
  )
})

it('shows an alert when the certificate has already been imported', async () => {
  const client = {
    executeMutation: () => {
      return fromValue<{ data: ImportLegacyCertificateMutation }>({
        data: {
          importLegacyCertificate: {
            success: false,
            error: ImportLegacyCertificateError.AlreadyImported,
          },
        },
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).not.toHaveBeenCalled()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"This certificate has already been imported"'
  )
})

it("shows an alert when the certificate data doesn't match the profile", async () => {
  const client = {
    executeMutation: () => {
      return fromValue<{ data: ImportLegacyCertificateMutation }>({
        data: {
          importLegacyCertificate: {
            success: false,
            error: ImportLegacyCertificateError.ProfileNoMatch,
          },
        },
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).not.toHaveBeenCalled()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"Personal information on the certificate doesn\'t match profile\'s personal information"'
  )
})

it("shows an alert when the certificate level isn't supported", async () => {
  const client = {
    executeMutation: () => {
      return fromValue<{ data: ImportLegacyCertificateMutation }>({
        data: {
          importLegacyCertificate: {
            success: false,
            error: ImportLegacyCertificateError.UnsupportedLevel,
          },
        },
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).not.toHaveBeenCalled()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"This certificate level isn\'t supported via Connect, please contact Team Teach"'
  )
})

it("shows an alert when the certificate isn't found", async () => {
  const client = {
    executeMutation: () => {
      return fromValue<{ data: ImportLegacyCertificateMutation }>({
        data: {
          importLegacyCertificate: {
            success: false,
            error: ImportLegacyCertificateError.CertificateNotFound,
          },
        },
      })
    },
  } as unknown as Client

  const onSubmit = vi.fn()

  render(
    <Provider value={client}>
      <ImportCertificateModal
        open={true}
        onCancel={vi.fn}
        onClose={vi.fn}
        onSubmit={onSubmit}
      />
    </Provider>
  )

  await user.type(screen.getByLabelText(/enter certificate number/i), 'code')
  await user.click(screen.getByRole('button', { name: /add certificate/i }))

  expect(onSubmit).not.toHaveBeenCalled()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"We could not locate this certificate, please contact Team Teach."'
  )
})
