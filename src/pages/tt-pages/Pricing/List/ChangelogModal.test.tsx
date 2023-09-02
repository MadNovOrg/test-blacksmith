import React from 'react'
import useSWR from 'swr'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { QUERY } from '@app/queries/pricing/get-pricing-changelog'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { ChangelogModal } from './ChangelogModal'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

const useSWRMockDefaults = {
  data: {
    course_pricing_changelog: [],
    course_pricing_changelog_aggregate: {
      aggregate: {
        count: 0,
      },
    },
  },
  mutate: vi.fn(),
  isValidating: false,
  error: null,
  isLoading: false,
}

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

const changelogData = {
  course_pricing_changelog: [
    {
      id: chance.guid(),
      author: {
        id: chance.guid(),
        fullName: chance.name(),
      },
      createdAt: new Date().toISOString(),
      oldPrice: 90,
      newPrice: 100,
    },
    {
      id: chance.guid(),
      author: {
        id: chance.guid(),
        fullName: chance.name(),
      },
      createdAt: new Date().toISOString(),
      oldPrice: 80,
      newPrice: 90,
    },
  ],
  course_pricing_changelog_aggregate: {
    aggregate: {
      count: 2,
    },
  },
}

describe('component: ChangelogModal', () => {
  const onCloseMock = vi.fn()

  it('renders as expected', async () => {
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: changelogData,
    })
    render(<ChangelogModal onClose={onCloseMock} coursePricing={pricing} />)

    await waitFor(() => {
      expect(screen.getByText('Pricing history')).toBeInTheDocument()
      const closeButton = screen.getByText('Close')
      expect(closeButton).toBeEnabled()
      expect(useSWRMock).toHaveBeenCalledWith([
        QUERY,
        {
          where: { coursePricingId: { _eq: pricing.id } },
          limit: 5,
          offset: 0,
        },
      ])
      expect(screen.getByText('Level One')).toBeInTheDocument()
      expect(screen.getByText('Open')).toBeInTheDocument()
      expect(
        screen.getByText('Reaccreditation, Blended learning')
      ).toBeInTheDocument()

      const tableRows = screen.getAllByRole('row')
      expect(tableRows).toHaveLength(3)
      expect(
        screen.getByText('Changed price from £90.00 to £100.00')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Changed price from £80.00 to £90.00')
      ).toBeInTheDocument()
    })
  })

  it('shows an empty table', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)
    render(<ChangelogModal onClose={onCloseMock} coursePricing={pricing} />)

    await waitFor(() => {
      const tableRows = screen.getAllByRole('row')
      expect(tableRows).toHaveLength(2)
      expect(
        screen.getByText('No pricing history at this time')
      ).toBeInTheDocument()
    })
  })

  it('closes changelog modal', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)
    render(<ChangelogModal onClose={onCloseMock} coursePricing={pricing} />)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
