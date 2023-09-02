import React from 'react'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { profile } from '@test/providers'

import { EditPricesModal } from './EditPricesModal'

vi.mock('@app/hooks/use-fetcher')
vi.mock('@app/hooks/useProfile')
vi.mock('@app/queries/pricing/set-course-pricings', () => ({
  MUTATION: 'set-pricings-query',
}))
const useFetcherMock = vi.mocked(useFetcher)

describe('component: EditPricesModal', () => {
  const pricings = [
    {
      id: chance.guid(),
      priceAmount: 100,
      priceCurrency: 'GBP',
      level: Course_Level_Enum.Level_1,
      type: Course_Type_Enum.Open,
      blended: true,
      reaccreditation: true,
      xeroCode: 'LEVEL1.OP',
    },
    {
      id: chance.guid(),
      priceAmount: 200,
      priceCurrency: 'GBP',
      level: Course_Level_Enum.Level_2,
      type: Course_Type_Enum.Closed,
      blended: true,
      reaccreditation: true,
      xeroCode: 'LEVEL2.CL',
    },
  ]

  const onCloseMock = vi.fn()
  const onSaveMock = vi.fn()
  const fetcherMock = vi.fn()

  const setup = () => {
    useFetcherMock.mockReturnValue(fetcherMock)

    return render(
      <EditPricesModal
        pricings={pricings}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />
    )
  }

  it('renders as expected', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByText('Bulk edit prices')).toBeInTheDocument()

      const priceInput = screen.getByTestId('field-price-amount')
      expect(priceInput).toHaveValue('')

      const saveButton = screen.getByText('Save details')
      expect(saveButton).toBeDisabled()

      const cancelButton = screen.getByText('Cancel')
      expect(cancelButton).toBeEnabled()

      const tableRows = screen.getAllByRole('row')
      expect(tableRows).toHaveLength(3)
    })
  })

  it('cancels edit price', async () => {
    setup()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSaveMock).toHaveBeenCalledTimes(0)
    expect(fetcherMock).toHaveBeenCalledTimes(0)
  })

  it('saves edit price', async () => {
    setup()

    const saveButton = screen.getByText('Save details')
    expect(saveButton).toBeDisabled()

    const priceInput = screen.getByTestId('field-price-amount')
    await userEvent.type(priceInput, '300')

    await waitFor(() => {
      expect(saveButton).toBeEnabled()
    })

    await userEvent.click(saveButton)
    expect(onCloseMock).toHaveBeenCalledTimes(0)
    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith('set-pricings-query', {
      coursePricingIds: pricings.map(p => p.id),
      coursePricingChangelogs: pricings.map(({ id, priceAmount }) => {
        return {
          coursePricingId: id,
          oldPrice: priceAmount,
          newPrice: 300,
          authorId: profile?.id,
        }
      }),
      newPrice: 300,
    })
    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })

  it('handles the display of the alert', async () => {
    setup()

    const saveButton = screen.getByText('Save details')
    expect(saveButton).toBeDisabled()

    const tableRows = screen.getAllByRole('row')
    expect(tableRows).toHaveLength(3)

    const priceInput = screen.getByTestId('field-price-amount')
    await userEvent.type(priceInput, '150')

    expect(screen.getByRole('alert').textContent).toContain(
      'Change of price is lower than the original cost.'
    )

    expect(saveButton).toBeEnabled()

    const deleteButtons = within(screen.getByRole('table')).getAllByRole(
      'button'
    )
    await userEvent.click(deleteButtons[1])

    await waitFor(() => {
      const updatedTableRows = screen.getAllByRole('row')
      expect(updatedTableRows).toHaveLength(2)
      const errorAlert = screen.queryByRole('alert')
      expect(errorAlert).not.toBeInTheDocument()
    })
  })
})
