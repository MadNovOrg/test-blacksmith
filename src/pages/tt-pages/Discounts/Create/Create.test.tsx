import { startOfDay, subDays } from 'date-fns'
import { setMedia } from 'mock-match-media'
import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'
import { dateInputValueFormat, dateInputValueParse } from '@app/util'

import { screen, render, within, userEvent, waitFor, chance } from '@test/index'
import { profile } from '@test/providers'

import { APPLIES_TO } from './helpers'

import { NewDiscount } from '.'

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
    _render(<NewDiscount />)

    const profileSelector = screen.getByTestId('profile-selector')
    const createdBy = within(profileSelector).getByRole('combobox')
    expect(createdBy).toHaveValue(profile?.fullName)
  })

  it('defaults Type to Percent', async () => {
    _render(<NewDiscount />)

    const { Percent, FreePlaces } = Promo_Code_Type_Enum
    const typePercent = screen.getByTestId(`discount-type-${Percent}`)
    expect(within(typePercent).getByRole('radio')).toBeChecked()
    expect(screen.queryByTestId('fld-amount-percent')).toBeInTheDocument()

    const typeFreePlaces = screen.getByTestId(`discount-type-${FreePlaces}`)
    expect(within(typeFreePlaces).getByRole('radio')).not.toBeChecked()
    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()
  })

  it('defaults Amount to 5%', async () => {
    _render(<NewDiscount />)

    const amount = screen.getByTestId('fld-amount-percent')
    expect(amount).toHaveValue('5')

    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()
  })

  it('defaults free places to 1', async () => {
    _render(<NewDiscount />)

    expect(screen.queryByTestId('fld-amount-freeplaces')).toBeNull()

    const { FreePlaces } = Promo_Code_Type_Enum
    const typeFreePlaces = screen.getByTestId(`discount-type-${FreePlaces}`)

    userEvent.click(typeFreePlaces)

    const amount = screen.getByTestId('fld-amount-freeplaces')
    expect(amount).toHaveValue('1')
  })

  it('defaults AppliesTo to ALL', async () => {
    _render(<NewDiscount />)

    const appliesToAll = screen.getByTestId(`appliesTo-${APPLIES_TO.ALL}`)
    expect(within(appliesToAll).getByRole('radio')).toBeChecked()
  })

  it('shows SelectLevels when appliesTo is LEVELS', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.LEVELS}`

    _render(<NewDiscount />)

    expect(screen.queryByTestId('SelectLevels')).toBeNull()

    userEvent.click(screen.getByTestId(appliesTo))

    expect(screen.queryByTestId('SelectLevels')).toBeInTheDocument()
  })

  it('shows SelectCourses when appliesTo is COURSES', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.COURSES}`

    client.executeQuery.mockImplementationOnce(() =>
      fromValue({ data: { courses: [] } })
    )

    _render(<NewDiscount />)

    expect(screen.queryByTestId('SelectCourses')).toBeNull()

    userEvent.click(screen.getByTestId(appliesTo))

    expect(screen.queryByTestId('SelectCourses')).toBeInTheDocument()
  })

  it('validates code is filled', async () => {
    _render(<NewDiscount />)

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))

    const fldCode = screen.getByTestId('fld-code')
    const codeError = screen.getByText('Discount code is required')

    expect(fldCode.parentElement).toHaveClass('Mui-error')
    expect(codeError).toHaveClass('Mui-error')
    expect(mockFetcher).not.toBeCalled()
  })

  it('validates level(s) selected if appliesTo is LEVELS', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.LEVELS}`
    const levelsRequiredText = 'Please select at least one level'

    _render(<NewDiscount />)

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))

    expect(screen.queryByTestId('SelectLevels')).toBeNull()
    expect(screen.queryByText(levelsRequiredText)).toBeNull()

    userEvent.click(screen.getByTestId(appliesTo))
    await waitFor(() => userEvent.click(btnSubmit))

    expect(screen.queryByTestId('SelectLevels')).toBeInTheDocument()
    expect(screen.queryByText(levelsRequiredText)).toBeInTheDocument()
    expect(mockFetcher).not.toBeCalled()
  })

  it('validates course(s) selected if appliesTo is COURSES', async () => {
    const appliesTo = `appliesTo-${APPLIES_TO.COURSES}`
    const coursesRequiredText = 'Please select at least one course'

    _render(<NewDiscount />)

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))

    expect(screen.queryByTestId('SelectCourses')).toBeNull()
    expect(screen.queryByText(coursesRequiredText)).toBeNull()

    userEvent.click(screen.getByTestId(appliesTo))
    await waitFor(() => userEvent.click(btnSubmit))

    expect(screen.queryByTestId('SelectCourses')).toBeInTheDocument()
    expect(screen.queryByText(coursesRequiredText)).toBeInTheDocument()
    expect(mockFetcher).not.toBeCalled()
  })

  it('validates validFrom is required', async () => {
    _render(<NewDiscount />)

    const btnSubmit = screen.getByTestId('btn-submit')

    const validFrom = screen.getByTestId('fld-validFrom')
    const validFromMuiFilledInput = validFrom.parentElement
    const validFromMuiFormControl = validFromMuiFilledInput?.parentElement
    expect(validFromMuiFilledInput).not.toHaveClass('Mui-error')

    await userEvent.clear(validFrom)
    expect(screen.getByTestId('fld-validFrom')).toHaveValue('')

    await waitFor(() => userEvent.click(btnSubmit))

    expect(validFromMuiFilledInput).toHaveClass('Mui-error')
    expect(
      within(validFromMuiFormControl as HTMLElement).getByText(
        'This field is required'
      )
    ).toBeInTheDocument()

    expect(mockFetcher).not.toBeCalled()
  })

  it('validates validTo is >= to validFrom', async () => {
    _render(<NewDiscount />)

    const btnSubmit = screen.getByTestId('btn-submit')

    const validFrom = screen.getByTestId('fld-validFrom')
    const validTo = screen.getByTestId('fld-validTo')
    const validToMuiFilledInput = validTo.parentElement
    const validToMuiFormControl = validToMuiFilledInput?.parentElement
    expect(validToMuiFilledInput).not.toHaveClass('Mui-error')

    const fromDate = dateInputValueParse((validFrom as HTMLInputElement).value)
    userEvent.paste(validTo, dateInputValueFormat(subDays(fromDate, 1)))

    await waitFor(() => userEvent.click(btnSubmit))

    expect(validToMuiFilledInput).toHaveClass('Mui-error')
    expect(
      within(validToMuiFormControl as HTMLElement).getByText(
        "Must be greater or equal to 'Start date'"
      )
    ).toBeInTheDocument()

    expect(mockFetcher).not.toBeCalled()
  })

  it('validates usesMax is greater than 0 if filled', async () => {
    _render(<NewDiscount />)

    expect(screen.queryByTestId('fld-usesMax')).toBeNull()

    const limitBookings = screen
      .getByTestId('fld-limitBookings')
      .querySelector('input')

    expect(limitBookings).not.toBeChecked()
    userEvent.click(limitBookings as HTMLInputElement)
    expect(limitBookings).toBeChecked()

    const usesMax = screen.getByTestId('fld-usesMax')
    expect(usesMax).toBeInTheDocument()
    expect(usesMax).toHaveValue('1')

    await waitFor(() => userEvent.type(usesMax, '{selectall}0'))

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))

    const usesMaxMuiFilledInput = usesMax.parentElement as HTMLDivElement
    const usesMaxFormHelperText =
      usesMaxMuiFilledInput.nextSibling as HTMLParagraphElement

    expect(usesMaxMuiFilledInput).toHaveClass('Mui-error')
    expect(usesMaxFormHelperText).toHaveClass('Mui-error')
    expect(usesMaxFormHelperText).toHaveTextContent(
      'Maximum usages must be greater than or equal to 1'
    )

    expect(mockFetcher).not.toBeCalled()
  })

  it('navigates to Discounts list when cancel is clicked', async () => {
    _render(<NewDiscount />)

    const btnCancel = screen.getByTestId('btn-cancel')
    await waitFor(() => userEvent.click(btnCancel))

    expect(mockFetcher).not.toBeCalled()
    expect(mockNavigate).toBeCalledWith('..')
  })

  it('submits as expected when all data is valid', async () => {
    const code = chance.word({ length: 10 }).toUpperCase()

    _render(<NewDiscount />)

    const fldCode = screen.getByTestId('fld-code')
    userEvent.type(fldCode, code)

    const btnSubmit = screen.getByTestId('btn-submit')
    await waitFor(() => userEvent.click(btnSubmit))

    expect(mockFetcher).toBeCalledWith(
      expect.stringContaining('mutation InsertPromoCode'),
      {
        promoCode: {
          amount: 5,
          approvedBy: profile?.id,
          bookerSingleUse: true,
          code,
          courses: [],
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
    expect(mockNavigate).toBeCalledWith('..')
  })
})

/**
 * Helpers
 */

function _render(ui: React.ReactElement) {
  return render(<Provider value={client as unknown as Client}>{ui}</Provider>)
}
