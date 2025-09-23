import { setMedia } from 'mock-match-media'
import { getI18n } from 'react-i18next'

import { act, _render, screen, userEvent, waitFor, within } from '@test/index'

import { FilterByDates } from './FilterByDates'

const { t } = getI18n()
const errors = {
  endDateBeforeStartDate: t(
    'components.filter-dates.validation.end-date-before-start-date',
  ),
  startDateAfterEndDate: t(
    'components.filter-dates.validation.start-date-after-end-date',
  ),
  invalidDate: t('components.filter-dates.validation.invalid-date'),
}

describe(FilterByDates.name, () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  it('calls onChange as expected when from changes', async () => {
    const onChange = vi.fn()
    _render(<FilterByDates onChange={onChange} title={'Filter by Date'} />)

    const from = screen.getByLabelText('From')

    act(() => {
      from.focus()
    })

    await userEvent.paste('30/05/2022')

    expect(from).toHaveValue('30/05/2022')

    expect(onChange).toHaveBeenCalledWith(
      new Date('2022-05-30T00:00:00'),
      undefined,
    )
  })

  it('calls onChange as expected when to changes', async () => {
    const onChange = vi.fn()
    _render(<FilterByDates onChange={onChange} title={'Filter by Date'} />)

    const to = screen.getByLabelText('To')

    act(() => {
      to.focus()
    })

    await userEvent.paste('30/05/2022')

    expect(to).toHaveValue('30/05/2022')

    expect(onChange).toHaveBeenCalledWith(
      undefined,
      new Date('2022-05-30T00:00:00'),
    )
  })

  it('shows an error if the "to" date is before the "from" date or vice-versa', async () => {
    const onChange = vi.fn()
    _render(<FilterByDates onChange={onChange} title={'Filter by Date'} />)

    const from = screen.getByLabelText('From')

    act(() => {
      from.focus()
    })

    await userEvent.paste('30/07/2024')

    expect(from).toHaveValue('30/07/2024')

    const dateFrom = screen.getByTestId('DateFrom')
    expect(
      within(dateFrom).queryByText(errors.startDateAfterEndDate),
    ).not.toBeInTheDocument()

    const dateTo = screen.getByTestId('DateTo')
    expect(
      within(dateTo).queryByText(errors.endDateBeforeStartDate),
    ).not.toBeInTheDocument()

    const to = screen.getByLabelText('To')

    act(() => {
      to.focus()
    })

    await userEvent.paste('15/05/2022')

    expect(to).toHaveValue('15/05/2022')

    await waitFor(() => {
      expect(
        within(dateFrom).getByText(errors.startDateAfterEndDate),
      ).toBeInTheDocument()
      expect(
        within(dateTo).getByText(errors.endDateBeforeStartDate),
      ).toBeInTheDocument()
    })

    expect(onChange).toHaveBeenCalledWith(
      new Date('2024-07-30T00:00:00'),
      undefined,
    )
  })
})
