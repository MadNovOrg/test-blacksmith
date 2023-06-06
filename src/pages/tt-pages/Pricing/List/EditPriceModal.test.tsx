import React from 'react'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'

import { chance, render, screen, userEvent, waitFor } from '@test/index'
import { profile } from '@test/providers'

import { EditPriceModal } from './EditPriceModal'

jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/hooks/useProfile')
jest.mock('@app/queries/pricing/set-course-pricing', () => ({
  MUTATION: 'set-pricing-query',
}))
const useFetcherMock = jest.mocked(useFetcher)

const pricing = {
  id: chance.guid(),
  priceAmount: 100,
  priceCurrency: 'GBP',
  level: Course_Level_Enum.Level_1,
  type: Course_Type_Enum.Open,
  blended: true,
  reaccreditation: true,
  xeroCode: 'LEVEL1.OP',
}

describe('component: EditPriceModal', () => {
  const onCloseMock = jest.fn()
  const onSaveMock = jest.fn()
  const fetcherMock = jest.fn()

  const setup = () => {
    useFetcherMock.mockReturnValue(fetcherMock)

    return render(
      <EditPriceModal
        pricing={pricing}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />
    )
  }

  it('renders as expected', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByText('Edit price')).toBeInTheDocument()

      const priceInput = screen.getByTestId('field-price-amount')
      expect(priceInput).toHaveValue('100')

      const saveButton = screen.getByText('Save details')
      expect(saveButton).toBeEnabled()

      const cancelButton = screen.getByText('Cancel')
      expect(cancelButton).toBeEnabled()
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

    const priceInput = screen.getByTestId('field-price-amount')
    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '200')

    await userEvent.click(screen.getByRole('button', { name: 'Save details' }))

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(0)
      expect(fetcherMock).toHaveBeenCalledTimes(1)
      expect(fetcherMock).toHaveBeenCalledWith('set-pricing-query', {
        id: pricing.id,
        oldPrice: pricing.priceAmount,
        priceAmount: 200,
        authorId: profile?.id,
      })
      expect(onSaveMock).toHaveBeenCalledTimes(1)
    })
  })

  it('handles error', async () => {
    setup()

    fetcherMock.mockRejectedValueOnce(new Error('Failed for tests'))

    await waitFor(() => {
      const saveButton = screen.getByText('Save details')
      expect(saveButton).toBeEnabled()
      userEvent.click(screen.getByRole('button', { name: 'Save details' }))
      expect(onCloseMock).toHaveBeenCalledTimes(0)
      expect(fetcherMock).toHaveBeenCalledTimes(1)
      expect(fetcherMock).toHaveBeenCalledWith('set-pricing-query', {
        id: pricing.id,
        oldPrice: pricing?.priceAmount,
        priceAmount: 100,
        authorId: profile?.id,
      })
      expect(onSaveMock).toHaveBeenCalledTimes(0)
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"Failed for tests"`
      )
    })
  })
})
