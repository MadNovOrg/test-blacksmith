import { setMedia } from 'mock-match-media'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  GetPromoCodesQuery,
  Promo_Code_Type_Enum,
  UpsertPromoCodeMutation,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { profile } from '@test/providers'

import { buildPromo } from '../../OrderDetails/mock-utils'

import { DiscountForm } from './DiscountForm'
import { APPLIES_TO } from './helpers'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

const client = {
  executeQuery: vi.fn(),
  executeMutation: vi.fn(),
}

describe('page: DiscountForm', () => {
  beforeAll(() => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode
  })

  it('defaults createdBy to current user', async () => {
    _render({})

    await waitFor(() => {
      const profileSelector = screen.getByTestId('profile-selector')
      const createdBy = within(profileSelector).getByRole('combobox')
      expect(createdBy).toHaveValue(profile?.fullName)
    })
  })

  it('defaults Type to Percent', async () => {
    _render({})

    const { Percent, FreePlaces } = Promo_Code_Type_Enum
    const typePercent = screen.getByTestId(`discount-type-${Percent}`)
    expect(within(typePercent).getByRole('radio')).toBeChecked()
    expect(screen.queryByTestId('fld-amount-percent')).toBeInTheDocument()

    const typeFreePlaces = screen.getByTestId(`discount-type-${FreePlaces}`)
    expect(within(typeFreePlaces).getByRole('radio')).not.toBeChecked()
    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()
  })

  it('defaults Amount to 5%', async () => {
    _render({})

    const amount = screen.getByTestId('fld-amount-percent')
    expect(amount).toHaveValue('5')

    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()
  })

  it('defaults free places to 1', async () => {
    _render({})

    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()

    const { FreePlaces } = Promo_Code_Type_Enum
    const typeFreePlaces = screen.getByTestId(`discount-type-${FreePlaces}`)

    await userEvent.click(typeFreePlaces)

    const amount = screen.getByTestId('fld-amount-freeplaces')
    expect(amount).toHaveValue('1')
  })

  it('defaults AppliesTo to ALL', async () => {
    _render({})

    const appliesToAll = screen.getByTestId(`appliesTo-${APPLIES_TO.ALL}`)
    expect(within(appliesToAll).getByRole('radio')).toBeChecked()
  })

  it('shows SelectLevels when appliesTo is LEVELS', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.LEVELS}`

    _render({})

    expect(screen.queryByTestId('SelectLevels')).toBeNull()

    await userEvent.click(screen.getByTestId(appliesTo))

    expect(screen.queryByTestId('SelectLevels')).toBeInTheDocument()
  })

  it('shows SelectCourses when appliesTo is COURSES', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.COURSES}`

    client.executeQuery.mockImplementationOnce(() =>
      fromValue({ data: { courses: [] } }),
    )

    _render({})

    expect(screen.queryByTestId('SelectCourses')).toBeNull()

    await userEvent.click(screen.getByTestId(appliesTo))

    expect(screen.queryByTestId('SelectCourses')).toBeInTheDocument()
  })

  it('validates code is filled', async () => {
    _render({})

    const btnSubmit = screen.getByTestId('btn-submit')
    await userEvent.click(btnSubmit)

    await waitFor(() => {
      const fldCode = screen.getByTestId('fld-code')
      const codeError = screen.getByText('Discount code is required')

      expect(fldCode.parentElement).toHaveClass('Mui-error')
      expect(codeError).toHaveClass('Mui-error')
    })
  })

  it('validates level(s) selected if appliesTo is LEVELS', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.LEVELS}`
    const levelsRequiredText = 'Please select at least one level'

    _render({})

    const btnSubmit = screen.getByTestId('btn-submit')
    await userEvent.click(btnSubmit)

    await waitFor(() => {
      expect(screen.queryByTestId('SelectLevels')).toBeNull()
      expect(screen.queryByText(levelsRequiredText)).toBeNull()
    })

    await userEvent.click(screen.getByTestId(appliesTo))
    await userEvent.click(btnSubmit)

    await waitFor(() => {
      expect(screen.queryByTestId('SelectLevels')).toBeInTheDocument()
      expect(screen.queryByText(levelsRequiredText)).toBeInTheDocument()
    })
  })

  it('validates course(s) selected if appliesTo is COURSES', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.COURSES}`
    const coursesRequiredText = 'Please select at least one course'

    _render({})

    const btnSubmit = screen.getByTestId('btn-submit')
    await userEvent.click(btnSubmit)

    await waitFor(() => {
      expect(screen.queryByTestId('SelectCourses')).toBeNull()
      expect(screen.queryByText(coursesRequiredText)).toBeNull()
    })

    await userEvent.click(screen.getByTestId(appliesTo))
    await userEvent.click(btnSubmit)

    await waitFor(() => {
      expect(screen.queryByTestId('SelectCourses')).toBeInTheDocument()
      expect(screen.queryByText(coursesRequiredText)).toBeInTheDocument()
    })
  })

  it('validates validFrom is required', async () => {
    _render({})

    const startDate = screen.getByLabelText(/start date/i) as HTMLInputElement

    await userEvent.clear(startDate)

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i }),
    )

    await waitFor(() => {
      expect(
        within(screen.getByTestId('valid-from')).getByText(
          /this field is required/i,
        ),
      ).toBeInTheDocument()
    })

    expect(true).toBe(true)
  })

  it('validates validTo is >= to validFrom', async () => {
    _render({})

    const startDate = screen.getByLabelText(/start date/i) as HTMLInputElement
    const endDate = screen.getByLabelText(/end date/i) as HTMLInputElement

    await waitFor(() => {
      startDate.focus()
    })

    await userEvent.paste('02/01/2023')

    await waitFor(() => {
      endDate.focus()
    })

    await userEvent.paste('01/01/2023')

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(/must be greater or equal to 'Start date'/i),
      ).toBeInTheDocument()
    })
  })

  it('validates usesMax is greater than 0 if filled', async () => {
    _render({})

    await userEvent.click(screen.getByLabelText(/limit number of bookings/i))

    await userEvent.clear(screen.getByLabelText(/maximum usages/i))
    await userEvent.type(screen.getByLabelText(/maximum usages/i), '0')
    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(/maximum usages must be greater than or equal to 1/i),
      ).toBeInTheDocument()
    })
  })

  it('navigates to Discounts list when cancel is clicked', async () => {
    _render({})

    const btnCancel = screen.getByTestId('btn-cancel')
    await userEvent.click(btnCancel)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..')
    })
  })

  it('submits as expected when all data is valid', async () => {
    const code = chance.word({ length: 10 }).toUpperCase()

    const client = {
      executeQuery: vi.fn(),
      executeMutation: () =>
        fromValue<{ data: UpsertPromoCodeMutation }>({
          data: {
            insert_promo_code_one: {
              id: 1,
            },
          },
        }),
    }
    _render({ urqlClient: client as unknown as Client })

    const fldCode = screen.getByTestId('fld-code')
    await userEvent.type(fldCode, code)

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..')
    })
  })

  it('shows Approval Needed if PERCENT exceeds 15', async () => {
    _render({ role: RoleName.TT_OPS })

    await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'code')
    await userEvent.click(screen.getByLabelText(/percent/i))

    const percentageOptions = screen.getByTestId('percent-shortcuts')

    await userEvent.click(within(percentageOptions).getByRole('button'))
    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(/other/i),
    )

    await userEvent.clear(screen.getByPlaceholderText(/amount/i))
    await userEvent.type(screen.getByPlaceholderText(/amount/i), '20')

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i }),
    )

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')

      expect(
        within(dialog).getByText(/discount approval required/i),
      ).toBeInTheDocument()
      expect(
        within(dialog).getByText(/percentage is greater or equal to 15%/i),
      ).toBeInTheDocument()
    })
  })

  it('shows Approval Needed if PERCENT equals to 15', async () => {
    _render({ role: RoleName.TT_OPS })

    await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'code')
    await userEvent.click(screen.getByLabelText(/percent/i))

    const percentageOptions = screen.getByTestId('percent-shortcuts')

    await userEvent.click(within(percentageOptions).getByRole('button'))
    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(/other/i),
    )

    await userEvent.clear(screen.getByPlaceholderText(/amount/i))
    await userEvent.type(screen.getByPlaceholderText(/amount/i), '15')

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i }),
    )

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')

      expect(
        within(dialog).getByText(/discount approval required/i),
      ).toBeInTheDocument()
      expect(
        within(dialog).getByText(/percentage is greater or equal to 15%/i),
      ).toBeInTheDocument()
    })
  })

  it('shows Approval Needed if FREE_PLACES exceeds 3', async () => {
    _render({ role: RoleName.TT_OPS })

    await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'code')
    await userEvent.click(screen.getByLabelText(/free spaces/i))
    await userEvent.type(screen.getByPlaceholderText(/free places/i), '4')

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i }),
    )

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')

      expect(
        within(dialog).getByText(/discount approval required/i),
      ).toBeInTheDocument()

      expect(
        within(dialog).getByText(/number of free spaces exceeds 3/i),
      ).toBeInTheDocument()
    })
  })

  describe('disabled discount', () => {
    it('renders alert', async () => {
      const mockPromo = buildPromo({
        overrides: {
          id: '123',
          disabled: true,
          type: Promo_Code_Type_Enum.Percent,
        },
      })

      const client = {
        executeQuery: () =>
          fromValue<{ data: GetPromoCodesQuery }>({
            data: {
              promoCodes: [mockPromo],
              promo_code_aggregate: { aggregate: { count: 1 } },
            },
          }),
      } as unknown as Client
      _render({ id: '123', urqlClient: client })

      await waitFor(() => {
        expect(
          screen.queryByText(
            'This discount has been disabled and editing it is not possible.',
          ),
        ).toBeInTheDocument()
      })
    })

    it('disables input fields', async () => {
      const mockPromo = buildPromo({
        overrides: {
          id: '123',
          disabled: true,
          type: Promo_Code_Type_Enum.Percent,
        },
      })

      const client = {
        executeQuery: () =>
          fromValue<{ data: GetPromoCodesQuery }>({
            data: {
              promoCodes: [mockPromo],
              promo_code_aggregate: { aggregate: { count: 1 } },
            },
          }),
      } as unknown as Client
      _render({ id: '123', urqlClient: client })

      await waitFor(() => {
        expect(
          within(screen.getByTestId('profile-selector')).getByRole('combobox'),
        ).toBeDisabled()
        expect(screen.getByTestId('fld-code')).toBeDisabled()
        expect(screen.getByTestId('fld-description')).toBeDisabled()
        expect(screen.getByTestId('fld-amount-percent')).toBeDisabled()
        expect(screen.getByTestId('fld-validFrom')).toBeDisabled()
        expect(screen.getByTestId('fld-validTo')).toBeDisabled()
        expect(screen.queryByTestId('btn-submit')).not.toBeInTheDocument()
      })
    })
  })

  describe('disable discount feature', () => {
    it('renders disable button', async () => {
      const mockPromo = buildPromo({
        overrides: {
          id: '123',
          type: Promo_Code_Type_Enum.Percent,
        },
      })

      const client = {
        executeQuery: () =>
          fromValue<{ data: GetPromoCodesQuery }>({
            data: {
              promoCodes: [mockPromo],
              promo_code_aggregate: { aggregate: { count: 1 } },
            },
          }),
      } as unknown as Client
      _render({ id: '123', urqlClient: client })

      screen.debug(undefined, 1000000)

      await waitFor(() => {
        expect(screen.queryByTestId('btn-disable')).toBeInTheDocument()
      })
    })

    it('do not render disable button for new discount form', async () => {
      _render({})

      await waitFor(() => {
        expect(screen.queryByTestId('btn-disable')).not.toBeInTheDocument()
      })
    })
  })
})

/**
 * Helpers
 */

function _render({
  id,
  role,
  urqlClient,
}: {
  id?: string
  role?: RoleName
  urqlClient?: Client
}) {
  return render(
    <Provider value={urqlClient ? urqlClient : (client as unknown as Client)}>
      <Routes>
        <Route
          path={id ? '/admin/discounts/edit/:id' : '/admin/discounts/new'}
          element={<DiscountForm />}
        />
      </Routes>
    </Provider>,
    {
      auth: {
        activeRole: role ? role : RoleName.TT_ADMIN,
      },
    },
    {
      initialEntries: [
        id ? `/admin/discounts/edit/${id}` : '/admin/discounts/new',
      ],
    },
  )
}
