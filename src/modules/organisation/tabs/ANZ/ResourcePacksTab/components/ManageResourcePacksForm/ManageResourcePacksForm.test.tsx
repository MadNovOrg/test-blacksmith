import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { ManageOrgResourcePacksMutation } from '@app/generated/graphql'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'

import {
  chance,
  _render,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
} from '@test/index'

import { ManageResourcePacksForm } from '.'

vi.mock('@app/modules/course/hooks/useOrgResourcePacks')

const useOrgResourcePacksMocked = vi.mocked(useOrgResourcePacks)

describe('ManageResourcePacksForm', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    const orgId = chance.guid()
    const onCancel = vi.fn()
    const onSuccess = vi.fn()

    const client = {
      executeMutation: vi.fn(),
    }

    useOrgResourcePacksMocked.mockReturnValue({
      resourcePacks: {
        balance: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
      },
      refetch: vi.fn(),
    })

    _render(
      <Provider value={client as unknown as Client}>
        <ManageResourcePacksForm
          onCancel={onCancel}
          onSuccess={onSuccess}
          orgId={orgId}
        />
      </Provider>,
    )

    expect(
      screen.getByText(
        t(
          'pages.org-details.tabs.resource-packs.form.resource-packs-type-placeholder',
        ),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        t('pages.org-details.tabs.resource-packs.form.amount-placeholder'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        t('pages.org-details.tabs.resource-packs.form.invoice-placeholder'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        t('pages.org-details.tabs.resource-packs.form.note-placeholder'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/save/i)).toBeDisabled()
  })

  it('enables save button when form data is valid', async () => {
    const orgId = chance.guid()
    const onCancel = vi.fn()
    const onSuccess = vi.fn()

    const client = {
      executeMutation: vi.fn(),
    }

    client.executeMutation.mockImplementationOnce(() =>
      fromValue<{ data: ManageOrgResourcePacksMutation }>({
        data: {
          addResourcePacks: {
            success: true,
            totalResourcePacks: 20,
          },
        },
      }),
    )

    useOrgResourcePacksMocked.mockReturnValue({
      resourcePacks: {
        balance: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
      },
      refetch: vi.fn(),
    })

    _render(
      <Provider value={client as unknown as Client}>
        <ManageResourcePacksForm
          onCancel={onCancel}
          onSuccess={onSuccess}
          orgId={orgId}
        />
      </Provider>,
    )

    const saveBtn = screen.getByText(/save/i)

    const resourcePacksTypeSelector = screen.getByTestId(
      'resource-packs-type-select',
    )
    const { getByRole } = within(resourcePacksTypeSelector)
    const buttonSelector = getByRole('button')

    const amountInput = screen.getByTestId('resource-packs-manage-form-amount')
    const invoiceNumberInput = screen.getByTestId(
      'resource-packs-manage-form-invoice-number',
    )

    expect(saveBtn).toBeDisabled()

    expect(resourcePacksTypeSelector).toBeInTheDocument()

    expect(amountInput).toBeDisabled()

    await userEvent.click(buttonSelector)

    const resourcePacksTypeOption = await waitFor(() =>
      screen.getByTestId('resource-packs-type-select-option-PRINT_WORKBOOK'),
    )

    await userEvent.click(resourcePacksTypeOption)

    expect(amountInput).toBeEnabled()

    await userEvent.type(amountInput, '20')
    await userEvent.type(invoiceNumberInput, 'INVOICE')

    expect(saveBtn).toBeEnabled()

    await userEvent.click(saveBtn)
    expect(client.executeMutation).toHaveBeenCalled()
  })

  it('validates amount input correctly when removing resource packs', async () => {
    const orgId = chance.guid()
    const onCancel = vi.fn()
    const onSuccess = vi.fn()

    const client = {
      executeMutation: vi.fn(),
    }

    useOrgResourcePacksMocked.mockReturnValue({
      resourcePacks: {
        balance: { DIGITAL_WORKBOOK: 10, PRINT_WORKBOOK: 10 },
        reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
      },
      refetch: vi.fn(),
    })

    _render(
      <Provider value={client as unknown as Client}>
        <ManageResourcePacksForm
          onCancel={onCancel}
          onSuccess={onSuccess}
          orgId={orgId}
        />
      </Provider>,
    )

    const removeCheckbox = screen.getByLabelText(
      t('pages.org-details.tabs.resource-packs.form.remove'),
    )

    await userEvent.click(removeCheckbox)

    const resourcePacksTypeSelector = screen.getByTestId(
      'resource-packs-type-select',
    )

    expect(resourcePacksTypeSelector).toBeInTheDocument()

    const { getByRole } = within(resourcePacksTypeSelector)
    const buttonSelector = getByRole('button')

    const amountInput = screen.getByTestId('resource-packs-manage-form-amount')

    expect(amountInput).toBeDisabled()

    await userEvent.click(buttonSelector)

    const resourcePacksTypeOption = await waitFor(() =>
      screen.getByTestId('resource-packs-type-select-option-PRINT_WORKBOOK'),
    )

    await userEvent.click(resourcePacksTypeOption)

    expect(amountInput).toBeEnabled()

    await userEvent.type(amountInput, '20')

    await waitFor(() => {
      expect(
        screen.getByText(
          t('pages.org-details.tabs.resource-packs.form.error-amount-max', {
            max: 10,
          }),
        ),
      ).toBeInTheDocument()
    })
  })
})
