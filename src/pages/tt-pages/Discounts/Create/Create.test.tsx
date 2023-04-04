import { startOfDay } from 'date-fns'
import { setMedia } from 'mock-match-media'
import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'

import { screen, render, within, userEvent, waitFor, chance } from '@test/index'
import { profile } from '@test/providers'

import { Create } from './Create'
import { APPLIES_TO } from './helpers'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

const client = {
  executeQuery: jest.fn(),
  executeMutation: jest.fn(),
}

describe('page: CreateDiscount', () => {
  beforeAll(() => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode
  })

  it('defaults createdBy to current user', async () => {
    _render(<Create />)

    const profileSelector = screen.getByTestId('profile-selector')
    const createdBy = within(profileSelector).getByRole('combobox')
    expect(createdBy).toHaveValue(profile?.fullName)
  })

  it('defaults Type to Percent', async () => {
    _render(<Create />)

    const { Percent, FreePlaces } = Promo_Code_Type_Enum
    const typePercent = screen.getByTestId(`discount-type-${Percent}`)
    expect(within(typePercent).getByRole('radio')).toBeChecked()
    expect(screen.queryByTestId('fld-amount-percent')).toBeInTheDocument()

    const typeFreePlaces = screen.getByTestId(`discount-type-${FreePlaces}`)
    expect(within(typeFreePlaces).getByRole('radio')).not.toBeChecked()
    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()
  })

  it('defaults Amount to 5%', async () => {
    _render(<Create />)

    const amount = screen.getByTestId('fld-amount-percent')
    expect(amount).toHaveValue('5')

    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()
  })

  it('defaults free places to 1', async () => {
    _render(<Create />)

    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()

    const { FreePlaces } = Promo_Code_Type_Enum
    const typeFreePlaces = screen.getByTestId(`discount-type-${FreePlaces}`)

    await userEvent.click(typeFreePlaces)

    const amount = screen.getByTestId('fld-amount-freeplaces')
    expect(amount).toHaveValue('1')
  })

  it('defaults AppliesTo to ALL', async () => {
    _render(<Create />)

    const appliesToAll = screen.getByTestId(`appliesTo-${APPLIES_TO.ALL}`)
    expect(within(appliesToAll).getByRole('radio')).toBeChecked()
  })

  it('shows SelectLevels when appliesTo is LEVELS', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.LEVELS}`

    _render(<Create />)

    expect(screen.queryByTestId('SelectLevels')).toBeNull()

    await userEvent.click(screen.getByTestId(appliesTo))

    expect(screen.queryByTestId('SelectLevels')).toBeInTheDocument()
  })

  it('shows SelectCourses when appliesTo is COURSES', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.COURSES}`

    client.executeQuery.mockImplementationOnce(() =>
      fromValue({ data: { courses: [] } })
    )

    _render(<Create />)

    expect(screen.queryByTestId('SelectCourses')).toBeNull()

    await userEvent.click(screen.getByTestId(appliesTo))

    expect(screen.queryByTestId('SelectCourses')).toBeInTheDocument()
  })

  it('validates code is filled', async () => {
    _render(<Create />)

    const btnSubmit = screen.getByTestId('btn-submit')
    await userEvent.click(btnSubmit)

    await waitFor(() => {
      const fldCode = screen.getByTestId('fld-code')
      const codeError = screen.getByText('Discount code is required')

      expect(fldCode.parentElement).toHaveClass('Mui-error')
      expect(codeError).toHaveClass('Mui-error')
      expect(mockFetcher).not.toHaveBeenCalled()
    })
  })

  it('validates level(s) selected if appliesTo is LEVELS', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.LEVELS}`
    const levelsRequiredText = 'Please select at least one level'

    _render(<Create />)

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
      expect(mockFetcher).not.toHaveBeenCalled()
    })
  })

  it('validates course(s) selected if appliesTo is COURSES', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.COURSES}`
    const coursesRequiredText = 'Please select at least one course'

    _render(<Create />)

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
      expect(mockFetcher).not.toHaveBeenCalled()
    })
  })

  it('validates validFrom is required', async () => {
    _render(<Create />)

    const startDate = screen.getByLabelText(/start date/i) as HTMLInputElement

    await userEvent.clear(startDate)

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i })
    )

    await waitFor(() => {
      expect(
        within(screen.getByTestId('valid-from')).getByText(
          /this field is required/i
        )
      ).toBeInTheDocument()
    })

    expect(true).toBe(true)
  })

  it('validates validTo is >= to validFrom', async () => {
    _render(<Create />)

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
      screen.getByRole('button', { name: /create discount/i })
    )

    await waitFor(() => {
      expect(
        screen.getByText(/must be greater or equal to 'Start date'/i)
      ).toBeInTheDocument()
    })
  })

  it('validates usesMax is greater than 0 if filled', async () => {
    _render(<Create />)

    await userEvent.click(screen.getByLabelText(/limit number of bookings/i))

    await userEvent.clear(screen.getByLabelText(/maximum usages/i))
    await userEvent.type(screen.getByLabelText(/maximum usages/i), '0')
    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i })
    )

    await waitFor(() => {
      expect(
        screen.getByText(/maximum usages must be greater than or equal to 1/i)
      ).toBeInTheDocument()
    })
  })

  it('navigates to Discounts list when cancel is clicked', async () => {
    _render(<Create />)

    const btnCancel = screen.getByTestId('btn-cancel')
    await userEvent.click(btnCancel)

    await waitFor(() => {
      expect(mockFetcher).not.toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('..')
    })
  })

  it('submits as expected when all data is valid', async () => {
    const code = chance.word({ length: 10 }).toUpperCase()

    _render(<Create />)

    const fldCode = screen.getByTestId('fld-code')
    await userEvent.type(fldCode, code)

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))

    expect(mockFetcher).toHaveBeenCalledWith(
      expect.stringContaining('mutation InsertPromoCode'),
      {
        promoCode: {
          amount: 5,
          bookerSingleUse: true,
          code,
          courses: { data: [] },
          createdBy: profile?.id,
          description: '',
          levels: [],
          type: 'PERCENT',
          usesMax: null,
          validFrom: startOfDay(new Date()),
          validTo: null,
        },
      }
    )
    expect(mockNavigate).toHaveBeenCalledWith('..')
  })

  it('shows Approval Needed if PERCENT exceeds 15', async () => {
    _render(<Create />)

    await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'code')
    await userEvent.click(screen.getByLabelText(/percent/i))

    const percentageOptions = screen.getByTestId('percent-shortcuts')

    await userEvent.click(within(percentageOptions).getByRole('button'))
    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(/other/i)
    )

    await userEvent.clear(screen.getByPlaceholderText(/amount/i))
    await userEvent.type(screen.getByPlaceholderText(/amount/i), '20')

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i })
    )

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')

      expect(
        within(dialog).getByText(/discount approval required/i)
      ).toBeInTheDocument()
      expect(
        within(dialog).getByText(/percentage exceeds 15%/i)
      ).toBeInTheDocument()
    })
  })

  it('shows Approval Needed if FREE_PLACES exceeds 3', async () => {
    _render(<Create />)

    await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'code')
    await userEvent.click(screen.getByLabelText(/free spaces/i))
    await userEvent.type(screen.getByPlaceholderText(/free places/i), '4')

    await userEvent.click(
      screen.getByRole('button', { name: /create discount/i })
    )

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')

      expect(
        within(dialog).getByText(/discount approval required/i)
      ).toBeInTheDocument()

      expect(
        within(dialog).getByText(/number of free spaces exceeds 3/i)
      ).toBeInTheDocument()
    })
  })
})

/**
 * Helpers
 */

function _render(ui: React.ReactElement) {
  return render(<Provider value={client as unknown as Client}>{ui}</Provider>)
}
