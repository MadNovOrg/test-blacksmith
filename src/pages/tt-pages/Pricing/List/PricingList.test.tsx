import React from 'react'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useCoursePricing } from '@app/hooks/useCoursePricing'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { PricingList } from './PricingList'

jest.mock('@app/hooks/useCoursePricing')

const useCoursePricingMock = jest.mocked(useCoursePricing)

describe('component: PricingList', () => {
  const setup = () => {
    useCoursePricingMock.mockReturnValue({
      coursePricing: [
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
      ],
      total: 1,
      error: undefined,
      status: LoadingStatus.IDLE,
      isLoading: false,
      mutate: jest.fn(),
    })
    render(<PricingList />)
  }

  it('renders the component', () => {
    setup()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByCourseLevel')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByCourseType')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByBlendedLearning')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByReaccreditation')).toBeInTheDocument()
    const bulkEditButton = screen.getByText('Bulk edit prices')
    expect(bulkEditButton).toBeDisabled()
  })

  it('enables the bulk edit button', async () => {
    setup()
    const bulkEditButton = screen.getByText('Bulk edit prices')
    expect(bulkEditButton).toBeDisabled()

    const table = screen.getByRole('table')
    const checkbox = within(table).getAllByRole('checkbox')
    await userEvent.click(checkbox[0])

    await waitFor(() => {
      const updatedBulkEditButton = screen.getByText('Bulk edit prices')
      expect(updatedBulkEditButton).toBeEnabled()
    })
  })
})
